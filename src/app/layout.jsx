import { Cairo, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "لوحة التحكم | إسلام هداية",
  description: "لوحة تحكم إدارة موقع إسلام هداية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[var(--background)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
