# Wanderlast 🌍

> Discover, explore, and book your next unforgettable journey.

Wanderlust is a modern travel and destination listing web app that lets users browse stunning places, read details, manage bookings, and plan trips with ease. Built with cutting-edge web technology for speed, beauty, and a seamless user experience.

---

## ✨ Features

- **Browse Destinations** — Explore curated travel spots with rich details and visuals
- **Destination Details** — Deep-dive into any place with images, descriptions, and key info
- **Add New Listings** — Hosts/add-ons can submit new destinations to the platform
- **User Authentication** — Secure sign-up, sign-in, and Google OAuth (via `better-auth`)
- **Password Recovery** — Forgot-password and reset-password flows included
- **My Bookings** — Users can view and manage their travel reservations
- **Profile** — Personal user profile page
- **Responsive UI** — Fully responsive layout powered by Tailwind CSS v4
- **Rich Components** — 40+ shadcn UI components (accordion, dialog, carousel, calendar, etc.)
- **Smooth Navigation** — Client-side routing with Next.js 16 App Router

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 (CSS-first, no config file) |
| **UI Library** | shadcn / Base UI (`@base-ui/react`) |
| **State / Data** | React 19.3, MongoDB adapter (`@better-auth/mongo-adapter`) |
| **Auth** | `better-auth` + `@better-auth/mongo-adapter` |
| **Fonts** | Geist (auto-optimized via `next/font`) |
| **Icons** | Lucide React |
| **Animations** | `tw-animate-css`, `recharts` for charts |
| **Database** | MongoDB (`mongodb` driver) |
| **Build Tool** | Turbopack (`@tailwindcss/turbopack`) |
| **Lint / Type** | ESLint (`eslint-config-next`), TypeScript 5 |

---

## 📁 Project Structure

```bash
wanderlust/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── add-destination/   # Submit a new destination
│   │   ├── destinations/      # All destinations & detail page
│   │   ├── my-bookings/       # User bookings view
│   │   ├── profile/           # User profile
│   │   ├── sign-in/           # Login page
│   │   ├── sign-up/           # Register page
│   │   ├── forgot-password/   # Forgot password flow
│   │   ├── reset-password/    # Reset password flow
│   │   ├── api/               # API routes (auth, db-check)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles + Tailwind theme
│   ├── components/            # Shared components
│   │   ├── auth/              # Auth-related components
│   │   ├── ui/                # shadcn UI components (40+)
│   │   └── Navbar.tsx         # Top navigation
│   │   └── HeroBanner.tsx     # Hero section
│   │   └── Footer.tsx         # Footer
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Helpers & clients
│       ├── auth.ts            # Auth utilities
│       ├── auth-client.ts     # Client-side auth
│       ├── db.ts              # Database connection
│       ├── bookings.ts        # Booking logic
│       └── utils.ts           # `cn` re-export
├── package.json
├── next.config.ts             # Next config (cache + partial prefetch)
├── components.json            # shadcn config (base-ui/react)
└── README.md
```

---

## 🚀 Getting Started

Make sure you have **Node.js** installed, then:

```bash
# 1. Clone / open the project
# 2. Install dependencies
npm install

# 3. Start the dev server (with Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

> ⚠️ **First-time setup:** Run `npm run dev` or `npm run build` at least once so Next.js generates `.next/types` (required by the TypeScript check).

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:3000` |
| `npm run build` | Production build + TypeScript check |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Standalone TypeScript check |

---

## 🎨 Design Highlights

- **Clean, modern UI** with generous whitespace and bold typography
- **Interactive components** — carousels, calendars, dialogs, dropdown menus
- **Fast navigation** thanks to App Router + partial prefetching
- **Responsive across all screen sizes**

---

## 🌟 Why Wanderlust?

- Built on **Next.js 16** for the latest performance features
- **No custom Tailwind config file needed** — pure CSS-first theming in `globals.css`
- **Shadcn + Base UI** — beautiful, accessible components out of the box
- **Auth + DB ready** — `better-auth` integrated with MongoDB
- **Production-grade build** with Turbopack, strict TypeScript, and linting

---

## 📄 License

This project is private and part of the Wanderlust travel app series.

---

*Made with ❤️ for travelers everywhere.*
