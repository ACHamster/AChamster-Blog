import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {MenuBar} from "@/components/tiptap-editor/components/menu-bar";
import Underline from "@tiptap/extension-underline";
import {CodeBlockLowlight} from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import {all, createLowlight} from "lowlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import {BubbleMenu} from "@tiptap/react";
import {Bold, CodeXml, Italic, Strikethrough} from "lucide-react";
import './editor.css';
import {useState} from "react";

const lowlight = createLowlight(all);

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

  return (
    <div className={"w-3/4 prose tiptap-editor"}>
      <MenuBar
        editor={editor}
        imageState={imageState}
        setImageState={setImageState}
        title={title}
        setTitle={setTitle}
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

