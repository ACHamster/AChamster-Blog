import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import ArticleItem from './components/acticle-item';
import ArticleSkeleton from './components/acticle-skeleton';
import { fetchPosts } from '@/lib/api.ts';
import { allTags } from '@/lib/tags.ts';
import {
  includeSomeLine,
  Lines,
  mergeLines,
  NoLines,
  removeLine,
} from '@/lib/quick-tag-by-lines.ts';

interface MagazineHamburgerProps {
  isOpen: boolean;
  isFiltering?: boolean;
}

const MagazineHamburger: React.FC<MagazineHamburgerProps> = ({
  isOpen,
  isFiltering,
}) => {
  return (
    <div className="relative flex h-4 w-5 flex-col justify-between items-end">
      {/* 上线：常态全宽，展开时变形为 ✕ 的左下-右上斜线 */}
      <span
        className={`h-[1.5px] rounded-full transition-all duration-300 ease-in-out origin-center ${
          isOpen
            ? 'w-5 translate-y-[7.25px] rotate-45 bg-editorial-accent'
            : 'w-5 translate-y-0 rotate-0 bg-editorial-foreground group-hover:bg-editorial-accent'
        }`}
      />

      {/* 中线：常态 70% 宽阶梯状，展开时平滑向左隐退 */}
      <span
        className={`h-[1.5px] rounded-full transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-5 opacity-0 -translate-x-2 bg-editorial-accent'
            : 'w-3.5 opacity-100 translate-x-0 bg-editorial-foreground group-hover:bg-editorial-accent'
        }`}
      />

      {/* 下线：常态 50% 宽阶梯状，展开时拉长并变形为 ✕ 的左上-右下斜线 */}
      <span
        className={`h-[1.5px] rounded-full transition-all duration-300 ease-in-out origin-center ${
          isOpen
            ? 'w-5 -translate-y-[7.25px] -rotate-45 bg-editorial-accent'
            : 'w-2.5 translate-y-0 rotate-0 bg-editorial-foreground group-hover:bg-editorial-accent'
        }`}
      />

      {/* 筛选激活指示小红点 */}
      {isFiltering && !isOpen && (
        <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-editorial-accent" />
        </span>
      )}
    </div>
  );
};

interface Post {
  id: string;
  title: string;
  date: string;
  description: string;
  common_tags?: string[];
  quick_tag: Lines;
  excerpt: string;
  cover?: string;
}

interface SidebarContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  quickTags: Lines;
  setQuickTags: React.Dispatch<React.SetStateAction<Lines>>;
  clearFilters: () => void;
  isFiltering: boolean;
  filteredCount: number;
  totalCount: number;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  searchQuery,
  setSearchQuery,
  quickTags,
  setQuickTags,
  clearFilters,
  isFiltering,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-5">
        {/* 页面主标题区 */}
        <div className="hidden md:block">
          <h1 className="text-2xl  md:text-3xl lg:text-4xl font-normal text-editorial-foreground font-editorial-serif tracking-tight leading-none md:-translate-y-1 mb-2.5">
            最新文章
          </h1>
          <p className="text-xs text-editorial-muted font-editorial-sans font-light leading-relaxed">
            收录个人前端技术探索、ACGN 随笔与日常思考归档。
          </p>
        </div>

        <div className="hidden md:block h-px bg-editorial-divider" />

        {/* 搜索框 */}
        <div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章..."
              className="w-full bg-stone-100/70 border border-editorial-divider/70 px-3 py-1.5 text-xs font-editorial-sans text-editorial-foreground placeholder:text-editorial-muted/70 rounded-xs focus:outline-none focus:border-editorial-accent focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-editorial-muted hover:text-editorial-foreground text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 杂志风格分类索引 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium font-editorial-sans text-editorial-foreground">
              分类索引
            </span>
            {isFiltering && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-editorial-sans text-editorial-accent hover:underline"
              >
                重置筛选
              </button>
            )}
          </div>
          <div className="text-xs font-editorial-sans leading-relaxed">
            {allTags.map((tag) => {
              const isActive = includeSomeLine(quickTags, tag.line);
              return (
                <button
                  key={tag.label}
                  onClick={() => {
                    if (isActive) {
                      setQuickTags(removeLine(quickTags, tag.line));
                    } else {
                      setQuickTags(mergeLines(quickTags, tag.line));
                    }
                  }}
                  className={`inline-block mr-1.5 mb-1 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-editorial-accent font-semibold underline underline-offset-4 decoration-editorial-accent'
                      : 'text-editorial-muted hover:text-editorial-foreground'
                  }`}
                >
                  {tag.label} <span className="text-editorial-divider ml-0.5">/</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部贴底区：个人名片 + 统计 + 跑马灯 */}
      <div className="pt-4 mt-auto border-t border-editorial-divider/40 flex flex-col gap-3">
        {/* 个人档案 */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden border border-editorial-divider bg-stone-200/60">
            <img
              src="https://img.achamster.com/uploads%2F36910976_p0.png"
              alt="AChamster"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-editorial-serif text-base text-editorial-foreground font-medium">
              AChamster
            </div>
            <div className="text-[11px] text-editorial-muted font-editorial-sans font-light">
              前端开发者 · ACGN 爱好者
            </div>
            {/* 社交链接 */}
            <div className="flex items-center gap-3 mt-1.5">
              <a
                href="https://github.com/ACHamster"
                target="_blank"
                rel="noreferrer"
                className="opacity-60 hover:opacity-100 hover:text-editorial-accent transition-all"
                title="GitHub"
              >
                <img src="/svg/github-fill.svg" className="w-3.5 h-3.5" alt="GitHub" />
              </a>
              <a
                href="https://discord.gg/pT2ebreb"
                target="_blank"
                rel="noreferrer"
                className="opacity-60 hover:opacity-100 hover:text-editorial-accent transition-all"
                title="Discord"
              >
                <img src="/svg/discord.svg" className="w-3.5 h-3.5" alt="Discord" />
              </a>
              <a
                href="mailto:motets_gram_0i@icloud.com"
                className="opacity-60 hover:opacity-100 hover:text-editorial-accent transition-all"
                title="邮箱"
              >
                <img src="/svg/mail-fill.svg" className="w-3.5 h-3.5" alt="邮箱" />
              </a>
              <a
                href="https://steamcommunity.com/profiles/76561198982850839"
                target="_blank"
                rel="noreferrer"
                className="opacity-60 hover:opacity-100 hover:text-editorial-accent transition-all"
                title="Steam"
              >
                <img src="/svg/steam.svg" className="w-3.5 h-3.5" alt="Steam" />
              </a>
            </div>
          </div>
        </div>

        {/* 底部统计 */}
        <div className="flex items-center justify-between text-[11px] font-editorial-sans text-editorial-muted">
          <span>
            已显示 <span className="font-clash-display font-medium text-editorial-foreground">{filteredCount}</span> / {totalCount} 篇
          </span>
          <span className="flex items-center gap-1.5 text-editorial-accent font-clash-display text-[10px] uppercase font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-editorial-accent"></span>
            </span>
            WIP / 施工中
          </span>
        </div>

        {/* 施工中无限平滑滚动横幅 */}
        <div className="relative overflow-hidden w-full py-1 px-1.5 rounded-xs bg-editorial-panel border border-editorial-accent/25 select-none">
          <div className="animate-editorial-marquee text-[11px] font-editorial-sans font-medium text-editorial-accent tracking-wide whitespace-nowrap">
            <span className="inline-flex items-center gap-1.5 mr-6">
              <span>✦</span> 站点持续施工完善中，部分功能与内容仍在优化迭代 <span>✦</span> UNDER CONSTRUCTION
            </span>
            <span className="inline-flex items-center gap-1.5 mr-6">
              <span>✦</span> 站点持续施工完善中，部分功能与内容仍在优化迭代 <span>✦</span> UNDER CONSTRUCTION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickTags, setQuickTags] = useState<Lines>(NoLines);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const getPosts = async (retry = 0) => {
    try {
      const response = await fetchPosts();
      if (response.success && response.data.posts.length > 0) {
        setPostList(response.data.posts);
        setIsLoading(false);
      } else if (retry < MAX_RETRIES) {
        setTimeout(() => {
          getPosts(retry + 1);
        }, RETRY_DELAY);
      } else {
        setIsLoading(false);
        console.error('Failed to fetch posts after multiple retries');
      }
    } catch (error) {
      if (retry < MAX_RETRIES) {
        setTimeout(() => {
          getPosts(retry + 1);
        }, RETRY_DELAY);
      } else {
        setIsLoading(false);
        console.error('Failed to fetch posts:', error);
      }
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const filteredPosts = postList.filter((post) => {
    const matchesTag =
      quickTags === NoLines || includeSomeLine(quickTags, post.quick_tag);
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.common_tags?.some((t) => t.toLowerCase().includes(query));

    return matchesTag && matchesSearch;
  });

  const isFiltering = quickTags !== NoLines || searchQuery.trim() !== '';

  const clearFilters = () => {
    setQuickTags(NoLines);
    setSearchQuery('');
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-editorial-background text-editorial-foreground">
      {/* 顶部导航：Header 设为 z-50，确保汉堡按钮始终置顶 */}
      <header className="relative z-50 flex h-16 md:h-20 shrink-0 items-center justify-between px-4 sm:px-8 md:px-14 lg:px-16 2xl:px-24 select-none border-b border-editorial-divider/40 bg-editorial-background/95 backdrop-blur-xs">
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            onClick={() => setIsSheetOpen(false)}
            className="font-clash-display text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-editorial-foreground hover:text-editorial-accent transition-colors"
          >
            AChamster Blog
          </NavLink>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {/* 桌面端常驻导航链接（移动端隐藏） */}
          <nav className="hidden md:flex items-center space-x-8 text-sm lg:text-base font-editorial-sans">
            <NavLink
              to="/"
              className="text-editorial-accent font-medium transition-colors"
            >
              文章
            </NavLink>
            <NavLink
              to="/anime-list"
              className="text-editorial-muted hover:text-editorial-accent transition-colors"
            >
              追番列表
            </NavLink>
          </nav>

          {/* 移动端专属：日式全屏菜单触发按钮 */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsSheetOpen(!isSheetOpen)}
              className="p-2.5 -mr-2 text-editorial-foreground hover:text-editorial-accent transition-colors cursor-pointer flex items-center justify-center group"
              aria-label={isSheetOpen ? '关闭菜单' : '打开菜单'}
            >
              <MagazineHamburger isOpen={isSheetOpen} isFiltering={isFiltering} />
            </button>
          </div>
        </div>
      </header>

      {/* 移动端日式全屏沉浸式菜单 (Fullscreen Editorial Menu) */}
      <div
        className={`fixed inset-0 z-40 bg-editorial-background flex flex-col px-6 pt-20 pb-4 md:hidden transition-all duration-300 ease-in-out overflow-y-auto ${
          isSheetOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-[calc(100dvh-6rem)] justify-between">
          <div>
            {/* 主导航链接：和风大字号衬线体 */}
            <nav className="flex flex-col space-y-3.5 pt-2">
              <NavLink
                to="/"
                onClick={() => setIsSheetOpen(false)}
                className="font-editorial-serif text-3xl font-normal text-editorial-accent tracking-tight flex items-center justify-between group"
              >
                <span>文章</span>
                <span className="font-clash-display text-xs tracking-widest text-editorial-muted opacity-60 group-hover:opacity-100 transition-opacity">
                  01 / POSTS
                </span>
              </NavLink>

              <NavLink
                to="/anime-list"
                onClick={() => setIsSheetOpen(false)}
                className="font-editorial-serif text-3xl font-normal text-editorial-foreground hover:text-editorial-accent tracking-tight flex items-center justify-between transition-colors group"
              >
                <span>追番列表</span>
                <span className="font-clash-display text-xs tracking-widest text-editorial-muted opacity-60 group-hover:opacity-100 transition-opacity">
                  02 / ARCHIVE
                </span>
              </NavLink>
            </nav>

            <div className="h-px bg-editorial-divider my-4" />
          </div>

          {/* 搜索与分类检索 & 底部个人名片与跑马灯 */}
          <div className="flex-1 flex flex-col justify-between">
            <SidebarContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              quickTags={quickTags}
              setQuickTags={setQuickTags}
              clearFilters={clearFilters}
              isFiltering={isFiltering}
              filteredCount={filteredPosts.length}
              totalCount={postList.length}
            />
          </div>
        </div>
      </div>

      {/* 主体分栏：移动端单列，桌面端两端对齐 */}
      <div className="flex min-h-0 flex-1 w-full justify-between overflow-hidden px-4 sm:px-8 md:px-14 lg:px-16 2xl:px-24">
        {/* 左侧侧边栏：桌面端常驻，移动端隐藏 */}
        <aside className="hidden md:flex w-84 lg:w-80 shrink-0 pt-6 pr-6 pb-6 select-none overflow-y-auto no-scrollbar flex-col justify-between">
          <SidebarContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            quickTags={quickTags}
            setQuickTags={setQuickTags}
            clearFilters={clearFilters}
            isFiltering={isFiltering}
            filteredCount={filteredPosts.length}
            totalCount={postList.length}
          />
        </aside>

        {/* 右侧列表区域：移动端占满，桌面端保持杂志比例 */}
        <main className="min-h-0 w-full md:w-[62%] lg:w-[64%] 2xl:w-[66%] max-w-[1600px] shrink-0 pb-8 overflow-y-auto no-scrollbar pt-4 md:pt-6">
          <div className="w-full">
            {/* 文章列表 */}
            {isLoading ? (
              <div>
                <ArticleSkeleton isFirst />
                <ArticleSkeleton />
                <ArticleSkeleton />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div>
                {filteredPosts.map((post, index) => (
                  <ArticleItem post={post} key={post.id} isFirst={index === 0} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center select-none">
                <p className="font-editorial-serif text-lg text-editorial-muted mb-2">
                  未找到相关文章
                </p>
                {isFiltering && (
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-3 py-1 bg-stone-100 border border-editorial-divider text-xs text-editorial-accent rounded-xs hover:bg-editorial-panel transition-colors font-editorial-sans"
                  >
                    清除所有筛选条件
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
