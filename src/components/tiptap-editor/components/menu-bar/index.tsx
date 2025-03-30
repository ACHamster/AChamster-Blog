import {Button} from "@/components/ui/button.tsx";
import {Editor} from "@tiptap/react";
import React, {useState} from "react";
import axios from "axios";
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


interface MenuBarProps {
  editor: Editor | null;
}

interface Article {
  content: object;
  title: string;
  description?: string;
}


export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  const [title, setTitle] = useState<string>("未命名文章");
  const [desc, setDesc] = useState<string>("");

  if (!editor) {
    return null;
  }

  const handleBasicInfo = () => {
    const content = editor.getJSON();

    // 查找第一个 level 1 的标题
    const firstHeading = content.content?.find(
      node => node.type === 'heading' && (node.attrs as { level: number }).level === 1
    );

    if (firstHeading?.content?.[0]?.text) {
      setTitle(firstHeading.content[0].text);
    }
  }

  const handlePush = async () => {

    try {
      const content = editor.getJSON();

      const articleData: Article = {
        title: title || "未命名标题",
        description: desc,
        content: content,
      };

      const response = await axios.post('/api/posts', articleData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        // 成功处理
        console.log('Article created successfully');
      }
    } catch (error) {
      // 错误处理
      console.error('Failed to create article:', error);
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
            onClick={() => handleBasicInfo()}
          >
            发布
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>确认要发布这篇文章吗</DrawerTitle>
            <DrawerDescription>请确定文章标题和概述</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
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
          </div>
          <DrawerFooter>
            <Button onClick={() => handlePush()}>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
