import {Button} from "@/components/ui/button.tsx";
import {Editor} from "@tiptap/react";
import React, {useState} from "react";
import apiClient from "@/lib/api"; // 替换axios导入为apiClient
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

interface MenuBarProps {
  editor: Editor | null;
  imageState?: Record<string, File>;
  setImageState?: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  title?: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}

interface Article {
  content: object;
  title: string;
  description?: string;
  cover?: string;
  quick_tag: Lines;
}

interface UploadStatus {
  uploading: boolean;
  progress: number;
  total: number;
  current: number;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor, imageState = {}, setImageState, title, setTitle }) => {
  const [desc, setDesc] = useState<string>("");
  const [quickTags, setQuickTags] = useState<Lines>(NoLines);
  const [Tags, setTags] = useState<Tag[]>([]);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    uploading: false,
    progress: 0,
    total: 0,
    current: 0
  });

  if (!editor) {
    return null;
  }

  const uploadImageToB2 = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await apiClient.post('/storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 修改Content-Type以适应文件上传
        },
      });
      return response.data.cdnUrl;
    } catch (error) {
      console.error('Failed to upload image:', error);
      // 不再返回null，而是抛出错误
      throw new Error('图片上传失败');
    }
  };

  const handlePush = async () => {
    setIsPublishing(true);

    try {
      // 处理文章图片上传
      if (Object.keys(imageState).length > 0 && setImageState) {
        const content = editor.getHTML();
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const images = doc.querySelectorAll('img[data-image-id]')
        const totalImages = images.length;

        console.log(images);

        let uploadFailures = 0;

        setUploadStatus({
          uploading: true,
          progress: 0,
          total: totalImages,
          current: 0
        });

        // 修改上传逻辑以单独处理每个上传并记录失败
        for (const [index, img] of Array.from(images).entries()) {
          const imageId = img.getAttribute('data-image-id');
          if (imageId && imageState[imageId]) {
            const file = imageState[imageId];
            try {
              const permanentUrl = await uploadImageToB2(file);

              setUploadStatus(prev => ({
                ...prev,
                current: index + 1,
                progress: Math.floor(index + 1/totalImages * 100),
              }));
              // 防止undefined或空字符串
              if (permanentUrl && permanentUrl.trim() !== '') {
                img.setAttribute('src', permanentUrl);
                img.removeAttribute('data-image-id');
              } else {
                console.error('获取到的URL无效:', permanentUrl);
                uploadFailures++;
              }
            } catch (error) {
              console.error('图片上传失败:', error);
              uploadFailures++;
            }
          }
        }
        // 重置上传状态
        setUploadStatus({
          uploading: false,
          progress: 0,
          total: 0,
          current: 0
        });

        // 如果有任何图片上传失败，则中止发布流程
        if (uploadFailures > 0) {
          toast(`${uploadFailures} 张图片上传失败，请重试`);
          setIsPublishing(false);
          return;
        }

        // 用处理后的HTML更新编辑器内容
        editor.commands.setContent(doc.body.innerHTML);

        // 清空临时图片状态
        setImageState({});
      }

      // 处理封面图上传
      let coverImageUrl = "";
      if (coverImage) {
        setUploadStatus({
          uploading: true,
          progress: 0,
          total: 1,
          current: 1
        });

        try {
          coverImageUrl = await uploadImageToB2(coverImage);
        } catch (error) {
          console.error('封面图上传失败:', error);
          toast("封面图上传失败，请重试");
          setIsPublishing(false);
          setUploadStatus({
            uploading: false,
            progress: 0,
            total: 0,
            current: 0,
          });
          return;
        }
      }

      setUploadStatus({
        uploading: false,
        progress: 0,
        total: 0,
        current: 0,
      });

      // 获取最终内容并提交
      const content = editor.getJSON();

      const common_tag: string[] = Tags.map(tag => tag.label);

      console.log("common_Tag",common_tag);
      console.log("quick_Tag",quickTags);

      const articleData: Article = {
        title: title || "未命名标题",
        description: desc,
        content: content,
        cover: coverImageUrl || undefined,
        quick_tag: quickTags,
      };

      const response = await apiClient.post('/posts', articleData);

      if (response.status === 201) {
        // 成功处理
        toast("文章发布成功");
      }
    } catch (error) {
      // 错误处理
      console.error('Failed to create article:', error);
      toast("发布文章失败，请重试");
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
    }
  }


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
              Tags={Tags}
            />
            {/*上传进度条*/}
            {uploadStatus.uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>正在上传图片 ({uploadStatus.current}/{uploadStatus.total})</span>
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

