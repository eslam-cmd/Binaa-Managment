# Frontend Documentation

## نظرة عامة

هذا المشروع هو الواجهة الأمامية لمنصة العمل الحر/الاستشارات، مبني باستخدام Next.js 16 App Router مع React 19. المشروع يدعم:

- صفحة رئيسية للموقع العام
- صفحة المدونة
- صفحة تسجيل الدخول للإدارة
- لوحة التحكم للإدارة
- إدارة الخدمات والطلبات والمقالات
- استخدام جلسة المصادقة عبر cookies

## التقنية المستخدمة

- Next.js 16
- React 19
- App Router
- Tailwind CSS
- react-icons
- react-markdown
- gray-matter
- PostgreSQL via backend API

## هيكل المشروع

```bash
client/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.jsx
│   │   │   ├── page.jsx
│   │   │   ├── posts/
│   │   │   ├── requests/
│   │   │   ├── services/
│   │   │   ├── settings/
│   │   │   └── visitors/
│   │   ├── api/
│   │   │   └── visitors/
│   │   ├── blog/
│   │   │   ├── page.jsx
│   │   │   ├── [slug]/page.jsx
│   │   │   └── category/[category]/page.jsx
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   ├── login/page.jsx
│   │   └── page.jsx
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ActivityLog.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatsCard.jsx
│   │   ├── layout/
│   │   │   └── Navbar.jsx
│   │   └── sections/
│   │       ├── Footer.jsx
│   │       ├── Hero.jsx
│   │       ├── Pricing.jsx
│   │       ├── Process.jsx
│   │       ├── Services.jsx
│   │       ├── TrustBar.jsx
│   │       └── ...
│   ├── content/
│   │   └── posts/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── api.js
│   │   ├── constants.js
│   │   └── posts.js
│   └── app/...
├── package.json
├── next.config.mjs
├── jsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── README.md
└── .env.local
```

## نقطة التشغيل

الـ app الرئيسي يعمل على Next.js، ومشغل فعليًا عبر:

```bash
npm run dev
```

ويكون الوصول الافتراضي على:

```text
http://localhost:3000
```

## التشغيل المحلي

1. تثبيت الحزم

```bash
cd client
npm install
```

2. إعداد متغيرات البيئة
   أنشئ ملف `.env.local` داخل مجلد `client/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

3. تشغيل المشروع

```bash
npm run dev
```

4. إنشاء نسخة إنتاجية

```bash
npm run build
npm run start
```

## نظام المصادقة في الـ Frontend

المصادقة يتم التحقق منها عبر `AuthContext` داخل:

```bash
src/context/AuthContext.jsx
```

### مبدأ العمل

- عند فتح الصفحة، `checkAuth()` يطلب من السيرفر `/api/auth/session`
- إذا كانت الجلسة صالحة، يتم تعيين `user`
- إذا لم تكن الجلسة صالحة، يتم توجيه المستخدم إلى `/login`
- في صفحة تسجيل الدخول، بعد نجاح OTP يتم التوجيه مباشرة إلى `/admin`

## الصفحات الأساسية

### 1) الصفحة العامة

مسار:

```text
/
```

تحتوي على الواجهة العامة للمشروع مثل:

- Hero
- Services
- Process
- TrustBar
- Pricing
- Footer

### 2) صفحة تسجيل الدخول

مسار:

```text
/login
```

تدعم:

- إدخال البريد الإلكتروني
- إدخال كلمة المرور
- إرسال OTP
- التحقق من الرمز
- توجيه تلقائي بعد تسجيل الدخول

### 3) لوحة التحكم

مسار:

```text
/admin
```

تحتوي على:

- إحصائيات
- آخر الطلبات
- آخر المقالات
- سجل النشاطات
- آراء العملاء والتقييمات

### 4) إدارة الخدمات

مسار:

```text
/admin/services
```

تدعم:

- إضافة خدمة جديدة
- تعديل الخدمة
- حذف الخدمة
- حالة النشاط
- التمييز
- اختيار الأيقونة من قائمة منسدلة
- اختيار الفئة من قائمة منسدلة

### 5) المدونة

مسارات:

```text
/blog
/blog/[slug]
/blog/category/[category]
```

تستخدم ملفات Markdown داخل:

```bash
src/content/posts/
```

## مكتبة الـ API في الـ Frontend

الـ API wrapper الرئيسي موجود داخل:

```bash
src/lib/api.js
```

تغطي هذه المكتبة:

- login
- verifyOTP
- checkSession
- logout
- getPosts
- getServices
- createService
- updateService
- deleteService
- getRequests
- getStats
- getActivities

### مثال استخدام

```js
import { getServices, createService } from "@/lib/api";

const services = await getServices();
const newService = await createService({
  name: "خدمة جديدة",
  price: 500,
  category: "برمجة",
  emoji: "💻",
});
```

## حالة المصادقة في الـ Frontend

### `AuthContext`

ملف:

```bash
src/context/AuthContext.jsx
```

يحتوي على:

- `user`
- `loading`
- `checkAuth()`
- `logout()`

### مبدأ الحماية

صفحات الإدارة تحتاج التحقق من الجلسة، وبالتالي يتم توجيه المستخدم تلقائياً إلى `/login` إذا لم يكن مسجلاً دخول.

## صفحات الـ blog

### تحميل المقالات

يتم تحميل المقالات من ملفات Markdown باستخدام:

```bash
src/lib/posts.js
```

ويتم التعامل مع:

- العنوان
- slug
- excerpt
- category
- markdown content

## التعامل مع الـ API

كل طلبات الـ frontend تمر عبر `fetchAPI` داخل `src/lib/api.js` الذي:

- يضيف `credentials: "include"`
- يضيف `Content-Type: application/json`
- يقرأ JSON أو نص الاستجابة
- يطرح خطأ عند وجود `!res.ok`

## أهم المكونات

### 1) Header

ملف:

```bash
src/components/admin/Header.jsx
```

يتضمن:

- الإشعارات
- مستخدم النظام
- تسجيل الخروج
- قائمة الحضور/النشاط

### 2) Sidebar

ملف:

```bash
src/components/admin/Sidebar.jsx
```

يتضمن:

- قائمة الروابط الأساسية
- وضع الجوال (toggle)
- زر إخفاء/فتح الشريط

### 3) ActivityLog

ملف:

```bash
src/components/admin/ActivityLog.jsx
```

يعرض:

- سجل النشاطات
- مواعيد الأحداث
- البريد الإلكتروني للمستخدم
- نوع النشاط

### 4) StatsCard

ملف:

```bash
src/components/admin/StatsCard.jsx
```

يعرض:

- عدد الطلبات
- عدد الخدمات
- عدد المقالات
- الطلبات المعلقة

## استكشاف الأخطاء

### 1) خطأ في API URL

إذا ظهر خطأ في الاتصال:

- تأكد من وجود `NEXT_PUBLIC_API_URL` داخل `.env.local`
- تأكد أن السيرفر يعمل على المنفذ الصحيح

### 2) لا يفتح /admin

تأكد أن:

- الجلسة فعالة
- `checkSession()` يجيب `isAuthenticated: true`
- المستخدم مسجل دخولًا في السيرفر

### 3) لا يفتح /login عندما يكون المستخدم مسجل دخول

تأكد أن `AuthContext` قد تم تهيئته داخل `src/app/layout.jsx`.

## معلومات مهمة

- React/Next.js هنا يعمل بشكل RTL مع دعم عربي كامل
- معظم صفحات الإدارة تعتمد على App Router
- جميع الطلبات الإدارية تستخدم cookies
- بعض الخادمات تعرض بيانات تلقائيًا كـ JSON

## الخلاصة

هذا الـ frontend مسؤول عن:

- عرض المحتوى العام والـ blog
- إدارة لوحة التحكم
- التعامل مع APIs
- إدارة حالة المصادقة
- بناء تجربة مستخدم عربية ومناسبة للموبايل

إذا أردت، يمكنني في الخطوة التالية كتابة مستند إضافي باسم `API_REFERENCE.md` داخل مجلد العميل يوضح كل صفحة، كل route، وكل component بشكل أكثر تفصيلًا.
