import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './styles/noise.css';
import ArticleItem from "./components/acticle-item";
import apiClient, {checkLoginStatus, fetchPosts, refreshToken} from "@/lib/api.ts";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import ArticleSkeleton from "@/pages/home-page/components/acticle-skeleton";
import { handleLogout } from "@/lib/utils.ts";
import { allTags } from "@/lib/tags.ts";
import { includeSomeLine, Lines, mergeLines, NoLines, removeLine } from "@/lib/quick-tag-by-lines.ts";

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

interface userInfo {
  username: string;
  email: string;
  avatar: string;
}

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const [userInfo, setUserInfo] = useState<userInfo>();
  const [quickTags, setQuickTags] = useState<Lines>(NoLines);
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mainPageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollHandler = () => {
    if (mainPageRef.current) {
      mainPageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
    // 不同设备的缩放倍率
    const scaleValue = window.innerWidth < 768 ? 1.3 : 3;
    // 控制header背景和文字颜色动画
    gsap.to(navRef.current, {
      background: 'rgba(255,255,254,0,7)',
      backdropFilter: 'blur(10px)',
      // color: 'rgb(61,59,59)',
      scrollTrigger: {
        trigger: mainPageRef.current,
        scrub: true,
      },
    });
    // 仅控制header底部边框，无过渡动画
    gsap.to(navRef.current, {
      borderBottom: '0.09rem solid rgb(139,138,145)',
      scrollTrigger: {
        trigger: mainPageRef.current,
        start: 'top top',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
      },
    });
    // 标题及其缩放动画
    // gsap.set(titleRef.current, {
    //   x: '44vw',
    //   y: '50vh',
    //   scale: scaleValue,
    // });
    // gsap.to(titleRef.current, {
    //   x: '0',
    //   y: '0',
    //   scale: 1,
    //   duration: 1.5,
    //   ease: 'expo.out',
    //   scrollTrigger: {
    //     trigger: mainPageRef.current,
    //     start: 'top+=50px bottom',
    //   },
    // });
  });


  const fetchAndSetUserInfo = async () => {
    await checkLoginStatus();
    const info = await apiClient(`/user/info`);
    setUserInfo(info.data);
  };

  const getPosts = async ( retry = 0) => {
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
    fetchAndSetUserInfo();
    getPosts();
  }, []);

  const filteredPosts = quickTags !== NoLines
    ? postList.filter((post) => {
      return includeSomeLine(quickTags, post.quick_tag);
    })
    : postList;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="w-screen h-screen relative flex flex-col bg-cover bg-[#F7F6F7]"
              // style={{ backgroundImage: 'url(/img/background.webp)'}}
        >
          {/* 网站头部 */}
          <header
            ref={navRef}
            className="flex justify-between w-screen fixed top-0 z-20 ext-slate-50 text-slate-50 px-4"
          >
            <div
              className="text-slate-950 left-0 m-2 text-xl  lg:text-2xl font-clash-display font-regular"
              ref={titleRef}
            >
              <NavLink to="/">AChamster  Blog</NavLink>
            </div>
            <nav className="hidden md:flex items-center right-0 m-2  space-x-5 text-lg font-regular text-slate-950 font-clash-display">
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
              {/*<NavLink to="/anime-list">追番列表</NavLink>*/}
              <div className="flex items-center">
                {userInfo?.username ?
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <img
                        src={userInfo?.avatar}
                        alt="avatar"
                        className="w-7 h-7 rounded-full"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>个人档案</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/passkey-register')}>
                        绑定 Passkey
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>退出登录</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  :
                  <NavLink to="/login" state={{ from: location }} replace>登录</NavLink>
                }
              </div>
            </nav>
          </header>
          {/* Hero区域重新设计 */}
          <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-16 relative">
            {/* 简化的装饰性背景元素 */}
            <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-slate-100/40 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-slate-200/30 blur-2xl"></div>

            {/* 主标题区域 */}
            <div className="relative z-10 mb-12 text-center">
              <h1 className="font-clash-display mt-20 font-light text-7xl lg:text-9xl tracking-tight text-slate-900 mb-6">
                AChamster Blog
              </h1>
              <div className="w-20 h-0.5 bg-slate-300 mx-auto mb-4"></div>
            </div>

            {/* 重新设计的信息卡片 */}
            <div className="relative w-full max-w-6xl">
              {/* 主卡片容器 */}
              <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl border border-white/60 overflow-hidden">
                <div className="grid lg:grid-cols-3 min-h-[400px]">
                  {/* 左侧个人信息区域 */}
                  <div className="lg:col-span-1 bg-slate-50/50 p-8 flex flex-col justify-center items-center relative">
                    <div className="relative z-10 text-center w-full">
                      <div className="relative mb-8">
                        <img
                          src="https://img.achamster.live/uploads%2F36910976_p0.png"
                          alt="avatar"
                          className="w-28 h-28 rounded-full mx-auto shadow-lg border-4 border-white/80"
                        />
                      </div>
                      <NavLink
                        to="/about"
                        className="text-2xl font-medium text-slate-800 hover:text-slate-600 transition-colors duration-300 block mb-3"
                      >
                        AChamster
                      </NavLink>

                      <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        前端开发者 · ACGN爱好者
                      </p>

                      {/* 社交链接 */}
                      <div className="flex justify-center gap-4">
                        <a href="https://github.com/ACHamster" target="_blank"
                           className="w-11 h-11 bg-white/80 rounded-full shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 border border-slate-100">
                          <img src="/svg/github-fill.svg" className="w-5 h-5 opacity-70" alt="github"/>
                        </a>
                        <a href="https://discord.gg/pT2ebreb" target="_blank"
                           className="w-11 h-11 bg-white/80 rounded-full shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 border border-slate-100">
                          <img src="/svg/discord.svg" className="w-5 h-5 opacity-70" alt="discord"/>
                        </a>
                        <a href="mailto:motets_gram_0i@icloud.com"
                           className="w-11 h-11 bg-white/80 rounded-full shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 border border-slate-100">
                          <img src="/svg/mail-fill.svg" className="w-5 h-5 opacity-70" alt="mail"/>
                        </a>
                        <a href="https://steamcommunity.com/profiles/76561198982850839" target="_blank"
                           className="w-11 h-11 bg-white/80 rounded-full shadow-sm flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-300 border border-slate-100">
                          <img src="/svg/steam.svg" className="w-5 h-5 opacity-70" alt="steam"/>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 右侧内容区域 */}
                  <div className="lg:col-span-2 p-8 lg:p-12">
                    <div className="h-full flex flex-col justify-center">
                      {/* 标题 */}
                      <div className="mb-10">
                        <h3 className="text-3xl font-light text-slate-800 mb-3">关于我</h3>
                        <div className="w-12 h-0.5 bg-slate-300"></div>
                      </div>

                      {/* 内容区域 */}
                      <div className="space-y-8">
                        {/* 技术 */}
                        <div className="group">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-3 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-xl font-medium text-slate-700 mb-2">技术探索</h4>
                              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                                电子产品爱好者，虽然现在已经懒得折腾了。对电脑的热爱可能是成为前端工程师的契机。
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 动画 */}
                        <div className="group">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-3 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-xl font-medium text-slate-700 mb-2">动画世界</h4>
                              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                                大量摄入恋爱喜剧，可以点旁边的按钮看看我的追番列表（实际上在施工中）
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 游戏 */}
                        <div className="group">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-3 flex-shrink-0"></div>
                            <div>
                              <h4 className="text-xl font-medium text-slate-700 mb-2">游戏人生</h4>
                              <p className="text-slate-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                                没有特定喜欢的类型，反过来说也乐意尝试各种类型的游戏。喜欢的游戏系列是怪物猎人和秋之回忆
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 简化的装饰性阴影 */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-slate-200/20 rounded-3xl -z-10"></div>
            </div>
          </div>

          {/* 移除旧的卡片代码 */}
        </div>
      </section>
      <section
        ref={mainPageRef}
        className="mx-auto px-4 py-24 min-w-screen min-h-screen relative flex justify-center"
      >
        {/*噪音背景*/}
        <div className="noise-wrapper absolute inset-0 overflow-hidden">
          <div className="noise fixed inset-0"/>
        </div>

        {/*主体内容*/}
        <div className="container mx-2 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-24 gap-6">
            {/* 左侧搜索和标签 */}
            <aside className="lg:col-span-5">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
                {/*搜索*/}
                <div className="mb-4">
                  <input
                    type="search"
                    placeholder="搜索文章..."
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                {/*标签*/}
                <div>
                  <h3 className="font-semibold mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag.label}
                        className={`${includeSomeLine(quickTags, tag.line) ? 'bg-sky-200' : 'bg-gray-100' } px-3 py-1 text-sm  rounded-full hover:bg-sky-100`}
                        onClick={()=>{
                          if (includeSomeLine(quickTags, tag.line)) {
                            setQuickTags(removeLine(quickTags, tag.line));
                          } else {
                            setQuickTags(mergeLines(quickTags, tag.line));
                          }
                        }}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 中间文章列表 */}
            <main className="lg:col-span-14">
              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <ArticleSkeleton/>
                    <ArticleSkeleton/>
                    <ArticleSkeleton/>
                  </>
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <ArticleItem post={post} key={post.id}/>
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    暂无文章
                  </div>
                )}
              </div>
            </main>

            {/* 右侧个人信息 */}
            <aside className="lg:col-span-5">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-4">
                    <img
                      src="https://img.achamster.live/uploads%2F36910976_p0.png"
                      className="w-full h-full rounded-full object-cover"
                      alt="avatar"
                    />
                  </div>

                  <div className="text-center mb-6">
                    <span className="block text-gray-600">文章数</span>
                    <span className="text-2xl font-bold">{postList.length}</span>
                  </div>

                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;

