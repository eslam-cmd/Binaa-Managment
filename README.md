# Freelance Platform — Frontend Client

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, responsive frontend for a freelance/consulting platform built with Next.js 16 App Router and React 19. Features a public-facing website, blog, admin dashboard, and full content management system.

> 🔗 Backend repository: [Freelance Platform — Backend API](https://github.com/eslam-cmd/freelance-server)

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | React framework with App Router |
| **React 19** | UI component library |
| **Tailwind CSS** | Utility-first styling |
| **react-icons** | Icon library |
| **react-markdown** | Markdown rendering |
| **gray-matter** | Markdown frontmatter parsing |

---

## 📁 Project Structure

```text
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
│   └── lib/
│       ├── api.js
│       ├── constants.js
│       └── posts.js
├── package.json
├── next.config.mjs
├── jsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Backend API running (see backend repo)

### Installation

```bash
# Clone the repository
git clone https://github.com/eslam-cmd/freelance-client.git
cd client

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env.local` file inside the `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

App runs at `http://localhost:3000`

---

## ✨ Key Features

### Public Website
- **Hero Section** — Landing page with call-to-action
- **Services** — Available service listings
- **Process** — How it works walkthrough
- **Pricing** — Plan comparison
- **Blog** — Markdown-powered blog with category filtering

### Admin Dashboard (`/admin`)
- **Statistics** — Request, service, and post counters
- **Requests Management** — View and update client request status
- **Services Management** — Full CRUD with icon and category selection
- **Posts Management** — Create and manage blog content
- **Activity Log** — Real-time admin action history
- **Visitor Tracking** — Monitor platform visitors

---

## 🔐 Authentication

Authentication is session-based using HTTP-only cookies, managed via `AuthContext`:

```bash
src/context/AuthContext.jsx
```

**Flow:**
1. User submits email + password → OTP sent via email
2. User enters OTP → Session created
3. `checkAuth()` validates session on every page load
4. Unauthenticated users are redirected to `/login`

**Context values:**
- `user` — Authenticated user object
- `loading` — Auth check state
- `checkAuth()` — Validates current session
- `logout()` — Clears session

---

## 🗺️ Pages

| Route | Description |
| :--- | :--- |
| `/` | Public homepage |
| `/login` | Admin login with OTP verification |
| `/admin` | Dashboard with stats and activity |
| `/admin/services` | Service management |
| `/admin/requests` | Client request management |
| `/admin/posts` | Blog post management |
| `/admin/visitors` | Visitor analytics |
| `/blog` | Blog listing |
| `/blog/[slug]` | Single blog post |
| `/blog/category/[category]` | Posts by category |

---

## 📡 API Client

All API calls are handled through `src/lib/api.js`:

```js
import { getServices, createService } from "@/lib/api";

const services = await getServices();

const newService = await createService({
  name: "New Service",
  price: 500,
  category: "development",
  emoji: "💻",
});
```

**Available methods:**
- `login` / `verifyOTP` / `checkSession` / `logout`
- `getPosts` / `getServices` / `getRequests`
- `createService` / `updateService` / `deleteService`
- `getStats` / `getActivities`

All requests include:
```js
credentials: "include"   // for session cookies
Content-Type: "application/json"
```

---

## 🎨 Key Components

| Component | Purpose |
| :--- | :--- |
| `admin/Header.jsx` | Notifications, user info, logout |
| `admin/Sidebar.jsx` | Navigation links, mobile toggle |
| `admin/ActivityLog.jsx` | Admin action history with timestamps |
| `admin/StatsCard.jsx` | Dashboard statistics cards |

---

## ⚠️ Troubleshooting

**API connection error**
Verify `NEXT_PUBLIC_API_URL` in `.env.local` and ensure the backend is running on the correct port.

**`/admin` not loading**
Ensure the session is valid and `checkSession()` returns `isAuthenticated: true`.

**Redirect loop on `/login`**
Verify `AuthContext` is initialized inside `src/app/layout.jsx`.

---

## 📬 Contact

Built by **Islam Hadaya**

- Portfolio: [my-profile-personal-nextjs.vercel.app](https://my-profile-personal-nextjs.vercel.app)
- LinkedIn: [linkedin.com/in/islam-hadaya](https://linkedin.com/in/islam-hadaya)
- Email: [hdayaaslam34@gmail.com](mailto:hdayaaslam34@gmail.com)

---

*Last Updated: September 2026*
