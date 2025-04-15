import React, {useEffect, useState} from 'react';
import FileCard from "@/pages/admin-page/components/file-list/file-card";
import apiClient from "@/lib/api.ts";
import {Progress} from "@/components/ui/progress.tsx";

interface FileItem {
  id: string;
  file_path: string;
  file_name: string;
  size: string;
}

interface FileListResponse {
  files: FileItem[];
  totalSize: number;
  totalSizeFormatted: string;
}

const FileList: React.FC = () => {
  const [fileData, setFileData] = useState<FileListResponse>({
    files: [],
    totalSize: 0,
    totalSizeFormatted: '0 B'
  });

  const getFileList = async ()=>{
    const res = await apiClient('oss-archive/files');
    return res.data;
  }

  useEffect(() => {
    const fetchFileList = async () => {
      try {
        const data = await getFileList();
        console.log(data);
        setFileData(data);
      } catch (err) {
        console.error('获取文章列表失败:', err);
      }
    };

    fetchFileList();
  }, []);

  const handleDelete = async (id: string, fileName: string) => {
    try {
      await apiClient.post('oss-archive/delete', {
        data: { id, fileName }
      });

      // 更新状态，移除已删除的文件
      setFileData(prev => ({
        ...prev,
        files: prev.files.filter(file => file.id !== id)
      }));
    } catch (err) {
      console.error('删除文件失败:', err);
    }
  };

  const TOTAL_CAPACITY_GB = 10; // 10GB总容量
  const TOTAL_CAPACITY_BYTES = TOTAL_CAPACITY_GB * 1024 * 1024 * 1024; // 转换为字节

  const usedPercentage = (fileData.totalSize / TOTAL_CAPACITY_BYTES) * 100;
  const capacityDisplay = `${fileData.totalSizeFormatted}/${TOTAL_CAPACITY_GB}GB`;

  return (
    <div className="container mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-6">已上传文件</h2>

      <div className="mb-4 text-sm text-gray-600 flex items-center">
        <Progress className="w-1/4" value={usedPercentage}/>
        <div className="ml-2">存储空间: {capacityDisplay} ({usedPercentage.toFixed(1)}%)</div>
        <div className="ml-2">文件数量: {fileData.files.length}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {fileData.files.map(file => (
          <FileCard
            key={file.id}
            id={file.id}
            imageUrl={file.file_path}
            title={file.file_name}
            size={file.size}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
