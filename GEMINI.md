# GEMINI.md

## Overview
**Baby Shower Registry** is a modern web application built with **Next.js 13 (App Router)** and **TypeScript**. It provides a full‑stack solution for managing a baby‑shower registry, RSVP handling, dietary restrictions, and gift reservations. The app uses **MongoDB** (via Mongoose) for data persistence, **Upstash Redis** for caching, and optionally integrates **Firebase** for auth (see `app/api/auth`).

---

## Tech Stack
- **Framework**: Next.js 13 (App Router) – server‑components, API routes, and dynamic rendering.
- **Language**: TypeScript + React.
- **Styling**: TailwindCSS (imported in `globals.css`) with a custom design system based on CSS variables for colors, fonts, and shadows.
- **Database**: MongoDB (Docker Compose dev instance) accessed through Mongoose models (`Account`, `Group`, `RSVP`, `Gift`, `Dietary`).
- **Cache**: Upstash Redis REST API for lightweight caching.
- **Auth**: JWT‑based login endpoint (`/api/auth/login`).
- **Deployment**: Netlify (badge in README) – can be deployed to any Node server.
- **Design**: Uses custom SVG symbols, glass‑morphism style, and subtle micro‑animations defined in `globals.css`.

---

## Project Structure
```
baby-shower/
├─ app/                     # Next.js app router
│   ├─ api/                # Backend endpoints
│   │   ├─ gifts/          # CRUD for registry items
│   │   ├─ rsvp/           # RSVP submit / lookup
│   │   └─ services/       # Data‑access layers (Mongo, Redis)
│   ├─ layout.tsx          # Root layout with Google fonts & SVG defs
│   ├─ globals.css         # Tailwind + design tokens
│   └─ page.tsx            # Home page wrapper
├─ components/             # UI building blocks
│   ├─ atoms/              # Buttons, inputs, icons
│   ├─ molecules/          # Form components (RSVPForm, RegistryGrid)
│   ├─ organisms/          # Page sections (Sidebar, BabyAnimation)
│   └─ pages/              # Page templates (FilterButton, Modal)
├─ public/                 # Static assets (favicon, images)
├─ .env.local              # Development environment variables
├─ .gitignore
├─ README.md               # Project README (Netlify badge)
├─ package.json            # Dependencies & scripts
├─ plan.md                 # Detailed Mongoose schema plan (documentation)
└─ types.ts                # Shared TypeScript interfaces
```

---

## Core Data Model (see `plan.md`)
- **Account** – admin / user authentication.
- **Group** – invitation code grouping for families.
- **RSVP** – guest attendance, dietary choices, reserved gift reference.
- **Dietary** – configurable dietary options (key, label, optional icon).
- **Gift** – registry items with reservation status.

---

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/gifts` | List all gifts (optional `?category=` filter). |
| `POST`| `/api/gifts` | Create a new gift (admin). |
| `PUT` | `/api/gifts/[id]` | Update a gift (admin). |
| `PATCH`| `/api/gifts/[id]/reserve` | Reserve / release a gift for an RSVP. |
| `DELETE`| `/api/gifts/[id]` | Delete a gift (admin). |
| `GET` | `/api/rsvp` | List all RSVPs (admin). |
| `POST`| `/api/rsvp` | Submit or update an RSVP. |
| `POST`| `/api/rsvp/lookup` | Find RSVP by first/last name (public "Find My RSVP"). |
| `DELETE`| `/api/rsvp/[id]` | Delete RSVP (admin). |
| `GET` | `/api/details` | Get shower date, theme, location. |
| `PUT` | `/api/details` | Update shower details (admin). |
| `GET` | `/api/dietary` | List dietary options for the form. |
| `POST`| `/api/dietary` | Add a new dietary option (admin). |
| `POST`| `/api/auth/login` | Admin login – returns JWT cookie. |
| `POST`| `/api/auth/logout` | Clears auth cookie. |

---

## UI Components Highlights
- **SVG Symbol Library** – icons (wave, shell, sun, fish, etc.) defined in the root layout’s `<svg><defs>` for reuse across the app.
- **Responsive Layout** – `RootLayout` applies Google fonts (`Nunito`, `Pacifico`) and CSS variables for a cohesive aesthetic.
- **Micro‑Animations** – `@keyframes wave`, `float-up`, `pop-in` used for background “floater” elements and card entry.
- **Form Components** – `RSVPForm` handles dynamic dietary checkboxes (`FormField` + `Input`).
- **Registry Grid** – `RegistryGrid` displays gifts with reservation buttons that reflect `reserved` state.

---

## Setup & Development
1. **Clone the repo** (already on local path).
2. **Install dependencies**:
   ```bash
   cd C:\Users\hideh\Desktop\baby-shower
   npm ci   # installs exact lockfile versions
   ```
3. **Create a `.env.local`** (copy the example values). Ensure MongoDB is reachable – the repo includes a Docker‑Compose file:
   ```bash
   docker compose up -d
   ```
4. **Run the dev server**:
   ```bash
   npm run dev   # starts Next.js on http://localhost:3000
   ```
5. **Testing** – API routes can be hit with curl or Postman. Example RSVP submission:
   ```bash
   curl -X POST http://localhost:3000/api/rsvp \
        -H "Content-Type: application/json" \
        -d '{"firstName":"Jane","lastName":"Doe","attending":true,"guests":2,"diet":["vegetarian"],"estimateArrivalTime":"13:30"}'
   ```

---

## Design System (CSS Variables)
| Variable | Value | Intent |
|----------|-------|--------|
| `--color-ocean` | `#0077b6` | Primary brand color (seafoam). |
| `--color-sun`   | `#ffd166` | Accent for buttons & highlights. |
| `--shadow-card` | Complex inset/outset shadow | Gives a subtle glass‑morphism card feel. |
| `--animate-wave`| `wave 6s linear infinite` | Background icon “wave” animation. |
| `--font-nunito` | `Nunito, sans-serif` | Body copy. |
| `--font-pacifico`| `Pacifico, cursive` | Header & decorative text. |

---

## Dev Notes & Gotchas
- **Mongoose Model Hot‑Reload** – each schema file checks `mongoose.models.X || mongoose.model('X', schema)` to avoid `OverwriteModelError` during hot reload (see `plan.md`).
- **Upstash Redis** – token and URL are stored in `.env.local`. The helper `upstashRedis.ts` provides a tiny wrapper for `GET/SET`.
- **Tailwind Import** – `globals.css` imports Tailwind; make sure `tailwind.config.js` exists (generated by `npx tailwindcss init`).
- **Static SVG Symbols** – they are defined once in the root layout; any component can reference them via `<svg><use href="#icon-wave"/></svg>`.
- **Next.js Dynamic Routes** – RSVP lookup uses `[id]` and `lookup` sub‑folder; be aware of the required `export const dynamic = 'force-dynamic'` to disable caching for mutable data.

---

## Future Enhancements
- Add unit / integration tests (Jest + React Testing Library).
- Implement email notifications on RSVP submission.
- Expand the admin dashboard with role‑based UI.
- Add image upload handling for custom gift images (e.g., via Cloudinary).

---

*Generated by Antigravity*
