# NAM UAE — NFC Admin Panel

A full-stack admin panel for NAM UAE's NFC digital business card service. Staff can create, manage, and publish NFC card landing pages for any client. Each card gets a unique public URL (`/c/{slug}`) that renders a pixel-perfect NAM-branded digital business card.

## Stack

- **Framework**: Next.js 16 (App Router + TypeScript)
- **Styling**: Tailwind CSS v4 with NAM design tokens
- **Database**: PostgreSQL via Supabase — Prisma 5 ORM
- **Auth**: NextAuth v4 (Credentials, JWT strategy)
- **Images**: Cloudinary (avatar, cover, logo uploads)
- **Deploy**: Vercel

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
# Supabase → Project Settings → Database → URI mode
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"

# Generate: openssl rand -base64 32
AUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary → Console
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Push schema to Supabase
npm run db:push

# Seed with 2 companies, 3 cards, 2 users
npm run db:seed
```

### 4. Run Locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Default Login Credentials (from seed)

| Role         | Email                  | Password     |
|---|---|---|
| Super Admin  | admin@namuae.com       | admin1234    |
| Editor       | editor@namuae.com      | editor1234   |

> **Change these immediately in production.**

---

## Onboarding a New Client

1. **Create a Company** → Sidebar: Companies → New Company  
   Fill in: name, industry, website, logo URL.

2. **Create a Card** → Sidebar: Dashboard → New Card  
   - Set a unique slug (e.g. `ahmed-ali`). This becomes the public URL: `/c/ahmed-ali`  
   - Assign to the client's company  
   - Fill in all profile fields (Profile tab)  
   - Upload avatar, cover photo, company logo (Media tab)  
   - Pick theme colours (Theme tab) — or use a preset  
   - Add social links and drag to reorder (Social Links tab)  

3. **Check Live Preview** — the right panel updates in real time as you type.

4. **Publish** — click the **Publish** button in the editor toolbar.  
   The card is now live at `https://nfc.namuae.com/c/{slug}`.

5. **Program the NFC card** — set the NFC chip URL to the public card URL and hand it to the client.

---

## Role Permissions

| Action                | Super Admin | Editor |
|---|---|---|
| Create / edit cards   | ✅          | ✅     |
| Publish cards         | ✅          | ✅     |
| Delete cards          | ✅          | ❌     |
| Create companies      | ✅          | ✅     |
| Delete companies      | ✅          | ❌     |

---

## Project Structure

```
admin/
├── app/
│   ├── (admin)/            # Auth-gated admin routes
│   │   ├── dashboard/      # Cards list + KPI strip
│   │   ├── cards/new/      # Create card
│   │   ├── cards/[id]/edit # Card editor + live preview
│   │   └── companies/      # Company manager
│   ├── api/                # REST API routes
│   │   ├── auth/[...nextauth]/
│   │   ├── cards/
│   │   ├── companies/
│   │   └── upload/
│   ├── c/[slug]/           # Public NFC card page
│   └── login/
├── components/
│   ├── admin/AdminShell    # Sidebar nav shell
│   ├── card-editor/        # Editor sub-components
│   └── public/             # Public card template
├── lib/                    # Prisma, auth, cloudinary helpers
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── proxy.ts                # Next.js 16 route protection
```

---

## Deployment (Vercel)

1. Push `admin/` to GitHub
2. Import in Vercel — set root directory to `admin`
3. Add all env vars from `.env.example` in Vercel project settings
4. Deploy — Vercel auto-runs `next build`

After deploy, run migrations once from your local machine against the production DB:
```bash
DATABASE_URL="<production-url>" npm run db:push
DATABASE_URL="<production-url>" npm run db:seed
```
