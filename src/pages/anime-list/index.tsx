import React, { useEffect, useRef } from 'react';
import AnimeCard from "@/components/anime-card";
import { AnimeCardSkeleton } from "@/components/anime-card/skeleton";
import { useBangumiList } from "@/hooks/useBangumiList.ts";
import { useVirtualizer } from "@tanstack/react-virtual";

const AnimeList: React.FC = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useBangumiList();
  const parentRef = useRef<HTMLDivElement>(null);

  const flattenedList = data?.pages.flatMap(page => page.data) || [];
  const total = data?.pages[0]?.total || 0;

  // 使用实际数据长度 + overscan，如果还有下一页则 +1 用于显示加载指示器
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: hasNextPage ? flattenedList.length + 1 : flattenedList.length,
    estimateSize: () => 210, // 根据实际卡片高度（h-52 = 208px + gap）
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
      <div className="flex justify-center items-center w-full bg-background min-h-screen">
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
    <div className="flex justify-center flex-wrap w-full bg-background min-h-screen">
      <h2 className="w-full text-center text-2xl font-bold my-6">
        Anime List ({flattenedList.length} / {total})
      </h2>
      <div
        ref={parentRef}
        className="w-3/5 flex flex-col gap-4 pb-8 items-center overflow-y-auto"
        style={{ height: '80vh' }}
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
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'flex',
                  justifyContent: 'center',
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
                  <AnimeCard
                    animeInfo={item}
                    style={{ width: '66.666667%' }} // 保持原有的 w-2/3 宽度
                  />
                ) : (
                  <AnimeCardSkeleton />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimeList;
