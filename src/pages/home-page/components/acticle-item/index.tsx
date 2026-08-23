import React from 'react';
import { Link } from 'react-router';

interface Post {
  id: string;
  title: string;
  date: string;
  common_tags?: string[];
  description: string;
  cover?: string;
}

interface ArticleItemProps {
  post: Post;
  isFirst?: boolean;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const ArticleItem: React.FC<ArticleItemProps> = ({ post, isFirst = false }) => {
  return (
    <article className="group relative w-full">
      <Link
        to={`/blog/${post.id}`}
        className={`flex flex-col-reverse md:flex-row md:items-stretch justify-between gap-6 pb-6 transition-colors ${
          isFirst ? 'pt-0' : 'pt-6'
        }`}
      >
        {/* 左侧文字信息区域 */}
        <div className="flex-1 flex flex-col justify-between min-w-0 pr-0 md:pr-4">
          <div>
            {/* 发布日期 */}
            <div className="text-xs text-editorial-muted font-clash-display tracking-wide mb-1.5 leading-none">
              {formatDate(post.date)}
            </div>

            {/* 文章标题 */}
            <h2 className="font-editorial-serif text-2xl lg:text-[26px] font-normal text-editorial-foreground group-hover:text-editorial-accent transition-colors leading-snug tracking-tight">
              {post.title}
            </h2>

            {/* 描述摘要 */}
            {post.description && (
              <p className="mt-2 text-xs lg:text-[13px] text-editorial-body/80 font-editorial-sans font-light leading-relaxed line-clamp-2">
                {post.description}
              </p>
            )}
          </div>

          {/* 底部信息：斜杠分隔标签与阅读全文 */}
          <div className="mt-4 pt-2 flex items-center justify-between gap-4">
            <div className="text-xs font-medium text-editorial-accent font-editorial-sans tracking-wide truncate">
              {post.common_tags && post.common_tags.length > 0 ? (
                post.common_tags.map((tag) => (
                  <span key={tag} className="mr-1.5">
                    {tag} <span className="text-editorial-accent/40">/</span>
                  </span>
                ))
              ) : (
                <span className="text-editorial-muted/60">随笔 /</span>
              )}
            </div>

            <span className="text-xs font-medium text-editorial-accent group-hover:text-editorial-accent-hover flex items-center gap-1 shrink-0 font-editorial-sans transition-all group-hover:translate-x-1">
              阅读全文 <span className="font-clash-display">→</span>
            </span>
          </div>
        </div>

        {/* 右侧封面图片区域（宽度增加25%，高度增加15%） */}
        {post.cover ? (
          <div className="w-full md:w-60 lg:w-72 h-34 md:h-36 lg:h-40 shrink-0 overflow-hidden bg-stone-200/60 border border-editorial-divider/70 relative">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="hidden md:flex w-60 lg:w-72 h-34 md:h-36 lg:h-40 shrink-0 bg-editorial-panel border border-editorial-divider/60 items-center justify-center p-4 text-center">
            <span className="font-editorial-serif text-xs text-editorial-accent/70 font-medium">
              AChamster
            </span>
          </div>
        )}
      </Link>

      {/* 分割线 */}
      <div className="w-full h-px bg-editorial-divider" />
    </article>
  );
};

export default ArticleItem;
