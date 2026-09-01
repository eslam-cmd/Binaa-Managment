"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiAlertCircle,
  FiCheckCircle,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { login, verifyOTP } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, checkAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState({});

  useEffect(() => {
    if (user && !loading) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await login(email, password);
      setUserId(data.userId);
      setStep(2);
      setSuccess("✅ تم إرسال رمز التحقق إلى بريدك الإلكتروني");
    } catch (err) {
      setError(err.message || "حدث خطأ في تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await verifyOTP(userId, otp);
      await checkAuth();
      setSuccess("✅ تم تسجيل الدخول بنجاح");
      setTimeout(() => {
        router.replace("/admin");
      }, 500);
    } catch (err) {
      setError(err.message || "رمز التحقق غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setError("");
    setSuccess("");
    setOtp("");
  };

  const handleFocus = (field) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--background)] to-[var(--nav-bg)] p-4">
      <div className="w-full max-w-[420px]">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] shadow-lg shadow-[var(--primary)]/25 mb-4">
            <FiLogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            لوحة التحكم
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1.5">
            {step === 1
              ? "سجل الدخول لإدارة موقعك"
              : "أدخل رمز التحقق المرسل إلى بريدك"}
          </p>
        </div>

        {/* البطاقة */}
        <div className="bg-[var(--nav-bg)]/80 backdrop-blur-sm border border-[var(--nav-border)] rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/20">
          {/* رسائل الحالة */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in slide-in-from-top-4 duration-300">
              <FiAlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-in slide-in-from-top-4 duration-300">
              <FiCheckCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span className="leading-relaxed">{success}</span>
            </div>
          )}

          {/* الخطوة 1: تسجيل الدخول */}
          {step === 1 && (
            <form onSubmit={handleLogin} className="space-y-4.5">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  البريد الإلكتروني
                </label>
                <div
                  className={`relative rounded-xl transition-all duration-200 ${
                    focused.email ? "ring-2 ring-[var(--primary)]/30" : "ring-0"
                  }`}
                >
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focused.email || email
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    placeholder="admin@example.com"
                    required
                    className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] pr-11 pl-4 py-3.5 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] placeholder:font-light focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  كلمة المرور
                </label>
                <div
                  className={`relative rounded-xl transition-all duration-200 ${
                    focused.password
                      ? "ring-2 ring-[var(--primary)]/30"
                      : "ring-0"
                  }`}
                >
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      focused.password || password
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    <FiLock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] pr-11 pl-4 py-3.5 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] placeholder:font-light focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-2.5">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <FiLogIn className="text-lg transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {/* الخطوة 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-4.5">
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                  رمز التحقق
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary)]">
                    <FiShield size={18} />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••••"
                    required
                    className="w-full rounded-xl bg-[var(--background)] border border-[var(--nav-border)] pr-11 pl-4 py-3.5 text-center text-lg font-bold tracking-[6px] text-[var(--foreground)] placeholder:text-[var(--text-muted)] placeholder:font-light placeholder:tracking-normal focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[var(--text-muted)]">
                    تم إرسال الرمز إلى{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {email}
                    </span>
                  </p>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    ⏳ 10 دقائق
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "جاري التحقق..." : "تحقق من الرمز"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-sm text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                ← العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {/* الفوتر */}
          <div className="mt-5 pt-4 border-t border-[var(--nav-border)]">
            <p className="text-xs text-center text-[var(--text-muted)]">
              {step === 1 ? (
                <span className="flex items-center justify-center gap-1.5">
                  <FiShield size={12} className="text-[var(--primary)]" />
                  دخول آمن بخطوتين
                </span>
              ) : (
                <span>⏳ الرمز صالح لمدة 10 دقائق</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
