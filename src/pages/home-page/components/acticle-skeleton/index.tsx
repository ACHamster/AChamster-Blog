import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ArticleSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 bg-white rounded-lg shadow-md mb-8 p-6">
      <div className="flex h-full items-start">
        <div className="flex-1 flex flex-col justify-between h-full">
          <div>
            <Skeleton className="h-8 w-[70%] mb-3" />
            <div className="my-3">
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="mt-2 flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="w-72 h-full ml-6">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
