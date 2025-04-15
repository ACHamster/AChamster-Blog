import React from 'react';
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import { Trash } from "lucide-react";

interface FileCardProps {
  id: string
  imageUrl: string;
  title: string;
  size: string;
  onDelete: (id: string, fileName: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ id, imageUrl, title, size, onDelete }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="px-3">
        <div className="aspect-square overflow-hidden rounded-xl">
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={title}
          />
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="h-5 flex justify-between py-2 px-3">
        <div className="max-w-9/10">
          <div className="font-medium text-sm truncate max-w-[70%]" title={title}>{title}</div>
          <div className="text-xs text-gray-500">{size}</div>
        </div>
        <Trash
          className="w-4 cursor-pointer"
          onClick={()=> onDelete(id, title)}
        />
      </CardFooter>
    </Card>
  );
};

export default FileCard;
