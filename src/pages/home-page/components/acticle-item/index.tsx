import {NavLink} from "react-router";
import React from "react";

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
}

const ArticleItem: React.FC<ArticleItemProps> = ({ post }) => {
  return (
    <article
      key={post.id}
      className="w-full h-64 bg-white rounded-lg shadow-md mb-8 p-6 hover:shadow-lg transition-shadow z-10"
    >
      <NavLink
        to={`/blog/${post.id}`}
        className="flex h-full items-start"
      >
        <div className="flex-1 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-semibold hover:text-sky-600">
              {post.title}
            </h2>
            <div className="text-gray-600 text-sm my-3">
              {new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {post.common_tags && (
                <div className="mt-2 flex gap-2">
                  {post.common_tags.map((tag :string) => (
                    <span
                      key={tag}
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-600">{post.description}</p>
          </div>
          <span className="text-sky-600 hover:text-sky-800 inline-block">
            阅读更多 →
          </span>
        </div>
        {post.cover && (
          <div className="w-72 h-full ml-6">
            <img src={post.cover} className="w-full h-full object-cover rounded-lg" alt="cover"/>
          </div>
        )}
      </NavLink>
    </article>
  );
};

export default ArticleItem;

