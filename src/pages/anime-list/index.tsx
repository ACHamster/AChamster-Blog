import React, { useEffect, useRef } from 'react';
import AnimeCard from "@/components/anime-card";
import { AnimeCardSkeleton } from "@/components/anime-card/skeleton";
import { useBangumiList } from "@/hooks/useBangumiList.ts";
import { useVirtualizer } from "@tanstack/react-virtual";

const CARD_HEIGHT = 240;
const ROW_HEIGHT = 260;

const AnimeList: React.FC = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useBangumiList();
  const parentRef = useRef<HTMLDivElement>(null);

  const flattenedList = data?.pages.flatMap(page => page.data) || [];
  const totalItems = data?.pages[0]?.total ?? 0;

  // 使用实际数据长度 + overscan，如果还有下一页则 +1 用于显示加载指示器
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: hasNextPage ? flattenedList.length + 1 : flattenedList.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5, // 预渲染5个额外项，提升滚动体验
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  // 使用 useEffect 避免在渲染期间调用 fetchNextPage
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    // 当滚动到最后一项且还有下一页且没有正在加载时，触发加载
    if (
      lastItem.index >= flattenedList.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    flattenedList.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  // 初始加载时显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full bg-editorial-background min-h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading...</div>
          <div className="flex flex-col gap-4 items-center">
            <AnimeCardSkeleton />
            <AnimeCardSkeleton />
            <AnimeCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-editorial-background">
      <div className="flex h-16 shrink-0 px-32 py-4 justify-between col-span-2 mb-20">
        <div className="text-editorial-accent">ARCHIVE / 2026</div>
        <div className="font-clash-display font-light text-sm text-editorial-foreground">
          TOTAL / {totalItems}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 w-full overflow-hidden px-16">
        {/* 左侧侧边栏标题区：固定在左侧 */}
        <div className="w-44 flex-shrink-0 pt-4 pr-8">
          <h1 className="text-2xl font-light text-editorial-foreground font-editorial-sans tracking-widest [writing-mode:vertical-rl] pr-4 border-r border-editorial-rail select-none">
            看过的作品
          </h1>
        </div>

        {/* 右侧列表区域：占据右侧大部分主要内容 */}
        <div
          ref={parentRef}
          className="min-h-0 flex-1 pb-8 overflow-y-auto no-scrollbar pl-4"
        >
          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualItems.map((virtualRow) => {
              const isLoaderRow = virtualRow.index > flattenedList.length - 1;
              const item = flattenedList[virtualRow.index];

              return (
                <div
                  key={virtualRow.key}
                  ref={rowVirtualizer.measureElement}
                  data-index={virtualRow.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="text-lg text-muted">Loading more...</div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="text-lg text-muted">No more data</div>
                      </div>
                    )
                  ) : item ? (
                    <div className="w-full h-full pr-12">
                      <div className="relative w-full max-w-5xl h-full ml-auto">
                        <AnimeCard animeInfo={item} />
                        {virtualRow.index < flattenedList.length - 1 && (
                          <div
                            className="absolute -left-12 w-[calc(100%+6rem)] h-px bg-editorial-rail/25"
                            style={{
                              top: `${CARD_HEIGHT + (ROW_HEIGHT - CARD_HEIGHT) / 2}px`,
                              transform: 'translateY(-50%)',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <AnimeCardSkeleton />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AnimeList;
