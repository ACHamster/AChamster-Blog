import React, { useEffect, useState } from 'react';
import apiClient from "@/lib/api.ts";
import {DataTable} from "@/pages/admin-page/components/posts-list/componets/table/data-table.tsx";
import {columns, Post} from "@/pages/admin-page/components/posts-list/componets/table/columns.tsx";

const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient('/posts/list');
  return response.data;
}

const PostsList :React.FC = () => {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await getPosts();
        setData(postsData);
        setError(null);
      } catch (err) {
        console.error('获取文章列表失败:', err);
        setError('获取文章列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = (id: string) => {
    setData(prevData => prevData.filter(post  => post.id !== id));
  };

  if (loading) return <div className="text-center py-10">加载中...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns(handleDelete)} data={data}/>
    </div>
  );
};

export default PostsList;
