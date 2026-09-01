"use client";

import { useState, useEffect } from "react";
import {
  FiPackage,
  FiList,
  FiUsers,
  FiFileText,
  FiTrendingUp,
} from "react-icons/fi";
import { getStats, getRequests, getServices, getPosts } from "@/lib/api";
import StatsCard from "@/components/admin/StatsCard";
import ActivityLog from "@/components/admin/ActivityLog";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // جلب الإحصائيات
      const statsData = await getStats();
      setStats(statsData);

      // جلب آخر الطلبات
      const requestsData = await getRequests();
      setRecentRequests(requestsData.slice(0, 5));

      // جلب آخر المقالات
      const postsData = await getPosts();
      setRecentPosts(postsData.slice(0, 5));
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
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

  const statItems = [
    {
      label: "الخدمات",
      value: stats?.services || 0,
      icon: FiPackage,
      color: "blue",
    },
    {
      label: "الطلبات",
      value: stats?.requests || 0,
      icon: FiList,
      color: "green",
    },
    {
      label: "المقالات",
      value: stats?.posts || 0,
      icon: FiFileText,
      color: "purple",
    },
    {
      label: "الطلبات المعلقة",
      value: stats?.pendingRequests || 0,
      icon: FiTrendingUp,
      color: "orange",
    },
  ];

  const customerReviews = [
    {
      id: 1,
      name: "سارة محمد",
      service: "تصميم موقع",
      rating: 5,
      review:
        "التجربة كانت ممتازة جدًا، الفريق فهم احتياجاتنا بسرعة وأعطانا نتيجة احترافية وصارت المتابعة ممتازة.",
      date: "منذ 3 أيام",
    },
    {
      id: 2,
      name: "عبدالله علي",
      service: "خدمة التسويق",
      rating: 4,
      review:
        "النتائج أتت بشكل جيد جدًا، وأحببت الشفافية في التواصل والالتزام بالمواعيد.",
      date: "منذ أسبوع",
    },
    {
      id: 3,
      name: "ريم أحمد",
      service: "البرمجة",
      rating: 5,
      review:
        "الموقع أصبح أكثر احترافية، والواجهة عندها جودة عالية جدًا، والعمل سهل ومريح.",
      date: "منذ 10 أيام",
    },
  ];

  const averageRating = (
    customerReviews.reduce((sum, item) => sum + item.rating, 0) /
    customerReviews.length
  ).toFixed(1);

  return (
    <div className="space-y-5 sm:space-y-6 w-full">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
          لوحة التحكم
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          مرحباً بك في لوحة تحكم إسلام هداية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map((item) => (
          <StatsCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <FiList size={20} className="text-[var(--primary)]" />
            آخر الطلبات
          </h3>
          <div className="space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                لا توجد طلبات حالياً
              </p>
            ) : (
              recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 rounded-xl bg-[var(--background)] border border-[var(--nav-border)]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] break-words">
                      {req.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] break-words">
                      {req.project_type} • {req.email}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap self-start sm:self-auto ${
                      req.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : req.status === "rejected"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {req.status === "accepted"
                      ? "مقبول"
                      : req.status === "rejected"
                        ? "مرفوض"
                        : "قيد المراجعة"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <FiFileText size={20} className="text-[var(--accent)]" />
            آخر المقالات
          </h3>
          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">
                لا توجد مقالات حالياً
              </p>
            ) : (
              recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 rounded-xl bg-[var(--background)] border border-[var(--nav-border)]"
                >
                  <p className="text-sm font-medium text-[var(--foreground)] break-words">
                    {post.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] sm:text-xs text-[var(--text-muted)]">
                    <span>{post.category || "غير مصنف"}</span>
                    <span>•</span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">
              آراء العملاء والتقييمات
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              نظرة سريعة على تقييمات العملاء والرضا عن الخدمات
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1.5 border border-[var(--nav-border)]">
            <span className="text-[var(--primary)] text-lg">★</span>
            <span className="text-sm font-medium text-[var(--foreground)]">
              متوسط التقييم: {averageRating}/5
            </span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {customerReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-[var(--nav-border)] bg-[var(--background)] p-4"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {review.service}
                  </p>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {review.date}
                </span>
              </div>

              <div className="flex items-center gap-1 mb-3 text-yellow-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index}>{index < review.rating ? "★" : "☆"}</span>
                ))}
              </div>

              <p className="text-sm leading-7 text-[var(--foreground)]/90">
                “{review.review}”
              </p>
            </div>
          ))}
        </div>
      </div>

      <ActivityLog />
    </div>
  );
}
