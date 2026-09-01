"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "../ThemeProvider";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiBell,
  FiUser,
  FiLogOut,
  FiClock,
  FiActivity,
} from "react-icons/fi";

const NAV_LINKS = [
  { label: "خدماتي", href: "#services" },
  { label: "أعمالي", href: "#portfolio" },
  { label: "المدونة", href: "/blog" },
  { label: "الباقات", href: "#pricing" },
  { label: "الأسئلة الشائعة", href: "#faq" },
];

// بيانات إشعارات وهمية (سيتم جلبها من API لاحقاً)
const NOTIFICATIONS = [
  {
    id: 1,
    type: "login",
    message: "تسجيل دخول من جهاز جديد",
    time: "منذ 5 دقائق",
    icon: "🔐",
  },
  {
    id: 2,
    type: "logout",
    message: "تم تسجيل الخروج",
    time: "منذ 15 دقيقة",
    icon: "🚪",
  },
  {
    id: 3,
    type: "request",
    message: "طلب جديد من أحمد محمد",
    time: "منذ 30 دقيقة",
    icon: "📩",
  },
  {
    id: 4,
    type: "post",
    message: "تم نشر مقالة جديدة",
    time: "منذ ساعة",
    icon: "📝",
  },
  {
    id: 5,
    type: "login",
    message: "تسجيل دخول من هاتف محمول",
    time: "منذ ساعتين",
    icon: "📱",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const { theme, toggleTheme } = useTheme();
  const notificationsRef = useRef(null);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  // إغلاق الإشعارات عند الضغط خارجها
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

  // تحديث الإشعارات بشكل دوري (محاكاة)
  useEffect(() => {
    const interval = setInterval(() => {
      // إضافة إشعار جديد كل 30 ثانية (محاكاة)
      const newNotification = {
        id: Date.now(),
        type: "activity",
        message: `نشاط جديد في الساعة ${new Date().toLocaleTimeString("ar-EG")}`,
        time: "الآن",
        icon: "⚡",
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
      setUnreadCount((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (time) => {
    if (time === "الآن") return "الآن";
    return time;
  };

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

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* الشعار + مؤشر التوفر */}
        <a href="#hero" className="flex items-center gap-2.5 shrink-0">
          <span className="font-bold text-[var(--foreground)] text-base transition-colors duration-300">
            إسلام هدايا
          </span>
          <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-[var(--text-muted)] border-r border-[var(--nav-border]) pr-2.5 mr-0.5 transition-colors duration-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.6 w-1.6 bg-[var(--accent)]" />
            </span>
            متاح للعمل
          </span>
        </a>

        {/* روابط سطح المكتب */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* الأزرار - سطح المكتب */}
        <div className="hidden md:flex items-center gap-2">
          {/* زر الإشعارات */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)] transition-all duration-200"
              aria-label="الإشعارات"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 text-[9px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* قائمة الإشعارات المنسدلة */}
            {notificationsOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 max-h-96 overflow-hidden bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-xl shadow-2xl shadow-black/50 backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
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
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-[10px] text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      تعليم الكل
                    </button>
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
                        className={`flex items-start gap-3 px-4 py-3 border-b border-[var(--nav-border)] hover:bg-[var(--card-bg)] transition-colors duration-200 ${
                          notif.time === "الآن" ? "bg-[var(--primary)]/5" : ""
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
                        {notif.time === "الآن" && (
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

          {/* زر تبديل الثيم */}
          <button
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"
            }
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)] transition-all duration-200"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <a
            href="#contact"
            className="inline-flex items-center rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all duration-200"
          >
            اطلب خدمتك
          </a>
        </div>

        {/* أزرار الموبايل */}
        <div className="flex items-center gap-1 md:hidden">
          {/* زر الإشعارات للموبايل */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)] transition-all duration-200"
            >
              <FiBell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* زر تبديل الثيم للموبايل */}
          <button
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"
            }
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)] transition-all duration-200"
          >
            {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)] transition-all duration-200"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {open && (
        <div className="md:hidden border-t border-[var(--nav-border)] bg-[var(--mobile-menu-bg)] px-5 py-4 flex flex-col gap-3 transition-colors duration-300">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[var(--text-muted)] text-sm font-medium hover:text-[var(--foreground)] transition-colors duration-200 py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)] transition-all duration-200"
          >
            اطلب خدمتك
          </a>
        </div>
      )}
    </nav>
  );
}
