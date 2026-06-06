# GEMINI.md

## Overview
**Baby Shower Registry** is a modern, high-performance web application built with **Next.js 14 (App Router)** and **TypeScript**. It serves as a comprehensive platform for managing a baby shower event, featuring a gift registry with real-time reservation tracking, RSVP management with dietary requirements, and a vibrant "Summer Beach" aesthetic.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router) - Utilizing Server Components and Route Handlers.
- **Language**: TypeScript.
- **Styling**: TailwindCSS 4 (using the new `@theme` configuration) with custom design tokens.
- **Database/Cache**: **Upstash Redis** - Used for persistent storage of RSVPs and gift reservation metadata.
- **Animations**: Framer Motion for micro-interactions and background effects.
- **Data Fetching**: SWR for client-side state management and optimistic UI updates.
- **Notifications**: React Toastify for user feedback.

---

## Project Structure
```
baby-shower/
├─ app/                     # Next.js app router
│   ├─ api/                # Backend Route Handlers
│   │   ├─ gifts/          # Gift listing and reservation [PATCH]
│   │   ├─ rsvp/           # RSVP submission and lookup
│   │   ├─ dietary/        # Static dietary options
│   │   └─ services/       # Data-access layers (Upstash Redis)
│   ├─ hooks/              # Custom React hooks (useFetch)
│   ├─ lib/                # Shared utilities (apiMappers, defaults)
│   ├─ layout.tsx          # Root layout with SVG icons & Toast provider
│   ├─ globals.css         # Tailwind 4 theme & keyframe animations
│   └─ page.tsx            # Main interactive landing page
├─ components/             # Atomic Design UI components
│   ├─ atoms/              # Base elements (Button, Input, Icon)
│   ├─ moleculs/           # Composite elements (GiftCard, FormField)
│   ├─ organisms/          # Complex sections (RSVPForm, RegistryGrid)
│   └─ templates/          # Page layouts (BaseLayout)
├─ public/                 # Static assets (baby.png, etc.)
├─ .env.local              # Upstash Redis credentials
├─ package.json            # Dependencies (Next 14, Tailwind 4, SWR)
└─ GEMINI.md               # You are here
```

---

## Data Model (Redis Schema)
The application uses Upstash Redis with specific key patterns:
- `rsvp:<first-name>:<last-name>`: JSON hash storing guest attendance, dietary notes, and reserved gift IDs.
- `gift:meta:<gift-id>`: Metadata hash storing gift name, category, and a `count` field for total reservations.
- `gift:meta:*`: Used for gift discovery and listing.

---

## API Endpoints
| Method  | Path                      | Description                                      |
|---------|---------------------------|--------------------------------------------------|
| `GET`   | `/api/gifts`              | List all gifts with reservation status.          |
| `PATCH` | `/api/gifts/[id]/reserve` | Reserve or release a gift for a specific RSVP.   |
| `GET`   | `/api/rsvp`               | List all RSVPs (Admin view).                     |
| `POST`  | `/api/rsvp`               | Submit or update an RSVP.                        |
| `POST`  | `/api/rsvp/lookup`        | Find RSVP by name (Find My RSVP).                |
| `GET`   | `/api/dietary`            | List available dietary options.                  |
| `GET`   | `/api/health`             | Simple health check endpoint.                    |

---

## Design System
### Colors (Tailwind 4 @theme)
- `ocean` (#0077b6): Primary brand color.
- `coral` (#f4845f): Accent color for primary actions.
- `sun` (#ffd166): Warm highlight color.
- `seafoam`, `sky`, `sand`, `deep`: Secondary palette for the beach theme.

### Typography
- **Nunito**: Main body font for readability.
- **Pacifico**: Decorative cursive font for headers and accents.

### SVG Icon Library
Defined as symbols in `layout.tsx` for high performance and easy reuse:
`wave`, `shell`, `sun`, `fish`, `calendar`, `umbrella`, `pin`, `flower`, `party`, `watermelon`, `moon`, `palm`, `tent`, `bottle`, `bib`, `caddy`, `bath`, `star`, `shirt`, `cloth`, `firstaid`.

---

## Key Workflows
1. **RSVP**: Guests search for their name or submit a new RSVP. Data is stored in Redis.
2. **Registry**: Guests browse gifts. Reservations are tracked by gift ID and rsvp ID.
3. **Optimistic Updates**: The UI uses SWR to immediately reflect gift reservations before the server confirms.

---

## Setup & Development
1. **Environment**: Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are in `.env.local`.
2. **Install**: `npm install`
3. **Dev**: `npm run dev`
4. **Seed**: Gifts are automatically seeded from `app/lib/defaults.ts` if Redis is empty.

---

## Notes for Developers
- **Tailwind 4**: Use the new `@theme` block in `globals.css`. Do not look for a `tailwind.config.js` as it's optional/deprecated in v4 for CSS-first config.
- **Redis First**: MongoDB is present in `docker-compose.yml` but currently unused by the API. The source of truth is Upstash Redis.
- **Anonymous Reservations**: Guests can reserve gifts before submitting an RSVP; these are tracked via an `anon:` prefixed ID in localStorage until "claimed" by an RSVP name.
