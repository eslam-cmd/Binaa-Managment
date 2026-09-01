"use client";

import { useState, useEffect } from "react";
import {
  FiSave,
  FiRefreshCw,
  FiGlobe,
  FiMail,
  FiSmartphone,
  FiMessageCircle,
} from "react-icons/fi";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    contact_email: "",
    whatsapp_number: "",
    telegram_username: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("خطأ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "تم حفظ الإعدادات بنجاح" });
      } else {
        setMessage({ type: "error", text: data.error || "حدث خطأ" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ في حفظ الإعدادات" });
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
            الإعدادات
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            إعدادات الموقع العامة
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="p-2 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border]) text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <FiRefreshCw size={18} />
        </button>
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
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              <FiGlobe className="inline ml-1" size={16} />
              اسم الموقع
            </label>
            <input
              type="text"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              <FiMail className="inline ml-1" size={16} />
              البريد الإلكتروني للتواصل
            </label>
            <input
              type="email"
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              <FiSmartphone className="inline ml-1" size={16} />
              رقم واتساب
            </label>
            <input
              type="text"
              name="whatsapp_number"
              value={settings.whatsapp_number}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              <FiMessageCircle className="inline ml-1" size={16} />
              اسم المستخدم في تلجرام
            </label>
            <input
              type="text"
              name="telegram_username"
              value={settings.telegram_username}
              onChange={handleChange}
              className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
            وصف الموقع
          </label>
          <textarea
            name="site_description"
            value={settings.site_description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border]) px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-[var(--nav-border])">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
            <FiSave size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
