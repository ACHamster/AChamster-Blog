import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { EditorContent, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from "@tiptap/extension-underline";
import {CodeBlockLowlight} from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import {all, createLowlight} from "lowlight";
import "highlight.js/styles/atom-one-dark-reasonable.css";
import "@/components/tiptap-editor/editor.css";
import { fetchPostById } from '@/lib/api';

interface ArticleData {
  id: number;
  title: string;
  common_tag: string[];
  content: string;
  date: Date;
}

const lowlight = createLowlight(all);

export default function ArticleDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

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
    ],
    editable: false,
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const result = await fetchPostById(id as string);
        if (result.success) {
          setPost(result.data);
          if (editor && result.data.content) {
            editor.commands.setContent(JSON.parse(result.data.content));
          }
        } else {
          console.error('Failed to fetch article:', result.error);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, editor]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!post) {
    return <div>Article not found</div>;
  }

  return (
    <div className="w-full h-full">
      <header className="flex justify-between w-screen fixed top-0 z-20 bg-white/70 backdrop-blur-md">
        <div className="left-0 m-2 text-xl lg:text-2xl font-clashDisplay">
          <Link to="/">AChamster Blog</Link>
        </div>
        <nav className="hidden lg:flex right-0 m-2 space-x-5 text-lg">
          <Link to="/">Test</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-24">
        <article>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex gap-2 mb-4">
            {post.common_tag?.map((tag) => (
              <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <time className="text-gray-600 block mb-8">
            {/*{.toLocaleDateString()}*/}
            {new Date(post.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </time>
          <div className="prose max-w-none">
            <EditorContent editor={editor} />
          </div>
        </article>
      </main>
    </div>
  );
}
