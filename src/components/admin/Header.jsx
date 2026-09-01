"use client";

import { useAuth } from "@/context/AuthContext";
import { getActivities } from "@/lib/api";
import { FiBell, FiUser, FiLogOut, FiClock, FiActivity } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";

const getNotificationType = (action = "") => {
  const value = action.toLowerCase();
  if (value.includes("login")) return "login";
  if (value.includes("logout")) return "logout";
  if (value.includes("request")) return "request";
  if (value.includes("post")) return "post";
  if (value.includes("service")) return "success";
  return "activity";
};

const getTimeAgo = (value) => {
  if (!value) return "الآن";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "الآن";

  const diffMinutes = Math.max(
    0,
    Math.round((Date.now() - date.getTime()) / 60000),
  );
  if (diffMinutes < 1) return "الآن";
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;

  const diffDays = Math.floor(diffHours / 24);
  return `منذ ${diffDays} يوم`;
};

export default function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const data = await getActivities();
      const mapped = (data || []).slice(0, 8).map((activity) => ({
        id: activity.id || `${activity.action}-${activity.created_at}`,
        type: getNotificationType(activity.action),
        message: activity.action || "نشاط جديد",
        time: new Date(activity.created_at).toLocaleString("ar-EG"),
        read: false,
      }));

      setNotifications(mapped);
      setUnreadCount(mapped.length);
    } catch (error) {
      console.error("خطأ في جلب الإشعارات:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    const icons = {
      login: "🔐",
      logout: "🚪",
      request: "📩",
      post: "📝",
      activity: "⚡",
      success: "✅",
      warning: "⚠️",
    };
    return icons[type] || "📌";
  };

  const getNotificationColor = (type) => {
    const colors = {
      login: "bg-blue-500/10 text-blue-500",
      logout: "bg-gray-500/10 text-gray-500",
      request: "bg-emerald-500/10 text-emerald-500",
      post: "bg-purple-500/10 text-purple-500",
      activity: "bg-yellow-500/10 text-yellow-500",
      success: "bg-green-500/10 text-green-500",
      warning: "bg-orange-500/10 text-orange-500",
    };
    return colors[type] || "bg-[var(--nav-border)] text-[var(--text-muted)]";
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <header className="sticky top-0 z-30 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] backdrop-blur-md">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 gap-2">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[var(--foreground)] hidden sm:block">
            لوحة التحكم
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر الإشعارات */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)] transition-colors relative"
              aria-label="الإشعارات"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 text-[9px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* قائمة الإشعارات المنسدلة */}
            {notificationsOpen && (
              <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-[min(90vw,22rem)] sm:w-80 md:w-96 max-h-96 overflow-hidden bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-[var(--nav-border])">
                  <div className="flex items-center gap-2">
                    <FiActivity className="text-[var(--primary)]" size={16} />
                    <span className="text-sm font-bold text-[var(--foreground)]">
                      الإشعارات
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {unreadCount} غير مقروءة
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                      >
                        تعليم الكل
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-y-auto max-h-72">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-[var(--text-muted)]">
                      <FiBell size={32} className="mb-2 opacity-50" />
                      <p className="text-sm">لا توجد إشعارات</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--nav-border)] hover:bg-[var(--card-bg)] transition-colors duration-200 cursor-pointer ${
                          !notif.read ? "bg-[var(--primary)]/5" : ""
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${getNotificationColor(notif.type)} flex-shrink-0`}
                        >
                          <span className="text-base">
                            {getNotificationIcon(notif.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--foreground)] leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <FiClock
                              size={11}
                              className="text-[var(--text-muted)]"
                            />
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {getTimeAgo(notif.time)}
                            </span>
                          </div>
                        </div>
                        {!notif.read && (
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse mt-1" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-[var(--nav-border)] text-center">
                  <button className="text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                    عرض جميع الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* المستخدم */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[var(--nav-border)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                <FiUser size={16} />
              </div>
              <span className="text-sm font-medium text-[var(--foreground)] hidden sm:block">
                {user?.email || "Admin"}
              </span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-xl shadow-xl overflow-hidden">
                <div className="p-3 border-b border-[var(--nav-border])">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {user?.email || "Admin"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    مدير النظام
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut size={16} />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
