import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export function getAllPosts() {
  try {
    // تأكد من وجود المجلد
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    
    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          content,
          ...data,
        };
      })
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

    return allPosts;
  } catch (error) {
    console.error('خطأ في جلب المقالات:', error);
    return [];
  }
}

export function getPostBySlug(slug) {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...data,
    };
  } catch (error) {
    console.error('خطأ في جلب المقالة:', error);
    return null;
  }
}

export function getAllCategories() {
  const posts = getAllPosts();
  const categories = [...new Set(posts.map(post => post.category))];
  return categories;
}

export function getPostsByCategory(category) {
  const posts = getAllPosts();
  return posts.filter(post => post.category === category);
}

export function getAllTags() {
  const posts = getAllPosts();
  const tags = [...new Set(posts.flatMap(post => post.tags || []))];
  return tags;
}