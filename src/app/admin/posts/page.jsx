"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiCalendar,
  FiTag,
} from "react-icons/fi";
import { getPosts, deletePost } from "@/lib/api";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error("خطأ:", error);
      setMessage({ type: "error", text: "حدث خطأ في جلب المقالات" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه المقالة؟")) return;

    try {
      await deletePost(id);
      setMessage({ type: "success", text: "تم حذف المقالة بنجاح" });
      setDeleteId(null);
      fetchPosts();
    } catch (error) {
      setMessage({ type: "error", text: error.message || "حدث خطأ في الحذف" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-[var(--text-muted)]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            المقالات
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            إدارة مقالات المدونة
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            <FiPlus size={16} />
            مقالة جديدة
          </Link>
          <button
            onClick={fetchPosts}
            className="p-2 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border]) text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <FiRefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* رسائل الحالة */}
      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* جدول المقالات */}
      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background)] border-b border-[var(--nav-border])">
              <tr>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  العنوان
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  التصنيف
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  المشاهدات
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="p-3 text-center text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nav-border])">
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-[var(--text-muted)]"
                  >
                    لا توجد مقالات
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-[var(--background)]/30 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-medium text-[var(--foreground)] line-clamp-1">
                        {post.title}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-[10px] bg-[var(--primary)]/10 text-[var(--primary)]">
                        {post.category || "غير مصنف"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-[var(--foreground)]">
                      {post.views || 0}
                    </td>
                    <td className="p-3 text-sm text-[var(--text-muted)]">
                      {new Date(post.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                        >
                          <FiEye size={16} />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 transition-colors"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
