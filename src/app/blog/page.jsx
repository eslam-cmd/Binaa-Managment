import Link from "next/link";
import { getAllCategories, getAllPosts } from "@/lib/posts";
import {
  FiBookOpen,
  FiTag,
  FiUser,
  FiCalendar,
  FiArrowLeft,
} from "react-icons/fi";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* الهيدر */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
            <FiBookOpen className="text-[var(--primary)]" size={16} />
            <span className="text-xs font-medium text-[var(--primary)]">
              المدونة التقنية
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            📝 مقالات و<span className="text-[var(--primary)]">خبرات</span>
          </h1>
          <div className="w-16 h-1 bg-[var(--primary)] rounded-full mx-auto mt-3" />
          <p className="mt-4 text-[var(--text-muted)] text-sm sm:text-base max-w-2xl mx-auto">
            أشارك معك رحلتي في عالم البرمجة، أحدث التقنيات، ونصائح عملية من واقع
            التجربة
          </p>
        </header>

        {/* التصنيفات */}
        {categories.length > 0 && (
          <nav className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors"
            >
              الكل
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${encodeURIComponent(category)}`}
                className="group px-4 py-2 rounded-full text-sm font-medium border border-[var(--nav-border)] bg-[var(--nav-bg)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--foreground)] hover:bg-[var(--primary)]/5 transition-all duration-300"
              >
                <span className="flex items-center gap-1.5">
                  <FiTag
                    size={12}
                    className="text-[var(--text-muted)] group-hover:text-[var(--primary)]"
                  />
                  {category}
                </span>
              </Link>
            ))}
          </nav>
        )}

        {/* المقالات */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-7xl mb-6">📝</div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              لا توجد مقالات حالياً
            </h2>
            <p className="text-[var(--text-muted)]">
              ترقبوا المقالات القادمة قريباً ✨
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-[var(--nav-border)] bg-[var(--nav-bg)] overflow-hidden hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/5 transition-all duration-300"
              >
                {/* الرأس */}
                <div className="p-5 border-b border-[var(--nav-border])">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] uppercase tracking-wider">
                    {post.category || "عام"}
                  </span>
                  <h2 className="mt-3 text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </div>

                {/* المحتوى */}
                <div className="p-5">
                  <p className="mb-4 line-clamp-3 text-sm text-[var(--text-muted)] leading-relaxed">
                    {post.excerpt || "لا توجد ملخص متاح لهذا المقال"}
                  </p>

                  {/* معلومات الكاتب والتاريخ */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-muted)] mb-4">
                    <span className="flex items-center gap-1.5">
                      <FiUser size={13} />
                      {post.author || "إسلام هداية"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiCalendar size={13} />
                      {post.date
                        ? new Date(post.date).toLocaleDateString("ar-EG")
                        : "جديد"}
                    </span>
                  </div>

                  {/* زر القراءة */}
                  <Link
                    href={`/blog/${encodeURIComponent(post.slug)}`}
                    className="group/btn inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/25"
                  >
                    <span>قراءة المقال</span>
                    <FiArrowLeft
                      className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                      size={14}
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* إحصائية سريعة */}
        {posts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--nav-border]) text-center">
            <p className="text-sm text-[var(--text-muted)]">
              📚{" "}
              <span className="font-bold text-[var(--foreground)]">
                {posts.length}
              </span>{" "}
              مقالة
              {categories.length > 0 && (
                <>
                  {" "}
                  • 🏷️{" "}
                  <span className="font-bold text-[var(--foreground)]">
                    {categories.length}
                  </span>{" "}
                  تصنيف
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
