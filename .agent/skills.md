# Tech Stack & Skills Required

## Frontend (Client & UI)
* **Framework:** Next.js (App Router) - React 18+
* **Styling:** Tailwind CSS (for rapid, mobile-first responsive design)
* **Components:** shadcn/ui or standard accessible HTML/Tailwind components.
* **Icons:** Lucide React

## Backend (Server & API)
* **Server Logic:** Next.js Server Actions (preferred for seamless frontend/backend integration) or Next.js Route Handlers (`app/api/`).
* **Authentication:** Next.js middleware using secure HTTP-only cookies to verify the global password.

## Database & Storage
* **Database:** PostgreSQL (Hosted on Vercel Postgres, Supabase, or Neon).
* **ORM:** Prisma (highly recommended for AI generation) or Drizzle. This will manage the database schema, migrations, and type-safe queries.

## Deployment Strategy
* **Platform:** Vercel (allows for one-click deployment of the Next.js app and provides a free PostgreSQL database attachment for the demo).