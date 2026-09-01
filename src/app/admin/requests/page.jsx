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
      await updateRequestStatus(id, status, notes);
      setMessage({
        type: "success",
        text: `تم تحديث حالة الطلب إلى ${status}`,
      });
      setSelectedRequest(null);
      setNotes("");
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
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  #ID
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  العميل
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  المشروع
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الحالة
                </th>
                <th className="p-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="p-3 text-center text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--nav-border])">
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
                    className="hover:bg-[var(--background)]/30 transition-colors"
                  >
                    <td className="p-3 text-sm font-mono text-[var(--text-muted)]">
                      #{String(req.id).padStart(4, "0")}
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-[var(--foreground)]">
                        {req.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {req.email}
                      </p>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-[10px] bg-[var(--primary)]/10 text-[var(--primary)]">
                        {req.project_type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[req.status]}`}
                      >
                        {statusLabels[req.status]}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-[var(--text-muted)]">
                      {new Date(req.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(
                              selectedRequest === req.id ? null : req.id,
                            );
                            setNotes("");
                          }}
                          className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                        >
                          <FiEye size={16} />
                        </button>
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req.id, "accepted")
                              }
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req.id, "rejected")
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
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

                  {req.status === "pending" && (
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
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
