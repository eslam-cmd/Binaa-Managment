"use client";

import { useState, useEffect } from "react";
import { FiClock, FiUser, FiActivity } from "react-icons/fi";
import { getActivities } from "@/lib/api";

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getActivities();
      setActivities(data.slice(0, 10));
    } catch (error) {
      console.error("خطأ:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes("login")) return "🔐";
    if (action.includes("post")) return "📝";
    if (action.includes("request")) return "📩";
    if (action.includes("service")) return "📦";
    return "🔄";
  };

  if (loading) {
    return (
      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-2xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
        <FiActivity size={20} className="text-[var(--primary)]" />
        سجل النشاطات
      </h3>

      {activities.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">
          لا توجد نشاطات مسجلة
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl bg-[var(--background)] border border-[var(--nav-border)]"
            >
              <div className="text-xl shrink-0">
                {getActionIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--foreground)] break-words">
                  {activity.action}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-[11px] sm:text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1 break-all">
                    <FiUser size={12} />
                    {activity.email || "غير معروف"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock size={12} />
                    {new Date(activity.created_at).toLocaleString("ar-EG")}
                  </span>
                </div>
              </div>
              {activity.details && (
                <div className="text-[10px] sm:text-xs text-[var(--text-muted)] bg-[var(--nav-bg)] px-2 py-1 rounded-lg max-w-[6rem] sm:max-w-[8rem] break-all shrink-0">
                  {JSON.stringify(activity.details).slice(0, 30)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
