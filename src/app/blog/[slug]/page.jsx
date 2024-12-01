import React from 'react';
import { getAllPosts, getPostBySlug } from '@/pages/api/post';
import { notFound } from 'next/navigation';
import log from 'eslint-plugin-react/lib/util/log';
import HTMLContentParser from '@/app/blog/componets/ArticleCotentParser';

// 生成所有可能的博客路径
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <h4 className="text-sm text-gray-600">{post.excerpt}</h4>
        <div className="text-gray-600">
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {post.tags && (
            <div className="mt-4 flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      {console.log(post.content)}
      <div
        className="prose prose-lg max-w-none"
        // dangerouslySetInnerHTML={{ __html: post.content }}
      >
        <HTMLContentParser content={post.content} />
      </div>
    </article>
  );
}
