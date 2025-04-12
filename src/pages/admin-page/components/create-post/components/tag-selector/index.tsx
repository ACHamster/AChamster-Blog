import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import {Plus, X} from "lucide-react"
import React, {useState} from "react"
import {Label} from "@/components/ui/label.tsx";
import { includeSomeLine, Line, Lines, mergeLines, removeLine } from "@/lib/quick-tag-by-lines.ts";
import {allTags} from "@/lib/tags.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";

interface Tag {
  label: string,
  line: Line,
}

interface TagSelectorProps {
  quickTags: Lines,
  setQuickTags: React.Dispatch<React.SetStateAction<Lines>>,
  Tags: Tag[],
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>,
}

// 从 quick-tag-by-lines.ts 获取所有标签

export function TagSelector({ quickTags, setQuickTags, Tags ,setTags } :TagSelectorProps) {
  const [open, setOpen] = useState<boolean>(false);

  const handleTagRemove = (tag: Tag) => {
    setTags(Tags.filter(t => (t.line & tag.line) === 0));
    setQuickTags(removeLine(quickTags, tag.line));
  }

  const handleTagAdd = (tag: Tag) => {
    setTags([...Tags, tag]);
    setQuickTags(mergeLines(quickTags, tag.line));
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Label>文章标签</Label>
      <div className="flex flex-wrap gap-1 mb-2">
        {Tags.map((tag) => (
          <Badge key={tag.label} variant="secondary" className="px-2 py-1">
            {tag.label}
            <button onClick={() => handleTagRemove(tag)}>
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
              />
            </button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="px-2 py-1 cursor-pointer"
            >
              <Plus className="h-3 w-3 mr-1" /> 选择标签
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="搜索标签..."/>
              <CommandEmpty>没有找到匹配的标签</CommandEmpty>
              <CommandGroup className="max-h-40 overflow-auto">
                {allTags.map((tag) => (
                  <CommandItem
                    key={tag.label}
                    onSelect={() => {
                      if (includeSomeLine(quickTags, tag.line)) {
                        handleTagRemove(tag);
                      } else {
                        handleTagAdd(tag);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={includeSomeLine(quickTags, tag.line)}
                        readOnly
                      />
                      {tag.label}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
