import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router';
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
      <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-editorial-background text-editorial-foreground">
        <header className="flex h-16 shrink-0 items-center justify-between px-8 md:px-14 lg:px-16 select-none">
          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="font-clash-display text-xs tracking-[0.2em] uppercase text-editorial-foreground transition-colors hover:text-editorial-accent"
            >
              ← HOME
            </Link>
            <span className="h-3 w-px bg-editorial-divider" aria-hidden="true" />
            <span className="font-clash-display text-xs tracking-[0.16em] text-editorial-accent font-medium uppercase">
              ARCHIVE / 2026
            </span>
          </div>
          <div className="h-3 w-20 animate-pulse bg-stone-200/60 rounded-xs" />
        </header>

        <div className="flex min-h-0 flex-1 w-full overflow-hidden px-8 md:px-14 lg:px-16">
          <aside className="w-64 lg:w-72 shrink-0 pt-4 pr-6 select-none animate-pulse">
            <div className="h-8 w-44 bg-stone-200/80 rounded-xs mb-4 -translate-y-1" />
            <div className="h-3 w-48 bg-stone-200/50 rounded-xs mb-6" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-stone-200/40 rounded-xs" />
              <div className="h-3 w-4/5 bg-stone-200/40 rounded-xs" />
            </div>
          </aside>

          <main className="min-h-0 flex-1 pb-8 overflow-hidden pl-6 lg:pl-10 pt-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="relative h-[260px] w-full pr-6 lg:pr-12">
                <div className="relative h-full w-full max-w-5xl ml-auto">
                  <AnimeCardSkeleton />
                  {index < 2 && (
                    <div
                      className="absolute -left-6 w-[calc(100%+3.5rem)] h-px bg-editorial-divider"
                      style={{
                        top: `${CARD_HEIGHT + (ROW_HEIGHT - CARD_HEIGHT) / 2}px`,
                        transform: 'translateY(-50%)',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-editorial-background text-editorial-foreground">
      {/* 顶部导航 */}
      <header className="flex h-16 shrink-0 items-center justify-between px-8 md:px-14 lg:px-16 select-none">
        <div className="flex items-center gap-5">
          <Link
            to="/"
            className="font-clash-display text-xs tracking-[0.2em] uppercase text-editorial-foreground transition-colors hover:text-editorial-accent"
          >
            ← HOME
          </Link>
          <span className="h-3 w-px bg-editorial-divider" aria-hidden="true" />
          <span className="font-clash-display text-xs tracking-[0.16em] text-editorial-accent font-medium uppercase">
            ARCHIVE / 2026
          </span>
        </div>
        <div className="font-clash-display text-xs tracking-[0.18em] text-editorial-muted">
          TOTAL <span className="text-editorial-foreground font-medium ml-1">/ {totalItems}</span>
        </div>
      </header>

      {/* 主体分栏 */}
      <div className="flex min-h-0 flex-1 w-full overflow-hidden px-8 md:px-14 lg:px-16">
        {/* 左侧侧边栏：极简杂志标题区 */}
        <aside className="w-64 lg:w-72 shrink-0 pt-4 pr-6 select-none">
          <h1 className="text-3xl lg:text-4xl font-normal text-editorial-foreground font-editorial-serif tracking-tight leading-none -translate-y-1 mb-4">
            看过的作品
          </h1>

          <div className="font-clash-display text-xs tracking-[0.22em] uppercase text-editorial-muted/80 mb-6">
            MEDIA &amp; NOVEL ARCHIVE
          </div>

          <p className="text-xs/relaxed text-editorial-muted font-editorial-sans font-light">
            收录并记录个人体验过的动画、轻小说及相关作品索引与评分归档。
          </p>
        </aside>

        {/* 右侧列表区域：虚拟化长列表 */}
        <main
          ref={parentRef}
          className="min-h-0 flex-1 pb-8 overflow-y-auto no-scrollbar pl-6 pt-4 lg:pl-10"
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
                        <div className="text-sm font-clash-display tracking-widest uppercase text-editorial-muted">
                          Loading more...
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="text-sm font-clash-display tracking-widest uppercase text-editorial-muted">
                          End of Archive
                        </div>
                      </div>
                    )
                  ) : item ? (
                    <div className="w-full h-full pr-6 lg:pr-12">
                      <div className="relative w-full max-w-5xl h-full ml-auto">
                        <AnimeCard animeInfo={item} />
                        {virtualRow.index < flattenedList.length - 1 && (
                          <div
                            className="absolute -left-6 w-[calc(100%+3.5rem)] h-px bg-editorial-divider"
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
        </main>
      </div>
    </div>
  );
};

export default AnimeList;
