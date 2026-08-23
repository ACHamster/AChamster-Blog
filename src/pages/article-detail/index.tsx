import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import Image from '@tiptap/extension-image';
import { all, createLowlight } from 'lowlight';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import '@/components/tiptap-editor/editor.css';
import { fetchPostById } from '@/lib/api';

interface ArticleData {
  id: number | string;
  title: string;
  common_tag?: string[];
  common_tags?: string[];
  content: string;
  date: Date | string;
  description?: string;
  cover?: string;
}

const lowlight = createLowlight(all);

const formatDate = (dateStr: Date | string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

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
        if (result.success && result.data) {
          setPost(result.data);
          if (editor && result.data.content) {
            try {
              editor.commands.setContent(JSON.parse(result.data.content));
            } catch {
              editor.commands.setContent(result.data.content);
            }
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

  // 获取标签列表（兼容 common_tag 与 common_tags）
  const tags = post?.common_tags || post?.common_tag || [];

  return (
    <div className="min-h-screen w-full bg-editorial-background text-editorial-foreground flex flex-col">
      {/* 顶部导航 */}
      <header className="flex h-20 shrink-0 items-center justify-between px-8 md:px-14 lg:px-16 select-none border-b border-editorial-divider/40">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-clash-display text-2xl lg:text-3xl font-medium tracking-tight text-editorial-foreground hover:text-editorial-accent transition-colors"
          >
            AChamster Blog
          </Link>
        </div>

        <nav className="flex items-center space-x-8 text-sm lg:text-base font-editorial-sans">
          <Link
            to="/"
            className="text-editorial-accent font-medium transition-colors"
          >
            文章
          </Link>
          <Link
            to="/anime-list"
            className="text-editorial-muted hover:text-editorial-accent transition-colors"
          >
            追番列表
          </Link>
        </nav>
      </header>

      {/* 主体文章区域 */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-10 lg:px-12 pt-8 pb-24">
        {loading ? (
          /* 骨架屏加载状态 */
          <div className="animate-pulse space-y-6">
            <div className="h-3.5 w-24 bg-stone-200/70 rounded-xs mb-4" />
            <div className="h-3 w-28 bg-stone-200/70 rounded-xs" />
            <div className="h-10 w-3/4 bg-stone-200/90 rounded-xs" />
            <div className="h-4 w-40 bg-stone-200/60 rounded-xs" />
            <div className="w-full h-px bg-editorial-divider my-8" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-200/50 rounded-xs" />
              <div className="h-4 w-full bg-stone-200/50 rounded-xs" />
              <div className="h-4 w-5/6 bg-stone-200/50 rounded-xs" />
              <div className="h-4 w-4/5 bg-stone-200/50 rounded-xs" />
            </div>
          </div>
        ) : !post ? (
          /* 文章未找到状态 */
          <div className="py-24 text-center select-none">
            <h2 className="font-editorial-serif text-2xl text-editorial-muted mb-3">
              未找到该文章
            </h2>
            <p className="text-xs font-editorial-sans text-editorial-muted/80 mb-6">
              文章可能已被删除或路径不正确
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-editorial-accent hover:underline font-editorial-sans"
            >
              <span>←</span> 返回文章列表
            </Link>
          </div>
        ) : (
          /* 文章正文展示 */
          <article className="w-full">
            {/* 文章头部元数据 */}
            <header className="mb-8">
              {/* 日期上方的返回链接 */}
              <div className="mb-4">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-1 text-xs font-editorial-sans text-editorial-muted hover:text-editorial-accent transition-colors"
                >
                  <span className="transition-transform group-hover:-translate-x-1">←</span> 返回文章列表
                </Link>
              </div>

              {/* 日期与标签 */}
              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                <span className="font-clash-display text-editorial-muted tracking-wider">
                  {formatDate(post.date)}
                </span>
                {tags.length > 0 && (
                  <>
                    <span className="text-editorial-divider">|</span>
                    <div className="text-editorial-accent font-medium font-editorial-sans">
                      {tags.map((tag) => (
                        <span key={tag} className="mr-1.5">
                          {tag} <span className="text-editorial-accent/40">/</span>
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 文章主标题 */}
              <h1 className="font-editorial-serif text-3xl md:text-4xl lg:text-[42px] font-medium text-editorial-foreground leading-[1.25] tracking-tight">
                {post.title}
              </h1>

              {/* 文章导语/摘要 */}
              {post.description && (
                <p className="mt-4 text-sm md:text-base text-editorial-body/80 font-editorial-sans font-light leading-relaxed border-l-2 border-editorial-accent/60 pl-4 italic">
                  {post.description}
                </p>
              )}
            </header>

            {/* 顶部分割线 */}
            <div className="w-full h-px bg-editorial-divider mb-10" />

            {/* 文章内容 */}
            <div className="editorial-prose prose max-w-none text-editorial-body text-base lg:text-[17px] font-editorial-sans leading-relaxed">
              <EditorContent editor={editor} />
            </div>

            {/* 底部分割线 */}
            <div className="w-full h-px bg-editorial-divider mt-16 mb-10" />

            {/* 底部导航与作者卡片（左侧返回文章列表无边框，右侧作者头像信息） */}
            <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
              <Link
                to="/"
                className="group inline-flex items-center gap-1.5 text-xs text-editorial-accent hover:text-editorial-accent-hover transition-colors font-editorial-sans font-medium self-start sm:self-auto"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span> 返回文章列表
              </Link>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border border-editorial-divider bg-stone-200/60">
                  <img
                    src="https://img.achamster.com/uploads%2F36910976_p0.png"
                    alt="AChamster"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-editorial-serif text-base text-editorial-foreground font-medium">
                    AChamster
                  </div>
                  <div className="text-[11px] text-editorial-muted font-editorial-sans font-light">
                    前端开发者 · ACGN 爱好者
                  </div>
                </div>
              </div>
            </footer>
          </article>
        )}
      </main>
    </div>
  );
}
