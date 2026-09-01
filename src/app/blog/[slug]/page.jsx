import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import {
  FiArrowRight,
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
} from "react-icons/fi";

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* رجوع */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200 mb-6"
        >
          <FiArrowRight size={16} />
          <span>العودة إلى المدونة</span>
        </Link>

        {/* المقالة */}
        <article className="rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] p-6 sm:p-10 shadow-lg shadow-black/10">
          {/* التصنيف */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
              {post.category || "عام"}
            </span>
            {post.tags &&
              post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-[var(--nav-border)] text-[var(--text-muted)]"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* العنوان */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] leading-tight">
            {post.title}
          </h1>

          {/* المعلومات */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <FiUser size={14} />
              {post.author || "إسلام هداية"}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <FiCalendar size={14} />
              {new Date(post.date).toLocaleDateString("ar-EG")}
            </span>
            {post.readingTime && (
              <>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <FiClock size={14} />
                  {post.readingTime} دقائق قراءة
                </span>
              </>
            )}
          </div>

          {/* صورة الغلاف (إذا وجدت) */}
          {post.coverImage && (
            <div className="mt-6 rounded-xl overflow-hidden bg-[var(--background)] aspect-video flex items-center justify-center border border-[var(--nav-border])">
              <span className="text-6xl">📝</span>
            </div>
          )}

          {/* المحتوى */}
          <div className="prose prose-invert prose-lg max-w-none mt-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-[var(--foreground)] mt-8 mb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mt-6 mb-3">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mt-5 mb-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-[var(--text-muted)] mb-4">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-[var(--text-muted)] mb-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-[var(--text-muted)]">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-r-4 border-[var(--primary)] pr-4 py-2 my-4 bg-[var(--card-bg)] rounded-l-none rounded-r-xl">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="px-2 py-0.5 rounded bg-[var(--card-bg)] text-[var(--primary)] text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="p-4 rounded-xl bg-[var(--background)] overflow-x-auto my-4 border border-[var(--nav-border)]">
                    {children}
                  </pre>
                ),
                hr: () => <hr className="border-[var(--nav-border)] my-8" />,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline transition-colors"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) => (
                  <img
                    src={src}
                    alt={alt}
                    className="rounded-xl border border-[var(--nav-border)] max-w-full h-auto my-4"
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* الوسوم */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[var(--nav-border])">
              <div className="flex flex-wrap items-center gap-2">
                <FiTag className="text-[var(--text-muted)]" size={14} />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium border border-[var(--nav-border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--foreground)] transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* قسم التفاعل */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--nav-border)]">
          <p className="text-sm text-[var(--text-muted)]">
            💡 هل أعجبك المقال؟ شاركه مع أصدقائك!
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            مقالات أخرى
            <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
