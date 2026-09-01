"use client";

import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiCheck,
  FiX,
  FiPlus,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/api";

const iconOptions = [
  { label: "برمجة", value: "💻" },
  { label: "تصميم", value: "🎨" },
  { label: "تسويق", value: "📈" },
  { label: "كتابة", value: "✍️" },
  { label: "استشارة", value: "💡" },
  { label: "خدمات", value: "📦" },
  { label: "دعم", value: "🛠️" },
  { label: "سوشيال", value: "📱" },
  { label: "أمان", value: "🔐" },
  { label: "متنوع", value: "✨" },
];

const categoryOptions = [
  "عام",
  "برمجة",
  "تصميم",
  "تسويق",
  "كتابة",
  "استشارات",
  "سوشيال ميديا",
  "دعم فني",
  "إدارة محتوى",
  "أخرى",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  features: "",
  emoji: "📦",
  category: "عام",
  isActive: true,
  isHighlighted: false,
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("خطأ:", error);
      setMessage({ type: "error", text: "حدث خطأ في جلب الخدمات" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price || "",
      features: service.features?.join(", ") || "",
      emoji: service.emoji || "📦",
      category: service.category || "عام",
      isActive: service.is_active !== false,
      isHighlighted: service.is_highlighted || false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      const data = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        emoji: formData.emoji,
        category: formData.category,
        isActive: formData.isActive,
        isHighlighted: formData.isHighlighted,
      };

      if (isAdding) {
        await createService(data);
        setMessage({ type: "success", text: "تمت إضافة الخدمة بنجاح" });
      } else {
        await updateService(editingId, data);
        setMessage({ type: "success", text: "تم تحديث الخدمة بنجاح" });
      }

      setEditingId(null);
      setIsAdding(false);
      setFormData(emptyForm);
      await fetchServices();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "حدث خطأ في حفظ الخدمة",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;

    try {
      setSaving(true);
      await deleteService(id);
      setMessage({ type: "success", text: "تم حذف الخدمة بنجاح" });
      await fetchServices();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "حدث خطأ في حذف الخدمة",
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
            الخدمات
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            إدارة الخدمات المقدمة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)] transition-colors"
          >
            <FiPlus size={16} />
            إضافة خدمة
          </button>
          <button
            onClick={fetchServices}
            className="p-2 rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
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

      {isAdding && (
        <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--foreground)]">
              إضافة خدمة جديدة
            </h3>
            <button
              onClick={handleCancel}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              إلغاء
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                الأيقونة
              </label>
              <select
                name="emoji"
                value={formData.emoji}
                onChange={handleChange}
                className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                الفئة
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                اسم الخدمة
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                السعر
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              <label className="mb-1 block text-sm font-medium text-[var(--foreground)]">
                المميزات (افصل بينها بفاصلة)
              </label>
              <input
                type="text"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="ميزة 1, ميزة 2, ميزة 3"
                className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                نشط
              </label>

              <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <input
                  type="checkbox"
                  name="isHighlighted"
                  checked={formData.isHighlighted}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                مميزة
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="rounded-lg border border-[var(--nav-border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--foreground)]"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.name}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "حفظ الخدمة"}
            </button>
          </div>
        </div>
      )}

      {/* جدول الخدمات */}
      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background)] border-b border-[var(--nav-border])">
              <tr>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الرمز
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الخدمة
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  السعر
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الميزات
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الحالة
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  مميزة
                </th>
                <th className="p-3 text-center text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nav-border)]">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-[var(--background)]/30 transition-colors"
                >
                  {editingId === service.id ? (
                    // وضع التعديل
                    <>
                      <td className="p-3">
                        <select
                          name="emoji"
                          value={formData.emoji}
                          onChange={handleChange}
                          className="w-20 rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-2 py-1 text-sm text-[var(--foreground)]"
                        >
                          {iconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.value}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <div className="space-y-2">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                          />
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                          >
                            {categoryOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="w-24 rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="features"
                          value={formData.features}
                          onChange={handleChange}
                          placeholder="ميزة1, ميزة2, ميزة3"
                          className="w-full rounded-lg bg-[var(--background)] border border-[var(--nav-border)] px-3 py-1.5 text-sm text-[var(--foreground)]"
                        />
                      </td>
                      <td className="p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-[var(--nav-border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                          />
                          <span className="text-sm text-[var(--text-muted)]">
                            {formData.isActive ? "نشط" : "غير نشط"}
                          </span>
                        </label>
                      </td>
                      <td className="p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isHighlighted"
                            checked={formData.isHighlighted}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-[var(--nav-border)] text-yellow-500 focus:ring-yellow-500"
                          />
                          <span className="text-sm text-[var(--text-muted)]">
                            {formData.isHighlighted ? "نعم" : "لا"}
                          </span>
                        </label>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                          >
                            <FiSave size={16} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // وضع العرض العادي
                    <>
                      <td className="p-3 text-2xl">{service.emoji || "📦"}</td>
                      <td className="p-3">
                        <p className="font-medium text-[var(--foreground)]">
                          {service.name}
                        </p>
                        <span className="inline-flex items-center rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[10px] text-[var(--primary)] mt-1">
                          {service.category || "عام"}
                        </span>
                        {service.description && (
                          <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-1">
                            {service.description}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-sm text-[var(--foreground)] font-medium">
                        {service.price || "غير محدد"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {service.features?.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full text-[9px] bg-[var(--primary)]/10 text-[var(--text-muted)]"
                            >
                              {f}
                            </span>
                          ))}
                          {service.features?.length > 3 && (
                            <span className="text-[9px] text-[var(--text-muted)]">
                              +{service.features.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                            service.is_active !== false
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {service.is_active !== false ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {service.is_highlighted ? (
                          <span className="text-yellow-500">⭐</span>
                        ) : (
                          <span className="text-[var(--text-muted)]">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
