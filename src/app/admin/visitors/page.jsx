"use client";

import { useState, useEffect } from "react";
import { getVisitors, getVisitorStats } from "@/lib/api";
import {
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiMonitor,
  FiGlobe,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [visitorsData, statsData] = await Promise.all([
        getVisitors(),
        getVisitorStats(),
      ]);

      setVisitors(visitorsData);
      setStats(statsData);
    } catch (error) {
      console.error("خطأ في جلب بيانات الزوار:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      v.visitor_id?.toLowerCase().includes(search) ||
      v.email?.toLowerCase().includes(search) ||
      v.browser?.toLowerCase().includes(search) ||
      v.os?.toLowerCase().includes(search)
    );
  });

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
            الزوار
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            إجمالي الزوار: {stats?.total || visitors.length}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border]) text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <FiRefreshCw size={18} />
        </button>
      </div>

      {/* إحصاءات سريعة */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)]">إجمالي الزوار</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {stats.total}
            </p>
          </div>
          <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)]">اليوم</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {stats.today}
            </p>
          </div>
          <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)]">هذا الشهر</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {stats.thisMonth}
            </p>
          </div>
          <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)]">متوسط الزيارات</p>
            <p className="text-2xl font-bold text-[var(--foreground)]">
              {stats.avgVisits?.toFixed(1) || 0}
            </p>
          </div>
        </div>
      )}

      {/* البحث */}
      <div className="relative max-w-sm">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <FiSearch size={16} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="بحث عن زائر..."
          className="w-full rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border]) pr-10 px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {/* جدول الزوار */}
      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background)] border-b border-[var(--nav-border])">
              <tr>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  المعرف
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  المتصفح / الجهاز
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  نظام التشغيل
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الإيميل
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الزيارات
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  آخر زيارة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nav-border])">
              {filteredVisitors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-[var(--text-muted)]"
                  >
                    لا يوجد زوار
                  </td>
                </tr>
              ) : (
                filteredVisitors.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-[var(--background)]/30 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-mono text-xs text-[var(--text-muted)]">
                        {v.visitor_id?.slice(0, 20)}...
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <FiMonitor
                          className="text-[var(--text-muted)]"
                          size={14}
                        />
                        <span className="text-sm text-[var(--foreground)]">
                          {v.browser || "غير معروف"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {v.device || "Desktop"}
                      </p>
                    </td>
                    <td className="p-3 text-sm text-[var(--foreground)]">
                      {v.os || "غير معروف"}
                    </td>
                    <td className="p-3 text-sm text-[var(--foreground)]">
                      {v.email || (
                        <span className="text-[var(--text-muted)]">-</span>
                      )}
                    </td>
                    <td className="p-3 text-sm font-bold text-[var(--foreground)]">
                      {v.visit_count || 1}
                    </td>
                    <td className="p-3 text-sm text-[var(--text-muted)]">
                      {v.last_visit
                        ? new Date(v.last_visit).toLocaleDateString("ar-EG")
                        : "-"}
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
