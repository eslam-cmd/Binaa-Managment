"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  FiHome,
  FiPackage,
  FiList,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiFileText,
} from "react-icons/fi";

const MENU_ITEMS = [
  { label: "لوحة التحكم", href: "/admin", icon: FiHome },
  { label: "الخدمات", href: "/admin/services", icon: FiPackage },
  { label: "الطلبات", href: "/admin/requests", icon: FiList },
  { label: "المقالات", href: "/admin/posts", icon: FiFileText },
  { label: "الزوار", href: "/admin/visitors", icon: FiUsers },
  { label: "الإعدادات", href: "/admin/settings", icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/30 backdrop-blur-[1px] z-30 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border)] text-[var(--foreground)] shadow-lg shadow-black/10 transition-transform duration-200 active:scale-95"
        aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      <aside
        className={`
          fixed top-0 right-0 h-full w-[250px] max-w-[85vw] bg-[var(--nav-bg)] border-l border-[var(--nav-border)]
          shadow-2xl shadow-black/20 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0 lg:w-[250px]
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--nav-border)]">
          <Link href="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-bold text-sm shrink-0">
              إ
            </div>
            <span className="text-lg font-bold text-[var(--foreground)] truncate">
              لوحة التحكم
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--nav-border)] hover:text-[var(--foreground)] transition-colors"
            aria-label="إغلاق القائمة"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-150px)]">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin" || pathname === "/admin/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--nav-border)]"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
