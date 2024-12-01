'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');

export async function getAllPosts() {
  // 检查目录是否存在
  if (!fs.existsSync(postsDirectory)) {
    console.warn('Posts directory does not exist. Creating...');
    fs.mkdirSync(postsDirectory, { recursive: true });
    return []; // 返回空数组，因为还没有文章
  }

  // 获取目录中的所有文件
  const fileNames = fs.readdirSync(postsDirectory);

  // 如果目录为空
  if (fileNames.length === 0) {
    console.warn('No posts found in the posts directory');
    return [];
  }

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md')) // 只处理 .md 文件
    .map((fileName) => {
      try {
        // 从文件名中移除 ".md" 得到 slug
        const slug = fileName.replace(/\.md$/, '');

        // 读取 markdown 文件
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 使用 gray-matter 解析 markdown 的 metadata
        const { data, content } = matter(fileContents);

        // 如果没有提供摘要，从内容中生成
        const excerpt = data.excerpt || content.slice(0, 200).trim() + '...';

        // 确保至少有必要的数据
        if (!data.title || !data.date) {
          console.warn(`Missing title or date in ${fileName}`);
        }

        return {
          slug,
          excerpt,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          tags: data.tags || [],
          ...data,
        };
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
        return null;
      }
    }).filter(Boolean); // 移除处理失败的文章

  // 按日期排序
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug) {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist');
      return null;
    }

    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      console.warn(`Post file ${slug}.md does not exist`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 解析 markdown 内容和 metadata
    const { data, content } = matter(fileContents);

    // 将 markdown 转换为 HTML
    const contentHtml = marked(content, {
      gfm: true, // 启用 GitHub Flavored Markdown
      breaks: true, // 启用换行符
    });

    return {
      slug,
      content: contentHtml,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      ...data,
    };
  } catch (error) {
    console.error(`Error processing post ${slug}:`, error);
    return null;
  }
}
