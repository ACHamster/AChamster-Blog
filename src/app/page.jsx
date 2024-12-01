'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { getAllPosts } from '@/pages/api/post';
import '@/styles/noise.css';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const mainPageRef = useRef();
  const navRef = useRef();
  const titleRef = useRef();
  useEffect(() => {
    async function fetchPosts() {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    }
    fetchPosts();
  }, []);
  gsap.registerPlugin(ScrollTrigger);
  useGSAP(() => {
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
      scale: 3,
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

  return (
    <>
      <section className="relative bg-[url('/background.png')] bg-cover">
        <div className="w-screen h-screen relative">
          {/* 网站头部 */}
          <header
            ref={navRef}
            className="flex justify-between w-screen fixed top-0 z-20 ext-slate-50 text-slate-50"
          >
            <div
              className="left-0 m-2  text-2xl font-clashDisplay"
              ref={titleRef}
            >
              <Link href="/">AChamster  Blog</Link>
            </div>
            <nav className="right-0 m-2 flex space-x-5 text-lg font-extralight font-clashDisplay">
              <Link href="/">Test</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/about">About</Link>
            </nav>
          </header>
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
        {posts?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">还没有博客文章</p>
            <p className="text-sm text-gray-500 mt-2">
              请在 posts 目录下添加 .md 文件
            </p>
          </div>
        ) : (
          <div className="grid gap-8 w-8/12">
            {posts?.map((post) => (
              <article
                key={post.slug}
                className="w-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow z-10"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex"
                >
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2 hover:text-sky-600">
                      {post.title}
                    </h2>
                    <div className="text-gray-600 text-sm mb-4">
                      {new Date(post.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {post.tags && (
                        <div className="mt-2 flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 px-2 py-1 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600">{post.excerpt}</p>
                    <span className="text-sky-600 hover:text-sky-800 mt-4 inline-block">
                      阅读更多 →
                    </span>
                  </div>
                  {post.cover && (
                    <div className="w-72 h-48 rounded-lg">
                      <img src={post.cover} className="w-full h-full object-cover rounded-lg" alt="cover" />
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
        <div className="w-0 h-96 lg:w-1/5 flex justify-center rounded-lg shadow-md hover:shadow-lg bg-white sticky top-20 ml-16 overflow-hidden z-10">
          <Link href="/about" className="flex justify-center content-center flex-wrap w-3/4 text-primaryTextColor">
            <div className="flex justify-center w-32 h-32">
              <img src="/avatar.png" className="overflow-hidden w-full h-full rounded-full" alt="avatar" />
            </div>
            <div className="flex justify-center w-full text-lg font-noto font-bold">
              AChamster
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
