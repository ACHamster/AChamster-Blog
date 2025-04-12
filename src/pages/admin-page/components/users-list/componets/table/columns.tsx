import { ColumnDef } from "@tanstack/react-table";

import { FilePenLine, MoreHorizontal, Trash2} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import apiClient from "@/lib/api.ts";
import {toast} from "sonner";

export type User = {
   id: string,
   username: string,
   email: string,
   userGroupId: number,
};

export const columns = (onDelete: (id: string) => void): ColumnDef<User>[] => [
   {
      accessorKey: "id",
      header: "ID",
   },
   {
      accessorKey: "username",
      header: "用户名",
   },
   {
      accessorKey: "email",
      header: "邮箱",
   },
   {
      accessorKey: "userGroup",
      header: "用户组",
   },
   {
      id: "actions",
      cell: ({ row }) => {
         const post = row.original;
         return (
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuLabel>操作</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem
                   className="flex justify-between"
                   onClick={()=>{
                      console.log("编辑", post);}}
                 >
                    <span>编辑</span>
                    <FilePenLine />
                 </DropdownMenuItem>
                 <DropdownMenuItem
                   className="flex justify-between"
                   onClick={async ()=>{
                      try {
                         await apiClient.delete(`posts/${post.id}`);
                         onDelete(post.id);
                         toast("删除成功");
                      } catch (error) {
                         toast("删除失败: " + (error instanceof Error ? error.message : String(error)));
                      }
                   }
                 }
                 >
                    <span>删除</span>
                    <Trash2 />
                 </DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
         )
      },
   },
];
