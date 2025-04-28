import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {MenuBar} from "@/components/tiptap-editor/components/menu-bar";
import Underline from "@tiptap/extension-underline";
import {CodeBlockLowlight} from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import {common, createLowlight} from "lowlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import {BubbleMenu} from "@tiptap/react";
import {Bold, CodeXml, Italic, Strikethrough} from "lucide-react";
import './editor.css';
import {useEffect, useState} from "react";
import {fetchPostById} from "@/lib/api.ts";
import {useParams} from "react-router";
import {Lines, NoLines} from "@/lib/quick-tag-by-lines.ts";
import {Tag} from "@/lib/tags.ts";

const lowlight = createLowlight(common);

const CustomImage = Image.extend({
  // 添加自定义属性
  addAttributes() {
    return {
      ...this.parent?.(),
      imageId: {
        default: null,
      },
    };
  },
  // 自定义 HTML 渲染
  renderHTML({ node }) {
    const attrs: Record<string, any> = {
      src: node.attrs.src,
      alt: node.attrs.alt || '',
      title: node.attrs.title || '',
    };

    if (node.attrs.imageId) {
      attrs['data-image-id'] = node.attrs.imageId;
    }

    return ['img', attrs];
  },
});

const Tiptap = () => {
  const [imageState, setImageState] = useState<Record<string, File>>({});
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [quickTags, setQuickTags] = useState<Lines>(NoLines);
  const [tags, setTags] = useState<Tag[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const params = useParams();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
      CustomImage,
      // ImageResize,
    ], // 基础功能，如加粗、斜体、列表等
    content: `<p>图片上传测试</p>`,
    editorProps: {
      handlePaste: (view, event) => {
        if (!event.clipboardData) return false;

        const files = event.clipboardData.files;
        for (const file of files) {
          if (file.type.startsWith('image/')) {
            const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const tempUrl = URL.createObjectURL(file);

            // 插入图片节点
            const node = view.state.schema.nodes.image.create({
              src: tempUrl,
              imageId: imageId,
            });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);

            // 存储图片文件
            setImageState((prev) => ({ ...prev, [imageId]: file }));
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const result = await fetchPostById(params.id as string);
        if (result.success) {
          if (editor && result.data.content) {
            editor.commands.setContent(JSON.parse(result.data.content));
          }
          setTitle(result.data.title || '');
          setDesc(result.data.description || '');

          // 设置封面图
          if (result.data.cover) {
            setCoverImageUrl(result.data.cover);
          }

          // 设置标签
          if (result.data.quick_tag) {
            setQuickTags(result.data.quick_tag);
          }

          // 设置通用标签
          if (result.data.common_tag && Array.isArray(result.data.common_tag)) {
            // 将标签字符串数组转换��Tag对象数组
            const tagObjects = result.data.common_tag.map((tag: string) => ({ label: tag, value: tag }));
            setTags(tagObjects);
          }
        } else {
          console.error('Failed to fetch article:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params, editor]);

  return (
    <div className={"w-3/4 prose tiptap-editor"}>
      <MenuBar
        editor={editor}
        imageState={imageState}
        setImageState={setImageState}
        title={title}
        setTitle={setTitle}
        desc={desc}
        setDesc={setDesc}
        quickTags={quickTags}
        setQuickTags={setQuickTags}
        tags={tags}
        setTags={setTags}
        coverImageUrl={coverImageUrl}
        setCoverImageUrl={setCoverImageUrl}
      />
      {/*标题输入框*/}
      <input
        placeholder="新文章"
        className="h-16 mb-5 text-4xl focus:outline-none cursor-text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {editor && <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
        <div className="bg-white rounded-sm flex gap-1 p-2 shadow-xl">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <Bold className="h-4 w-4"/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <Italic className="h-4 w-4"/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <Strikethrough className="h-4 w-4"/>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <CodeXml className="h-4 w-4"/>
          </button>
        </div>
      </BubbleMenu>}
      <EditorContent editor={editor}/>
    </div>
  )
};

export default Tiptap;

