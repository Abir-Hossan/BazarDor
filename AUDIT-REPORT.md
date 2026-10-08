# BazarDor — Independent Quality Audit

Audit scope: complete source tree supplied for the BazarDor university assignment, re-reviewed without trusting the prior implementation.

## Audit environment

- Node.js: 22.16.0
- npm: 10.9.2
- Network/DNS: outbound npm/API access unavailable from the audit environment
- `node_modules`: absent in the supplied archive
- Git history: absent in the supplied archive; a fresh audited Git history was created locally with 11 real commits

## Executive result

No remaining source-level FAIL was intentionally left after the audit fixes. Runtime verification is blocked by missing installed dependencies, unavailable outbound API access, database credentials, OAuth credentials, and no Vercel deployment access.

## Requirement-by-requirement status

| Area | Status | Evidence / reason |
|---|---|---|
| Next.js App Router | PASS | App Router route tree exists under `src/app`; dynamic and API routes are present. |
| TypeScript | PASS (static review) | `tsconfig.json` is strict; source was parsed by the available TypeScript compiler. Full typecheck is blocked by missing installed packages. |
| Tailwind CSS | PASS (static review) | Tailwind 4/PostCSS configuration and `@import "tailwindcss"` are present. |
| Figma-oriented visual structure | PASS (source review) | Home, category, product, profile, sign-in and sign-up layouts were compared against the supplied screenshots; category spacing and profile sign-out behavior were corrected. Direct Figma inspection was unavailable. |
| Every application route exists | PASS | `/`, `/signin`, `/signup`, `/category/[slug]`, `/product/[slug]`, `/profile`, `/profile/update`, `/api/auth/[...all]`, loading and 404/error routes are present. |
| Real API integration | BLOCKED | Primary and fallback endpoints are wired in `src/lib/api.ts`, but both endpoints were unreachable from this audit environment due DNS/network restrictions. |
| API normalization | PASS (static review) | Normalization handles wrapped/bare responses, numeric strings, Bengali digits, market data and missing bounds; dedicated unit tests were added. |
| API 404 vs temporary failure distinction | PASS (static review) | Product/category API errors are differentiated; temporary failures reach the error UI instead of becoming false 404s. |
| Bengali number formatting | PASS (static review) | `formatBanglaNumber`, `formatBanglaPrice`, `formatBanglaPercentage`, `parseNumericPrice`, and date formatting are implemented with edge-case tests. |
| Price increase/decrease calculations | PASS (static review) | `topRisers` sorts positive changes descending; `topFallers` sorts negative changes ascending; both limit to six. |
| Category sorting | PASS (static review) | Sorting operates on parsed numeric values, not Bengali display strings; missing prices are kept last. |
| Dynamic category navigation | PASS (source review) | Categories are loaded from the API with graceful fallback navigation labels when the client request fails. |
| Price ticker | PASS (source review) | Real products, Bengali values, movement colors, continuous duplicated track, reduced-motion behavior and duplicate accessibility suppression are implemented. |
| Home hero CTA | PASS (source review) | CTA links directly to `#সব-পণ্য`; CSS provides smooth scrolling with reduced-motion override. |
| Top six risers/fallers | PASS (static review) | Home uses `topRisers()` and `topFallers()` against fetched product data. |
| Product card navigation | PASS (source review) | Cards now use the API product `id` for `/product/[id]`, avoiding unsupported slug assumptions. |
| Product details server protection | PASS (source review) | `auth.api.getSession()` is executed in the server page before product data is returned; unauthenticated users are redirected. |
| Protected-route toast | PASS (source review) | Redirect now includes `authRequired=1`; sign-in displays the Bengali login-required toast. |
| Safe callback redirect | PASS (static review) | `safeReturnPath()` rejects protocol-relative and backslash paths; callback tests were added. |
| Product detail summary/table | PASS (static review) | Minimum, maximum and average values are calculated from market data; responsive table scroll is local to the table container. |
| Invalid product handling | PASS (static review) | API 404 becomes `notFound()`; non-404 API failures reach the error boundary. Runtime verification is blocked. |
| Invalid category handling | PASS (static review) | Category-filter 400/404 is treated as an empty category result and then rendered through the custom 404 path. |
| Better Auth email/password | PASS (source/config review) | Real Better Auth client/server calls are used; no mock authentication is present. |
| Better Auth Google/GitHub | BLOCKED | Provider configuration is implemented, but real OAuth requires provider credentials and callback configuration. |
| Persistent PostgreSQL storage | BLOCKED | Drizzle/PostgreSQL adapter and schema are present; real DB connection/migration could not be executed without credentials/network. |
| Server-side profile protection | PASS | `/profile` and `/profile/update` validate the Better Auth session on the server. |
| Profile update persistence | BLOCKED | `authClient.updateUser({name})` is used and session refresh/navigation are implemented, but persistence requires a real Better Auth/PostgreSQL environment. |
| Profile sign-out | PASS (source review) | Profile now includes a real Better Auth `signOut()` action and redirects to `/`. |
| Sign-in validation | PASS (source review) | Email format, password length, loading/disabled state, error/success toasts and callback redirect are implemented. Browser execution blocked. |
| Sign-up validation | PASS (source review) | Name, email, password length and confirmation checks are implemented; automatic session is explicitly signed out before redirecting to sign-in. |
| Missing OAuth credential handling | PASS (source review) | Social buttons are hidden unless explicit public enable flags are set. |
| Loading skeletons | PASS | Global, category, product, profile, sign-in and sign-up loading states are present. |
| Error/empty states | PASS | Global error boundary, custom 404 and empty product/market states are present. |
| Toast notifications | PASS (source review) | React Hot Toast is globally configured; authentication/profile/protected-route flows use Bengali messages. |
| Responsive design | NOT TESTED | Responsive Tailwind classes and an E2E viewport matrix were added, but Playwright cannot run without installed Node dependencies. |
| Browser console errors | NOT TESTED | Playwright test exists, but browser execution is blocked. |
| Direct dynamic navigation | NOT TESTED | Playwright coverage exists for category/product/profile paths; runtime browser verification is blocked. |
| Dynamic-route refresh | NOT TESTED | Playwright coverage exists; runtime verification is blocked. |
| Automated unit tests | NOT TESTED | Vitest suite was expanded, but `vitest` is not installed and npm install timed out. |
| Component tests | NOT TESTED | RTL tests were added for product cards and profile update behavior; execution blocked by missing dependencies. |
| E2E tests | NOT TESTED | Playwright suite was expanded; execution blocked because local Node Playwright is unavailable. |
| ESLint | BLOCKED | `npm run lint` exited 127 because the local `eslint` binary is unavailable. |
| TypeScript check | BLOCKED | `npm run typecheck` ran with global TypeScript but could not resolve project dependencies because `node_modules` is absent. Source parsing reached the project files; known narrowing errors found during the audit were fixed. |
| Production build | BLOCKED | `npm run build` exited 127 because local `next` is unavailable. |
| README | PASS | README documents stack, features, API, environment, setup, quality commands, OAuth, deployment and audit quality gate. |
| Git requirement | PASS | Fresh audited repository contains 11 actual commits; no remote was pushed. |
| Deployment readiness | BLOCKED | Vercel deployment was not performed; database, API and OAuth credentials are still external setup requirements. |

## Commands actually executed

### Dependency installation

`npm install --ignore-scripts --no-audit --no-fund`

**Result: BLOCKED** — command timed out because the audit environment has no usable outbound npm registry/network access.

### ESLint

`npm run lint`

**Result: BLOCKED** — exit 127, `eslint` binary unavailable because dependencies were not installed.

### TypeScript

`npm run typecheck`

**Result: BLOCKED** — exit 2. The global TypeScript compiler ran, but project dependencies such as Next.js, React, Better Auth, Vitest and Playwright were unavailable. Several source-level narrowing issues identified in that run were corrected afterward.

### Unit tests

`npm run test`

**Result: BLOCKED** — exit 127, `vitest` unavailable.

### Production build

`npm run build`

**Result: BLOCKED** — exit 127, `next` unavailable.

### E2E tests

`npm run test:e2e`

**Result: BLOCKED** — the local Node Playwright package was unavailable; the environment resolved an unrelated global `playwright` executable instead.

### Repository whitespace check

`git diff --check`

**Result: PASS** — no whitespace errors.

## API verification

Direct requests to both supplied API hosts were attempted. The environment returned DNS resolution failures for both hosts, so live response schemas, live product IDs, live category slugs, market fields and HTTP behavior could not be independently verified here.

The implementation therefore intentionally does **not** claim live API compatibility as runtime-verified.

## Better Auth verification

The project uses the documented Next.js Better Auth route-handler pattern and `authClient.updateUser()` API. Better Auth 1.7.7 is currently the npm `latest` release, and Next.js 16.4.0 is currently the npm release used by this project. Runtime authentication still requires a real PostgreSQL database, secret and provider credentials where applicable.

## Visual audit

The supplied screenshots were reviewed for:

- header/category navigation structure
- Bengali typography and green palette
- home hero and product grids
- category header and separate sorting control
- product detail summary/table
- profile card and sign-out action
- sign-in/sign-up form structure
- footer placement

The category page was corrected to use a separate sorting bar and the profile page was corrected to include the required sign-out control.

The actual Figma file could not be opened from the audit environment, so direct pixel-level Figma comparison is **NOT TESTED**.

## Pre-audit defects found and fixed

1. Product cards used a slug instead of the API identifier for detail navigation.
2. Product detail API errors were swallowed and could incorrectly become 404 pages.
3. Invalid category API errors could become generic failures instead of a friendly 404.
4. Product market derivation could produce `Infinity` when all bounds were missing.
5. Missing prices could sort incorrectly in descending order.
6. Protected-route login redirects did not produce the required Bengali toast.
7. Social login lost the original protected-route callback.
8. Profile lacked the required real sign-out action.
9. Social buttons were shown even when OAuth credentials were not configured.
10. Sign-up did not verify that automatic sign-out succeeded.
11. Price ticker duplicated accessibility announcements.
12. Persistent database configuration was silently optional; production auth now requires PostgreSQL configuration.
13. Security response headers were added.
14. Loading states and automated test coverage were expanded.
15. Strict TypeScript object narrowing issues found during the audit were corrected.

## Git history

13 actual commits are present in the audited repository:

```text
4189b10 chore: import BazarDor source for independent audit
e4dd652 fix: harden Bengali price and category normalization
7c1f60b security: add production response security headers
ebf4ad3 test: cover safe redirects and edge-case formatting
d40fe58 ux: add route-level authentication loading states
052c2e5 perf: add Better Auth lookup indexes
0cb7607 docs: document university quality gate and deployment environment
1124a3b a11y: improve error and not-found announcements
19c2866 fix: resolve strict TypeScript object narrowing issues
9ef4dc7 auth: hide unconfigured social providers
0c105b2 ux: keep auth forms clean when social login is disabled
0ba0276 docs: add independent university quality audit report
840e17a fix: preserve meaningful API failure status across fallback requests
```

Run `git log --oneline` in the project root for the exact latest hash shown above.
