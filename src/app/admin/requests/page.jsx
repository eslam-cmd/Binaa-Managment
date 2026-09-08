"use client";

import { useState, useEffect } from "react";
import {
  FiEye,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import { getRequests, updateRequestStatus } from "@/lib/api";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [notes, setNotes] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getRequests(filter === "all" ? "" : filter);
      setRequests(data);
    } catch (error) {
      console.error("خطأ:", error);
      setMessage({ type: "error", text: "حدث خطأ في جلب الطلبات" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateRequestStatus(
        id,
        status,
        notes,
        projectEndDate,
        followUpMessage,
      );
      setMessage({
        type: "success",
        text:
          followUpMessage && status !== "pending"
            ? `تم تحديث حالة الطلب وإرسال رسالة المتابعة`
            : `تم تحديث حالة الطلب إلى ${status}`,
      });
      setSelectedRequest(null);
      setNotes("");
      setProjectEndDate("");
      setFollowUpMessage("");
      fetchRequests();
    } catch (error) {
      setMessage({ type: "error", text: error.message || "حدث خطأ" });
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      req.name.toLowerCase().includes(search) ||
      req.email.toLowerCase().includes(search) ||
      req.project_type.toLowerCase().includes(search)
    );
  });

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500",
    accepted: "bg-emerald-500/10 text-emerald-500",
    rejected: "bg-red-500/10 text-red-500",
    completed: "bg-blue-500/10 text-blue-500",
  };

  const statusLabels = {
    pending: "قيد المراجعة",
    accepted: "مقبول",
    rejected: "مرفوض",
    completed: "مكتمل",
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
            الطلبات
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            إدارة طلبات العملاء
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRequests()}
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

      {/* الفلتر والبحث */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-[var(--nav-bg)] rounded-xl p-1 border border-[var(--nav-border])">
          {["all", "pending", "accepted", "rejected", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  filter === status
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {status === "all" ? "الكل" : statusLabels[status]}
              </button>
            ),
          )}
        </div>

        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <FiSearch size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الإيميل..."
            className="w-full rounded-xl bg-[var(--nav-bg)] border border-[var(--nav-border)] pr-10 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="bg-[var(--nav-bg)] border border-[var(--nav-border]) rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--background)] border-b border-[var(--nav-border])">
              <tr>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  #ID
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  العميل
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  المشروع
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  الحالة
                </th>
                <th className="p-3.5 text-right text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  التاريخ
                </th>
                <th className="p-3.5 text-center text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.12em]">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nav-border)]/80">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-[var(--text-muted])"
                  >
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-[var(--background)]/30 transition-colors duration-200"
                  >
                    <td className="p-3.5 align-middle text-sm font-mono text-[var(--text-muted)]">
                      #{String(req.id).padStart(4, "0")}
                    </td>
                    <td className="p-3.5 align-middle">
                      <p className="font-semibold text-[var(--foreground)]">
                        {req.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {req.email}
                      </p>
                    </td>
                    <td className="p-3.5 align-middle">
                      <span className="inline-flex items-center rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2.5 py-1 text-[10px] font-medium text-[var(--primary)]">
                        {req.project_type}
                      </span>
                    </td>
                    <td className="p-3.5 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusColors[req.status]}`}
                      >
                        {statusLabels[req.status]}
                      </span>
                    </td>
                    <td className="p-3.5 align-middle text-sm text-[var(--text-muted)]">
                      {new Date(req.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-3.5 align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(
                              selectedRequest === req.id ? null : req.id,
                            );
                            setNotes(req.notes || "");
                            setProjectEndDate(
                              req.project_end_date
                                ? new Date(req.project_end_date)
                                    .toISOString()
                                    .slice(0, 10)
                                : "",
                            );
                            setFollowUpMessage("");
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)] transition hover:bg-[var(--primary)]/20"
                        >
                          <FiEye size={16} />
                        </button>
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req.id, "accepted")
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 transition hover:bg-emerald-500/20"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req.id, "rejected")
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 transition hover:bg-red-500/20"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* تفاصيل الطلب */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-2xl bg-[var(--nav-bg)] border border-[var(--nav-border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[var(--foreground)]">
                تفاصيل الطلب
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-lg hover:bg-[var(--nav-border)] transition-colors text-[var(--text-muted)]"
              >
                <FiX size={20} />
              </button>
            </div>

            {requests
              .filter((r) => r.id === selectedRequest)
              .map((req) => (
                <div key={req.id} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">الاسم</p>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {req.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        الإيميل
                      </p>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {req.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        نوع المشروع
                      </p>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        {req.project_type}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">الحالة</p>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[req.status]}`}
                      >
                        {statusLabels[req.status]}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-muted)]">الوصف</p>
                    <p className="text-sm text-[var(--foreground)] bg-[var(--background)] p-3 rounded-xl border border-[var(--nav-border)]">
                      {req.description}
                    </p>
                  </div>

                  {req.notes && (
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">
                        ملاحظات
                      </p>
                      <p className="text-sm text-[var(--foreground)] bg-[var(--background)] p-3 rounded-xl border border-[var(--nav-border)]">
                        {req.notes}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-xs text-[var(--text-muted)] block mb-1">
                        تاريخ نهاية المشروع
                      </label>
                      <input
                        type="date"
                        value={projectEndDate}
                        onChange={(e) => setProjectEndDate(e.target.value)}
                        className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-muted)] block mb-1">
                        آخر حالة
                      </label>
                      <div className="rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-2 text-sm text-[var(--foreground)]">
                        {req.project_end_date
                          ? new Date(req.project_end_date).toLocaleDateString(
                              "ar-EG",
                            )
                          : "غير محدد"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      ملاحظات إضافية
                    </p>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
                      placeholder="أضف ملاحظات (اختياري)..."
                    />
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-muted)] mb-1">
                      رسالة متابعة (اختيارية)
                    </p>
                    <textarea
                      value={followUpMessage}
                      onChange={(e) => setFollowUpMessage(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] resize-none"
                      placeholder="اكتب رسالة ستُرسل إلى البريد الإلكتروني للعميل مع تحديث الحالة..."
                    />
                  </div>

                  {Array.isArray(req.message_history) &&
                    req.message_history.length > 0 && (
                      <div>
                        <p className="text-xs text-[var(--text-muted)] mb-2">
                          سجل الرسائل
                        </p>
                        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                          {req.message_history.map((item) => (
                            <div
                              key={
                                item.id || `${item.sent_at}-${Math.random()}`
                              }
                              className="rounded-xl border border-[var(--nav-border)] bg-[var(--background)] p-3"
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-xs font-medium text-[var(--foreground)]">
                                  {item.sender === "admin"
                                    ? "الإدارة"
                                    : "العميل"}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">
                                  {item.sent_at
                                    ? new Date(item.sent_at).toLocaleString(
                                        "ar-EG",
                                      )
                                    : ""}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--foreground)] whitespace-pre-line">
                                {item.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleStatusChange(req.id, "accepted")}
                      className="flex-1 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                    >
                      قبول الطلب
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, "rejected")}
                      className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                    >
                      رفض الطلب
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
