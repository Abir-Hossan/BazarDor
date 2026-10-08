# BazarDor — বাজার দর

Bangladesh daily essential commodity price tracking platform built with Next.js App Router, TypeScript, Tailwind CSS and Better Auth.

## Features
- Live product/category data from the supplied BazarDor API with primary/fallback endpoints.
- Bangla UI and Bengali-number price formatting.
- Home sections for price risers, fallers and all products.
- Category pages with numeric price sorting.
- Authenticated product detail pages with market-level comparison.
- Better Auth email/password plus optional Google and GitHub OAuth.
- Protected profile and profile-update pages.
- Loading, empty, error and custom 404 states.
- Responsive desktop/tablet/mobile layout and reduced-motion ticker.

## Stack
Next.js 16, React 19, TypeScript, Tailwind CSS 4, Better Auth 1.7, Drizzle ORM, PostgreSQL, React Hot Toast, Vitest, React Testing Library and Playwright.

## API
Primary: `https://api.api-store.workers.dev/api/bazardor`
Fallback: `https://api.abcz.workers.dev/api/bazardor`

Endpoints used: `/products`, `/products?category=:slug`, `/products/:id`, `/categories` and category data derived from the API.

## Setup
1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`.
3. Add Google/GitHub credentials only when those providers are configured.
4. Install packages with `npm install`.
5. Generate Better Auth/Drizzle schema using the installed Better Auth CLI if the generated schema differs from the checked-in schema: `npm run auth:generate`.
6. Generate/apply Drizzle migrations: `npm run db:generate` then `npm run db:migrate`.
7. Run: `npm run dev`.

## Quality checks
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## OAuth callback URLs
Local:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Production uses the same path on `BETTER_AUTH_URL`.

## Vercel
Set every `.env.example` variable in the Vercel project settings. Use a production PostgreSQL database. Run migrations before first production traffic. Do not commit secrets.

## Important environment limitation
This repository was prepared in an execution environment without outbound DNS/network access to the supplied API or npm registry. Therefore external API connectivity, OAuth provider callbacks, dependency installation, and a real production deployment must be verified in the user's development/Vercel environment before being marked as passed.

## Screenshots
The supplied Figma/screenshots are the visual reference for the implemented layout.

## Links
- Figma: https://www.figma.com/design/j3wr1ebfYHSGpZhhxEKQ4n/Bazardor-_-Assignment-07
- GitHub: add the actual repository URL after publishing.
- Live site: add the actual deployment URL after deployment.

## University submission quality gate

Before submission, configure a real PostgreSQL database and Better Auth secret, then run all checks from the project root:

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

For browser E2E tests, start from a clean environment or let Playwright start the development server. Verify the supplied API endpoints are reachable from the machine running the app. OAuth tests require valid Google/GitHub provider credentials and callback URLs.

### Required production environment

- `DATABASE_URL`
- `BETTER_AUTH_SECRET` (32+ high-entropy characters)
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`
- Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Optional: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Optional API overrides: `BAZARDOR_API_URL`, `BAZARDOR_API_FALLBACK_URL`

Do not commit `.env.local`, OAuth secrets, database credentials, or production secrets.
