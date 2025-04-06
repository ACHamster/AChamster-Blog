import React, { useEffect, useRef, useState } from 'react';
import {NavLink} from "react-router";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './styles/noise.css';
import ArticleItem from "./components/acticle-item";
import { fetchPosts } from "@/lib/api.ts";

interface Post {
  id: string;
  title: string;
  date: string;
  tags?: string[];
  excerpt: string;
  cover?: string;
}

const HomePage: React.FC = () => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [postList, setPostList] = useState<Post[]>([
    {
      id: "001",
      title: "React 入门指南：从零开始学习 React",
      date: "2024-02-15",
      tags: ["React", "JavaScript", "前端开发"],
      excerpt: "本文将带你从零开始学习 React，包括基础概念、组件开发、状态管理等核心内容。",
      cover: "/img/cover1.png"
    },
    {
      id: "002",
      title: "TypeScript 最佳实践：提升代码质量的关键技巧",
      date: "2024-02-10",
      tags: ["TypeScript", "编程技巧"],
      excerpt: "探索 TypeScript 开发中的最佳实践，包括类型定义、接口设计和高级特性的使用方法。"
    },
    {
      id: "003",
      title: "TailwindCSS 实战教程：构建现代化 UI",
      date: "2024-02-05",
      tags: ["CSS", "TailwindCSS", "UI设计"],
      excerpt: "学习如何使用 TailwindCSS 快速构建美观的用户界面，掌握响应式设计和组件复用技巧。",
      cover: "/img/cover2.png"
    }
  ]);
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
        const response = await fetchPosts();
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
            <nav className="hidden md:flex right-0 m-2  space-x-5 text-lg font-regular font-clash-display">
              <NavLink to="/">Test</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/about">About</NavLink>
            </nav>
          </header>
          <div className="cursor-pointer" onClick={scrollHandler}>
            <img src="/svg/arrow.svg" alt="arrow" className="absolute w-8 h-8 bottom-10 left-1/2" />
          </div>
        </div>
      </section>
      <section
        ref={mainPageRef}
        className="mx-auto px-4 py-8 min-w-screen min-h-screen flex justify-center flex-wrap bg-white relative"
      >
        <div
          className="noise-wrapper w-screen h-screen absolute"
        >
          <div className="noise" />
          {/* 博客列表容器 */}
        </div>
        {postList?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">还没有博客文章</p>
            <p className="text-sm text-gray-500 mt-2">
              请在 posts 目录下添加 .md 文件
            </p>
          </div>
        ) : (
          <div className="grid gap-8 w-8/12">
            {postList.map((post) => {
              return <ArticleItem post={post} key={post.id} />;
            })}
          </div>
        )}
        <div className="w-0 h-96 lg:w-1/5 flex justify-center rounded-lg shadow-md hover:shadow-lg bg-white sticky top-20 ml-16 overflow-hidden z-10">
          <div className="flex justify-center content-around flex-wrap w-3/4 h-3/4 mt-10 text-primaryTextColor">
            <div className="flex justify-center w-32 h-32">
              <img src="https://img.achamster.live/uploads/1743758178045-36910976_p0.png" className="overflow-hidden w-full h-full rounded-full" alt="avatar" />
            </div>
            <div className="flex justify-center w-full text-lg font-noto font-bold hover:text-sky-600 hover:animate-bNavLink">
              <NavLink to="/about">AChamster</NavLink>
            </div>
            <div className="flex flex-wrap flex-col content-center w-full">
              <span>文章数</span>
              <span className="text-2xl font-bold flex justify-center">{totalPosts}</span>
            </div>
            <div className="flex justify-between cursor-pointer w-2/3">
              <a
                href="https://github.com/ACHamster"
                target="_blank"
                className="hover:animate-svgSpain"
              >
                <img src="/svg/github-fill.svg" className="w-6 h-6" alt="github" />
              </a>
              <a
                href="https://discord.gg/pT2ebreb" target="_blank" className="hover:animate-svgSpain">
                <img src="/svg/discord.svg" className="w-6 h-6 hover:fill-[#757cef]" alt="discord"/>
              </a>
              <a
                href="mailto:motets_gram_0i@icloud.com"
                className="hover:animate-svgSpain"
              >
                <img src="/svg/mail-fill.svg" className="w-6 h-6" alt="steam" />
              </a>
              <a
                href="https://steamcommunity.com/profiles/76561198982850839" target="_blank"
                className="hover:animate-svgSpain"
              >
                <img src="/svg/steam.svg" className="w-6 h-6" alt="steam" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
