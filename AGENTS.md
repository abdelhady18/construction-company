# BuildCo — Construction Company Website

## Tech stack

- **Next.js 16** (Turbopack for dev). `proxy.ts` replaces deprecated `middleware.ts`.
- **Prisma 7** — client entry is `@/app/generated/prisma`, **not** `@prisma/client`. No `url` in schema; relies on `DATABASE_URL` env var.
- **Tailwind 4** — `@import "tailwindcss"` in `globals.css`, no `tailwind.config`.
- **next-intl 4** — cookie-based locale (`localePrefix: "never"`). Arabic (`ar`) + English (`en`).
- **NextAuth 5 beta** (Credentials + JWT). Auth check in `proxy.ts` via `getToken` from `next-auth/jwt`.
- **motion** library (not framer-motion) — import from `"motion/react"`.
- **Zod v4** — `result.error.issues` (not `.errors`).
- **Vitest** — 100 tests across 11 files. Setup mocks in `vitest.setup.ts` (auth, prisma, email, cache).

## Commands

```bash
npm run dev        # dev server (Turbopack)
npm run build      # prisma generate && next build
npm test           # vitest run (all tests)
npm test -- path   # single test file
npm run test:watch # vitest watch mode
npx next build     # skip prisma generate
npx vitest run     # skip next build
npx prisma seed    # upserts defaults from lib/settings.ts
npx prisma migrate dev  # after schema changes
```

## Architecture quirks

- **`proxy.ts`** does NOT call or return `next-intl/middleware` — doing so causes 404 on `/`. Instead it detects locale manually (regex on `Cookie` header, fallback to `Accept-Language`), sets `NEXT_LOCALE` response cookie, and returns simple `NextResponse.next()`.
- **`layout.tsx`** bypasses `getLocale()`/`getMessages()` from next-intl entirely. Uses `cookies()` from `next/headers` directly via a `resolveLocale()` helper. Passes locale + messages explicitly to `NextIntlClientProvider`.
- **`i18n/request.ts`** stays as minimal `getRequestConfig` — it falls back to default locale since `X-NEXT-INTL-LOCALE` header is never set (middleware doesn't forward request headers to server components reliably).
- **`PowerShell Invoke-WebRequest -Headers @{"Cookie"="..."}`** does NOT send the `Cookie` header correctly. Use `curl.exe -H "Cookie: ..."` for testing. This caused false negatives during debugging.
- **`next.config.ts`** must wrap with `createNextIntlPlugin("./i18n/request.ts")`.
- **Admin auth** is defense-in-depth: `proxy.ts` guards `/admin/:path*` + `/api/upload`, per-route `auth()` calls in API routes.
- **`lib/SettingsContext.tsx`** (client-side `useSettings()` hook) eliminates 5+ duplicate fetches across section components.
- **`lib/settings.ts`** — `getSettings()` uses `React.cache()` for per-request dedup. `defaultSettings` merged with DB rows at runtime.
- **`lib/validation.ts`** exports `parseBody()` helper used by all mutation routes.
- **`formatHoursDisplay()`** in `BusinessHoursPicker` takes optional `locale` param for Arabic (24h time).
- **`picomatch@^4.0.4`** is explicit devDependency — required to fix `fdir` npm hoisting issue in CI.

## Directory layout

```
proxy.ts                    # middleware (locale + auth)
i18n/routing.ts             # next-intl routing config
i18n/request.ts             # message loading config
messages/en.json, ar.json   # translation files
lib/
  auth.ts                   # NextAuth config
  prisma.ts                 # singleton PrismaClient (Neon adapter)
  settings.ts               # defaultSettings + getSettings()
  validation.ts             # Zod schemas + parseBody()
  SettingsContext.tsx        # client-side useSettings() hook
  email.ts                  # resend email helper
app/
  page.tsx                  # single-page site (anchor nav)
  layout.tsx                # root layout, NextIntlClientProvider
  Providers.tsx             # SettingsProvider only
  generated/prisma/         # Prisma client output (gitignored)
  api/                      # REST routes (all have tests)
  admin/                    # admin panel (login + CRUD + settings)
components/
  sections/                 # Navbar, Hero, Services, Projects, About, Contact, Footer
  ui/                       # shared: Button, Card, Input, Icon, etc.
  admin/                    # DataTable, ImageUploader, MessageDetailModal, Sidebar
prisma/schema.prisma        # 5 models: Admin, Service, Project, ContactMessage, TeamMember, SiteSetting
```

## CI

`.github/workflows/ci.yml` — runs on push/PR to `main`: `npm ci` → `prisma generate` → `npm test` → `npm run build`.

## Testing

- All API routes mocked via `vitest.setup.ts`. No database needed.
- Tests import route handlers directly, use `POST/GET` request helpers.
- Focus: `app/api/**` and `lib/**`.

## Style

- Single-page app with anchor nav (`#home`, `#services`, etc.)
- 20 custom architectural SVG icons in `components/ui/Icon.tsx` (not emoji)
- Font stack: `Prata` (serif headings), `Sora` (sans body), `Cairo` (Arabic via `[dir="rtl"]` CSS override)
- RTL uses Tailwind logical properties and `dir` attribute on `<html>`
- Section components are client components (`"use client"`) for animations and data fetching
