"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiSave, FiX, FiLoader } from "react-icons/fi";
import { getPost, updatePost } from "@/lib/api";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    status: "published",
  });

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getPost(postId);
      setFormData({
        title: data.title || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "",
        tags: data.tags?.join(", ") || "",
        author: data.author || "إسلام هداية",
        status: data.status || "published",
      });
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ في جلب المقالة" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const data = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      await updatePost(postId, data);
      setMessage({ type: "success", text: "تم تحديث المقالة بنجاح" });
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "حدث خطأ في التحديث",
      });
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            تعديل المقالة
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            تحديث محتوى المقالة
          </p>
        </div>
        <Link
          href="/admin/posts"
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <FiArrowRight size={16} />
          العودة للمقالات
        </Link>
      </div>

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

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-2xl p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            العنوان *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            placeholder="عنوان المقالة..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            الملخص
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
            placeholder="ملخص قصير للمقالة..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            المحتوى *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none font-mono"
            placeholder="محتوى المقالة (يدعم Markdown)..."
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              التصنيف
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="مثل: تقنية"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              الوسوم
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="مفصولة بفواصل"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              الكاتب
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              placeholder="اسم الكاتب"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            الحالة
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          >
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--nav-border])">
          <Link
            href="/admin/posts"
            className="px-4 py-2 rounded-xl border border-[var(--nav-border]) text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors text-sm"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
            <FiSave size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
