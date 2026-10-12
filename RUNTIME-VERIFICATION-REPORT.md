# BazarDor Runtime Verification Report

Date: 2026-10-12
Scope: Existing audited source; no rebuild from scratch.

## Summary

**Overall status: BLOCKED — not submission-ready until external environment checks pass.**

This report records only commands actually attempted in this environment. It does not claim a successful runtime test where one did not run.

## Environment

```text
node -v: v22.16.0
npm -v: 10.9.2
node_modules: missing
PostgreSQL client (psql): command not found
pg_isready: command not found
```

## Commands and actual outcomes

| Check | Command | Result | Evidence |
|---|---|---|---|
| Dependency install | `npm ci --no-audit --no-fund` | BLOCKED | Command timed out after 120 seconds; no `node_modules` created. |
| Primary API products | `curl ... https://api.api-store.workers.dev/api/bazardor/products` | BLOCKED | `curl: (6) Could not resolve host: api.api-store.workers.dev`; HTTP status 000. |
| Fallback API products | `curl ... https://api.abcz.workers.dev/api/bazardor/products` | BLOCKED | `curl: (6) Could not resolve host: api.abcz.workers.dev`; HTTP status 000. |
| Main API products | `curl ... https://openapi.programming-hero.com/api/bazardor/products` | BLOCKED | `curl: (6) Could not resolve host: openapi.programming-hero.com`; HTTP status 000. |
| ESLint | `npm run lint` | BLOCKED | `sh: 1: eslint: not found` (exit 127). |
| TypeScript | `npm run typecheck` | BLOCKED | Exit 2; dependencies/types missing, including `@playwright/test`, `better-auth/next-js`, `next/server`, and `react/jsx-runtime`. |
| Unit/component tests | `npm run test` | BLOCKED | `sh: 1: vitest: not found` (exit 127). |
| Playwright E2E | `npm run test:e2e` | BLOCKED | Global Playwright executable is unrelated/incompatible: `error: unknown command 'test'` (exit 1); local `@playwright/test` is not installed. |
| Production build | `npm run build` | BLOCKED | `sh: 1: next: not found` (exit 127). |
| Drizzle migration generation | `npm run db:generate` | BLOCKED | `sh: 1: drizzle-kit: not found` (exit 127). |
| PostgreSQL connectivity/migrations | `psql --version`, `pg_isready` | BLOCKED | Both commands unavailable; no configured database credentials were supplied in this execution environment. |
| Better Auth registration/login | Browser/API flow | BLOCKED | Requires installed dependencies and a reachable configured PostgreSQL database. |
| Protected product route | Browser E2E | BLOCKED | Requires running app and browser dependencies. |
| Profile update persistence | Database-backed test | BLOCKED | Requires configured PostgreSQL and working auth runtime. |
| Google/GitHub OAuth | Provider callback test | BLOCKED | Requires real `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and registered callback URLs. These were not supplied. |
| Responsive viewports | Playwright viewport matrix | BLOCKED | Browser tests cannot execute without local Playwright dependencies. |
| Figma pixel comparison | Direct design comparison | BLOCKED | Source screenshots are available, but a rendered local build and pixel comparison could not be produced. |
| Vercel deployment/refresh | Deployed route test | BLOCKED | No Vercel project/deployment credentials or production URL were supplied. |

## Source-level change made in this pass

- Separated product image URLs from emoji selection in `src/lib/api.ts`; URL strings are no longer used as emoji values.
- Preserved absent price-change values as `null` instead of fabricating a `0%` change.
- Added regression tests for image/emoji separation and unknown change values in `src/tests/api.test.ts`.

These changes are **not runtime-verified** because Vitest and project dependencies could not be installed.

## Exact configuration needed to unblock remaining checks

1. **Network/package registry:** allow DNS and outbound HTTPS to `registry.npmjs.org` so `npm ci` can complete.
2. **API hosts:** allow outbound HTTPS/DNS to `api.api-store.workers.dev`, `api.abcz.workers.dev`, and optionally `openapi.programming-hero.com`.
3. **PostgreSQL:** a reachable PostgreSQL instance and a private `DATABASE_URL`; then run the project's migration workflow and verify tables exist.
4. **Better Auth:** `BETTER_AUTH_SECRET` (32+ characters), `BETTER_AUTH_URL`, and `NEXT_PUBLIC_APP_URL` matching the local/deployed origin.
5. **OAuth:** optional Google/GitHub client ID/secret pairs and matching provider callback URLs for the chosen Better Auth configuration. OAuth cannot be certified without real provider-owned credentials.
6. **Vercel:** project access or deployment permissions, plus production environment variables and a production URL.

## Required rerun sequence after unblocking

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npx playwright install --with-deps chromium
npm run test:e2e
npm run db:generate
npm run db:migrate
npm run build
npm run start
```

Then test real sign-up/sign-in/sign-out, protected route redirects, profile update persistence, both OAuth providers if configured, product/category data, unknown routes, and page refreshes at desktop/tablet/mobile widths. A successful build alone is not proof that external integration tests pass.
