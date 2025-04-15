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
import { handleLogout } from "@/lib/utils.ts";
import { allTags } from "@/lib/tags.ts";
import { includeSomeLine, Lines, mergeLines, NoLines, removeLine } from "@/lib/quick-tag-by-lines.ts";

interface Post {
  id: string;
  title: string;
  date: string;
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

  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [quickTags, setQuickTags] = useState<Lines>(NoLines);
  const [postList, setPostList] = useState<Post[]>([]);
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
      color: 'rgb(61,59,59)',
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
    gsap.set(titleRef.current, {
      x: '44vw',
      y: '50vh',
      scale: scaleValue,
    });
    gsap.to(titleRef.current, {
      x: '0',
      y: '0',
      scale: 1,
      duration: 1.5,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: mainPageRef.current,
        start: 'top+=50px bottom',
      },
    });
  });

  useEffect(() => {
    setTotalPosts(postList.length);
  }, [postList.length]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const status = await checkLoginStatus();
        if (status.data.userId === 0) {
          // 如果未登录，尝试刷新token
          await refreshToken();
        }

        const info = await apiClient(`/user/info/${status.data.userId}`);
        setUserInfo(info.data);

        const response = await fetchPosts();
        console.log(response);
        if (response.success) {
          setPostList([...postList, ...response.data]);
        } else {
          console.error('Failed to fetch posts:', response.error);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    getPosts();
  }, []);

  const filteredPosts = quickTags !== NoLines
    ? postList.filter((post) => {
      console.log(post.quick_tag);
      return includeSomeLine(quickTags, post.quick_tag);
    })
    : postList;

  return (
    <>
      <section className="relative bg-[url('/img/background.png')] bg-cover">
        <div className="w-screen h-screen relative">
          {/* 网站头部 */}
          <header
            ref={navRef}
            className="flex justify-between w-screen fixed top-0 z-20 ext-slate-50 text-slate-50"
          >
            <div
              className="left-0 m-2 text-xl  lg:text-2xl font-clash-display font-bold"
              ref={titleRef}
            >
              <NavLink to="/">AChamster  Blog</NavLink>
            </div>
            <nav className="hidden md:flex items-center right-0 m-2  space-x-5 text-lg font-regular font-clash-display">
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
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
          <div className="cursor-pointer" onClick={scrollHandler}>
            <img src="/svg/arrow.svg" alt="arrow" className="absolute w-8 h-8 bottom-10 left-1/2" />
          </div>
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
                {filteredPosts.map((post) => (
                  <ArticleItem post={post} key={post.id}/>
                ))}
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
                  <NavLink
                    to="/about"
                    className="text-lg font-bold hover:text-sky-600 hover:animate-bNavLink mb-4"
                  >
                    AChamster
                  </NavLink>
                  <div className="text-center mb-6">
                    <span className="block text-gray-600">文章数</span>
                    <span className="text-2xl font-bold">{totalPosts}</span>
                  </div>
                  <div className="flex justify-center gap-4">
                    <a href="https://github.com/ACHamster" target="_blank" className="hover:animate-svgSpain">
                      <img src="/svg/github-fill.svg" className="w-6 h-6" alt="github"/>
                    </a>
                    <a href="https://discord.gg/pT2ebreb" target="_blank" className="hover:animate-svgSpain">
                      <img src="/svg/discord.svg" className="w-6 h-6" alt="discord"/>
                    </a>
                    <a href="mailto:motets_gram_0i@icloud.com" className="hover:animate-svgSpain">
                      <img src="/svg/mail-fill.svg" className="w-6 h-6" alt="mail"/>
                    </a>
                    <a href="https://steamcommunity.com/profiles/76561198982850839" target="_blank"
                       className="hover:animate-svgSpain">
                      <img src="/svg/steam.svg" className="w-6 h-6" alt="steam"/>
                    </a>
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

