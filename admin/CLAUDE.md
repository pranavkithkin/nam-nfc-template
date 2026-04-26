# NAM NFC Admin — Claude Context

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v3
- **Database**: PostgreSQL via **Prisma ORM** — hosted on **Supabase** (`DATABASE_URL` + `DIRECT_URL` env vars)
- **Storage**: Supabase Storage (for avatar, cover, company logo images)
- **Auth**: NextAuth v4 with bcrypt password hashing
- **ORM**: Prisma 5 — schema at `prisma/schema.prisma`

## Key Files
- `lib/platformIcons.tsx` — **single source of truth** for all social platforms (icons, colors, dropdown list)
- `components/card-editor/SocialLinksEditor.tsx` — admin UI for editing social links
- `components/public/PublicCardPage.tsx` — public-facing card render
- `prisma/schema.prisma` — DB schema
- `app/api/cards/` — REST API for cards CRUD
- `app/c/[slug]/page.tsx` — public card page route

## Database Schema (key points)
- `SocialLink.platform` is a plain `String` — NOT an enum. Adding new platforms requires **zero DB migrations**.
- `SocialLink` has: `id`, `platform`, `url`, `label`, `order`, `cardId`
- Existing live data is never affected by adding new platform options.

## Adding New Social Platforms (safe, no migration needed)
All platform metadata lives in `lib/platformIcons.tsx`. To add a new platform:
1. Add gradient string to `PLATFORM_COLORS`
2. Add SVG string to `PLATFORM_ICON_SVG`
3. Add `{ value, label }` entry to the `PLATFORMS` array

That's it — the editor dropdown and public card render pick it up automatically.

## Deployment
- Production runs via `node server.js` (custom Express wrapper around Next.js)
- Database migrations: `prisma migrate deploy` (never `migrate dev` in prod)
- Image uploads go to Supabase Storage, not local disk

## Do Not
- Never run `prisma migrate dev` in production — use `prisma migrate deploy`
- Never delete or rename existing `SocialLink.platform` values — live cards reference them by string
- Never remove platforms from `PLATFORMS` array without checking if any live cards use them
