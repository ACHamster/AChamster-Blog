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

const lowlight = createLowlight(all);

const Tiptap = () => {
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
      Image.configure({
        allowBase64: true,
      }),
    ], // 基础功能，如加粗、斜体、列表等
    content: `<h1>锦城课堂大于天</h1>`,
  });

  return (
    <div className={"prose tiptap-editor"}>
      <MenuBar editor={editor} />
      {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="bg-white rounded-sm flex gap-1 p-2 shadow-xl">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className = "flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className = "flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className = "flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className = "flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded-xs p-1"
          >
            <CodeXml className="h-4 w-4" />
          </button>
        </div>
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </div>
  )
};

export default Tiptap;
