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
import { Checkbox } from "@/components/ui/checkbox";
import apiClient from "@/lib/api.ts";
import {toast} from "sonner";
import {DataTableColumnHeader} from "@/components/ui/data-table-colunm.tsx";

export type Post = {
   id: string,
   title: string,
   date: string,
   tags: string[],
   accessLevel: number,
};

export const columns = (onDelete: (id: string) => void): ColumnDef<Post>[] => [
   {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "id",
      header: "ID",
   },
   {
      accessorKey: "title",
      header: "标题",
   },
   {
      accessorKey: "date", // 修改为实际数据中的字段名
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"日期"} />
      ),
      cell: ({ row }) => {
         const dateValue = row.getValue("date");
         if (!dateValue) return "暂无数据";
         return new Date(dateValue as string).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
         });
      },
   },
   {
      accessorKey: "accessLevel",
      header: "访问权限",
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
