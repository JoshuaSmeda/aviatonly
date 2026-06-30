# AVIATONLY

South African aviation marketplace — single Next.js application.

## Structure

```text
src/app/
  page.tsx           Root redirect → /dashboard
  buy/               Legacy URL redirects → /dashboard/buy
  (dashboard)/       Authenticated app shell
    dashboard/       Main UI at /dashboard/*
    auth/            Auth pages at /auth/*
  api/               API routes
src/components/      Shared UI (dashboard + marketplace components)
src/components/dashboard/  Dashboard feature components
prisma/              Database schema
```

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database (requires PostgreSQL running):

```bash
npm run db:push
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to the dashboard (login required).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:studio` | Open Prisma Studio |

## Notes

- Product requirements and domain rules: `.cursor/rules/aviatonly.mdc` (auto-applied)
- Agent/repo guide: `AGENTS.md` at repo root (Cursor reads this automatically)
- Dashboard UI prompts: `prompts/` (copy into chat or reference by path)
- shadcn agent skill: `.agents/skills/shadcn/`
- Legacy dashboard docs: `docs/dashboard-template/` (deprecated paths)
