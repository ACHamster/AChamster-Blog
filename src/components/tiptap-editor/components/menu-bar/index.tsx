import {Button} from "@/components/ui/button.tsx";
import {Editor} from "@tiptap/react";
import React, {useState, useEffect} from "react";
import apiClient from "@/lib/api";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {toast} from "sonner";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {TagSelector} from "@/pages/admin-page/components/create-post/components/tag-selector";
import {Lines, NoLines} from "@/lib/quick-tag-by-lines.ts";
import {Tag} from "@/lib/tags.ts";
import {useParams} from "react-router";

interface MenuBarProps {
  editor: Editor | null;
  imageState?: Record<string, File>;
  setImageState?: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  title?: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  desc?: string;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  quickTags?: Lines;
  setQuickTags: React.Dispatch<React.SetStateAction<Lines>>;
  tags?: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  coverImageUrl?: string;
  setCoverImageUrl?: React.Dispatch<React.SetStateAction<string>>;
}

interface Article {
  id?: string;
  content: object;
  title: string;
  description?: string;
  cover?: string;
  quick_tag: Lines;
  common_tag: string[];
}

interface UploadStatus {
  uploading: boolean;
  progress: number;
  total: number;
  current: number;
  tip?: string;
}

interface ErrorClassification {
  message: string;
  isRetryable: boolean;
}

/**
 * 解析错误信息并判断是否可重试
 */
const parseUploadError = (error: any): ErrorClassification => {
  if (error?.response) {
    const status = error.response.status;
    const serverDetail =
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.statusText ||
      '';
    const detailSuffix = serverDetail ? ` (${serverDetail})` : '';

    if (status === 413) {
      return {
        message: `图片体积过大，超出服务器限制 (HTTP 413)${detailSuffix}`,
        isRetryable: false,
      };
    }
    if (status === 401 || status === 403) {
      return {
        message: `登录已过期或无上传权限 (HTTP ${status})${detailSuffix}`,
        isRetryable: false,
      };
    }
    if (status === 400 || status === 415) {
      return {
        message: `图片格式不受支持或请求无效 (HTTP ${status})${detailSuffix}`,
        isRetryable: false,
      };
    }
    if (status === 429) {
      return {
        message: `请求频率过高受到限制 (HTTP 429)${detailSuffix}`,
        isRetryable: true,
      };
    }
    if (status >= 500) {
      return {
        message: `服务器存储服务异常 (HTTP ${status})${detailSuffix}`,
        isRetryable: true,
      };
    }
    return {
      message: `上传服务响应错误 (HTTP ${status})${detailSuffix}`,
      isRetryable: false,
    };
  }

  if (error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')) {
    return { message: '上传超时，网络连接不稳定', isRetryable: true };
  }

  if (error?.message === 'Network Error' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return { message: '网络连接断开，请检查网络设置', isRetryable: true };
  }

  return { message: error?.message || '未知上传异常', isRetryable: true };
};

export const MenuBar: React.FC<MenuBarProps> = ({
  editor,
  imageState = {},
  setImageState,
  title,
  setTitle,
  desc = "",
  setDesc,
  quickTags = NoLines,
  setQuickTags,
  tags = [],
  setTags,
  coverImageUrl = "",
  setCoverImageUrl
}) => {
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    progress: 0,
    total: 0,
    current: 0
  });

  const params = useParams();

  // 使用useEffect来设置初始值
  useEffect(() => {
    if (coverImageUrl) {
      setCoverImagePreview(coverImageUrl);
    }
  }, [coverImageUrl]);

  if (!editor) {
    return null;
  }

  /**
   * 带自动固定重试的图片上传函数
   * @param file 上传的文件
   * @param maxRetries 最大重试次数（默认为 2，即最多尝试 3 次）
   * @param delayMs 每次重试等待毫秒数（固定 1000ms）
   */
  const uploadImageWithRetry = async (
    file: File,
    maxRetries = 2,
    delayMs = 1000
  ): Promise<string> => {
    let lastErrorMsg = '';

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/storage/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const cdnUrl = response.data?.cdnUrl;
        if (!cdnUrl || typeof cdnUrl !== 'string' || cdnUrl.trim() === '') {
          throw new Error('服务器未返回有效的图片链接');
        }
        return cdnUrl;
      } catch (error: any) {
        const { message, isRetryable } = parseUploadError(error);
        lastErrorMsg = message;

        console.warn(
          `[图片上传] 第 ${attempt + 1}/${maxRetries + 1} 次尝试失败: ${message}`,
          error
        );

        // 不可重试错误或已达到最大重试次数时直接抛出
        if (!isRetryable || attempt === maxRetries) {
          throw new Error(message);
        }

        // 等待固定时间后重试
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error(lastErrorMsg || '图片上传失败');
  };

  /**
   * 将编辑器内对应 imageId 的图片节点的 src 替换为正式 CDN URL，并移除 imageId 属性
   */
  const updateEditorImageSrc = (targetImageId: string, permanentUrl: string) => {
    if (!editor || !editor.view) return;
    const { state, view } = editor;
    let tr = state.tr;
    let updated = false;

    state.doc.descendants((node, pos) => {
      if (node.type.name === 'image' && node.attrs.imageId === targetImageId) {
        // 释放旧的本地临时 Blob URL，避免内存泄漏
        if (node.attrs.src && node.attrs.src.startsWith('blob:')) {
          URL.revokeObjectURL(node.attrs.src);
        }
        tr = tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: permanentUrl,
          imageId: null,
        });
        updated = true;
        return false;
      }
    });

    if (updated) {
      view.dispatch(tr);
    }
  };

  const handlePush = async () => {
    setIsPublishing(true);

    try {
      // 1. 处理正文图片上传
      // 精准扫描当前编辑器文档中尚存且待上传的图片节点
      const imagesToUpload: { imageId: string; file: File }[] = [];
      editor.state.doc.descendants((node) => {
        if (
          node.type.name === 'image' &&
          node.attrs.imageId &&
          imageState[node.attrs.imageId]
        ) {
          imagesToUpload.push({
            imageId: node.attrs.imageId,
            file: imageState[node.attrs.imageId],
          });
        }
      });

      const totalImages = imagesToUpload.length;

      if (totalImages > 0) {
        setUploadStatus({
          uploading: true,
          progress: 0,
          total: totalImages,
          current: 0,
          tip: '正在上传正文图片...',
        });

        for (let i = 0; i < totalImages; i++) {
          const { imageId, file } = imagesToUpload[i];
          try {
            const permanentUrl = await uploadImageWithRetry(file);

            // 成功后立即核销：
            // 1. 替换编辑器内节点为真实 URL，移除 imageId 属性
            updateEditorImageSrc(imageId, permanentUrl);

            // 2. 从 imageState 中核销删除该 ID，下次重试或发布时不再重复上传
            if (setImageState) {
              setImageState((prev) => {
                const next = { ...prev };
                delete next[imageId];
                return next;
              });
            }

            // 3. 更新进度
            setUploadStatus((prev) => ({
              ...prev,
              current: i + 1,
              progress: Math.floor(((i + 1) / totalImages) * 100),
            }));
          } catch (error: any) {
            console.error(`正文第 ${i + 1} 张图片上传失败:`, error);
            // 友好且详细地告知用户失败原因与文件名
            toast.error(
              `第 ${i + 1} 张图片 (${file.name || '正文图片'}) 上传失败: ${error.message}`
            );
            setIsPublishing(false);
            setUploadStatus({
              uploading: false,
              progress: 0,
              total: 0,
              current: 0,
            });
            // 中止发布流程，但已上传成功的图片已被永久替换并核销
            return;
          }
        }
      }

      // 正文图片全部处理完成，重置上传状态
      setUploadStatus({
        uploading: false,
        progress: 0,
        total: 0,
        current: 0,
      });

      // 2. 处理封面图上传（与正文图片隔离）
      let finalCoverImageUrl = coverImageUrl;
      if (coverImage) {
        setUploadStatus({
          uploading: true,
          progress: 0,
          total: 1,
          current: 1,
          tip: '正在上传封面图片...',
        });

        try {
          finalCoverImageUrl = await uploadImageWithRetry(coverImage);
          // 封面图成功：将 URL 同步至父级，并置空本地 File 实例以防再次重传
          if (setCoverImageUrl) {
            setCoverImageUrl(finalCoverImageUrl);
          }
          setCoverImage(null);
        } catch (error: any) {
          console.error('封面图上传失败:', error);
          toast.error(`封面图上传失败: ${error.message}`);
          setIsPublishing(false);
          setUploadStatus({
            uploading: false,
            progress: 0,
            total: 0,
            current: 0,
          });
          // 封面失败退出，此时正文已经完成并持久化，下次点击仅重试封面
          return;
        }
      }

      setUploadStatus({
        uploading: false,
        progress: 0,
        total: 0,
        current: 0,
      });

      // 3. 获取最新内容并提交文章
      const content = editor.getJSON();
      const common_tag = tags.map((tag) => tag.label);

      const articleData: Article = {
        id: params.id || undefined,
        title: title || "未命名标题",
        description: desc,
        content: content,
        cover: finalCoverImageUrl || undefined,
        quick_tag: quickTags,
        common_tag: common_tag || [],
      };

      console.log('提交文章数据:', articleData);

      const response = await apiClient.post('/posts', articleData);

      if (response.status === 201 || response.status === 200) {
        toast.success("文章发布成功");
      }
    } catch (error: any) {
      console.error('Failed to create article:', error);
      const errorMsg = error?.response?.data?.message || error?.message || '未知错误';
      toast.error(`发布文章失败: ${errorMsg}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
      if (setCoverImageUrl) {
        setCoverImageUrl(""); // 清除原来的URL，因为有了新的文件
      }
    }
  };

  return (
    <div className="toolbar flex gap-2 mb-4">
      <Button variant={"outline"} size={"sm"} onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}>
        Underline
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => editor.commands.toggleCodeBlock()}>
        Code Block
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}>
        H1
      </Button>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}>
        Bullet List
      </Button>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="bg-primary text-white hover:text-primary"
            size={"sm"}
          >
            发布
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>确认要发布这篇文章吗</DrawerTitle>
            <DrawerDescription>请确定文章标题和概述</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full border rounded-md p-2 mb-4"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="文章概述"
              className="w-full border rounded-md p-2"
            />
            <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
              <Label htmlFor="picture">文章封面</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="picture"
                  type="file"
                  onChange={handleCoverImageChange}
                  className="flex-1"
                />
                {coverImagePreview && (
                  <div className="h-30 aspect-auto flex-shrink-0">
                    <img
                      src={coverImagePreview}
                      alt="封面预览"
                      className="h-full w-full object-cover rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
            {/*标签选择*/}
            <TagSelector
              setQuickTags={setQuickTags}
              quickTags={quickTags}
              setTags={setTags}
              Tags={tags}
            />
            {/*上传进度条*/}
            {uploadStatus.uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {uploadStatus.tip || "正在上传图片"} ({uploadStatus.current}/{uploadStatus.total})
                  </span>
                  <span>{uploadStatus.progress}%</span>
                </div>
                <Progress value={uploadStatus.progress} className="h-2" />
                <p className="text-xs text-gray-500">
                  请勿关闭窗口，等待所有图片上传完成...
                </p>
              </div>
            )}
          </div>
          <DrawerFooter>
            <Button
              onClick={() => handlePush()}
              disabled={isPublishing}
            >
              {isPublishing ? "正在发布..." : "发布"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">取消</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
