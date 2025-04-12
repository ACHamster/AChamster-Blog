import React, {useEffect, useState} from 'react';
import apiClient from "@/lib/api.ts";
import { User } from "@/pages/admin-page/components/users-list/componets/table/columns.tsx";
import {DataTable} from "@/pages/admin-page/components/users-list/componets/table/data-table.tsx";
import {columns} from "@/pages/admin-page/components/users-list/componets/table/columns.tsx";

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async () => {
    const response = await apiClient('/user/list');
    return response.data;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userData = await getUsers();
        console.log(userData);
        setData(userData);
        setError(null);
      } catch (err) {
        console.error('获取用户列表失败:', err);
        setError('获取用户列表失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    setData(prevData => prevData.filter(user  => user.id !== id));
  };

  if (loading) return <div className="text-center py-10">加载中...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns(handleDelete)} data={data}/>
    </div>
  );
};

export default UserList;
