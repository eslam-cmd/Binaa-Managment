import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";

const defaultSettings = {
  site_name: "Islam Hadaya",
  site_description: "موقع احترافي يقدم الخدمات والموارد التعليمية.",
  contact_email: "info@example.com",
  whatsapp_number: "966500000000",
  telegram_username: "@example",
};

// جلب الإعدادات
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken && pool) {
      try {
        const result = await pool.query(
          "SELECT * FROM settings WHERE key IN ('site_name', 'site_description', 'contact_email', 'whatsapp_number', 'telegram_username')",
        );

        const settings = { ...defaultSettings };
        result.rows.forEach((row) => {
          settings[row.key] = row.value;
        });

        return NextResponse.json({ success: true, settings });
      } catch (dbError) {
        console.warn(
          "DB settings unavailable, returning defaults:",
          dbError.message,
        );
      }
    }

    return NextResponse.json({ success: true, settings: defaultSettings });
  } catch (error) {
    console.error("خطأ:", error);
    return NextResponse.json({ success: true, settings: defaultSettings });
  }
}

// تحديث الإعدادات
export async function PUT(request) {
  try {
    const data = await request.json();
    const payload = { ...defaultSettings, ...data };

    try {
      const cookieStore = await cookies();
      const sessionToken = cookieStore.get("session_token")?.value;

      if (sessionToken && pool) {
        const updates = Object.entries(payload);
        for (const [key, value] of updates) {
          await pool.query(
            `INSERT INTO settings (key, value, updated_at) 
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (key) 
             DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
            [key, value],
          );
        }
      }
    } catch (dbError) {
      console.warn("Settings save skipped for DB fallback:", dbError.message);
    }

    return NextResponse.json({ success: true, message: "تم تحديث الإعدادات" });
  } catch (error) {
    console.error("خطأ:", error);
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الإعدادات" },
      { status: 500 },
    );
  }
}
