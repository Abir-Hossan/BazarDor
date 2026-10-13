# BazarDor — বাজার দর

**A Bangla-first essential commodity price tracking platform for Bangladesh.**

BazarDor helps users explore daily commodity prices, compare market-level rates, and understand price movements through a responsive, data-driven web application.

**Live Website:** https://bazar-dor-chi-gold.vercel.app  
**GitHub Repository:** https://github.com/Abir-Hossan/BazarDor  
**Figma Design:** https://www.figma.com/design/j3wr1ebfYHSGpZhhxEKQ4n/Bazardor-_-Assignment-07

---

## Overview

BazarDor is a full-stack web application built with Next.js, TypeScript, Tailwind CSS, Better Auth, Drizzle ORM, and PostgreSQL.

The application integrates external commodity-price APIs with authentication, protected user pages, market comparisons, and a Bengali-language user experience.

The project emphasizes maintainable code, responsive design, resilient API integration, and clear presentation of price information.

## Key Features

- **Product Discovery:** Browse essential commodities and their current prices.
- **Category Filtering:** Explore products by commodity category.
- **Price Movement Tracking:** Identify products with rising or falling prices.
- **Market Comparison:** Compare minimum, maximum, and average prices across markets when the source data supports them.
- **Product Details:** View product information, price summaries, and market-level comparisons.
- **Authentication:** Register and sign in using email/password.
- **Social Authentication:** Optional Google and GitHub sign-in.
- **Protected Profiles:** Access profile and profile-update pages.
- **API Resilience:** Primary and fallback API endpoints.
- **Bangla Localization:** Bengali text, numbers, and percentage formatting.
- **Responsive UI:** Layouts for desktop, tablet, and mobile devices.
- **User Feedback:** Loading, empty, error, and not-found states.
- **Accessibility Considerations:** Reduced-motion support for the scrolling price ticker.

> Email verification and password reset are intentionally disabled in the current project configuration.

## Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 App Router |
| Frontend | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | Better Auth 1.7.7 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Notifications | React Hot Toast |
| Testing | Vitest, React Testing Library, Playwright |
| Deployment | Vercel |

## Architecture

The application separates routing, reusable components, API integration, authentication, and data modeling.

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── bazardor/
│   ├── category/[slug]/
│   ├── product/[slug]/
│   ├── profile/
│   ├── signin/
│   └── signup/
├── components/
│   └── products/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── auth-client.ts
│   └── database.ts
└── types/
```

*This is a high-level overview; the exact structure may differ slightly from the current repository.*

### Engineering Highlights

- Shared TypeScript types for application data.
- Centralized API request and response normalization.
- Reusable product and market-price components.
- Server-side session checks for protected routes.
- Environment-based configuration for authentication and API endpoints.
- Fallback handling for unavailable API endpoints and missing data.

## API Integration

BazarDor consumes external APIs to retrieve commodity and category information.

**Primary API**

`https://api.api-store.workers.dev/api/bazardor`

**Fallback API**

`https://api.abcz.workers.dev/api/bazardor`

### Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products` | Retrieve products |
| GET | `/products?category=:slug` | Filter products by category |
| GET | `/products/:id` | Retrieve product details |
| GET | `/categories` | Retrieve categories |

The API client normalizes response fields into consistent application models.

**Data integrity:** When an API does not provide an actual market average, the application should distinguish missing data from a reported value. A midpoint calculated from minimum and maximum prices is only an estimate, not an official market average.

## Getting Started

### Prerequisites

- Node.js compatible with the installed Next.js version
- npm
- PostgreSQL database
- Google/GitHub OAuth credentials if social authentication is enabled

### 1. Clone the repository

```bash
git clone https://github.com/Abir-Hossan/BazarDor.git
cd BazarDor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```dotenv
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false

# Optional: GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NEXT_PUBLIC_GITHUB_AUTH_ENABLED=false

# Optional: API endpoint overrides
BAZARDOR_API_URL=
BAZARDOR_API_FALLBACK_URL=
```

Use `.env.example` as a reference if it exists in the repository.

**Environment variable guidance**

- `DATABASE_URL`: PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: Secure, high-entropy secret of at least 32 characters.
- `BETTER_AUTH_URL`: Base URL configured for the current environment.
- `NEXT_PUBLIC_APP_URL`: Public application URL; never place secrets in it.
- OAuth variables: Required only for the corresponding provider.
- API override variables: Optional custom primary and fallback endpoints.

Never commit `.env.local`, database credentials, OAuth secrets, or production secrets.

### 4. Prepare the database

Use the repository's Drizzle configuration and checked-in schema.

If the project requires schema generation and migrations, run the available scripts:

```bash
npm run auth:generate
npm run db:generate
npm run db:migrate
```

Review generated migrations before applying them to a production database.

### 5. Start the development server

```bash
npm run dev
```

Open http://localhost:3000.

## Authentication Configuration

### Local OAuth Callback URLs

**Google**

`http://localhost:3000/api/auth/callback/google`

**GitHub**

`http://localhost:3000/api/auth/callback/github`

### Production OAuth Callback URLs

For the configured production domain:

- `https://bazar-dor-chi-gold.vercel.app/api/auth/callback/google`
- `https://bazar-dor-chi-gold.vercel.app/api/auth/callback/github`

Register the appropriate callback URLs in the Google Cloud Console and GitHub OAuth App settings.

Preview deployments use different hostnames. Configure Better Auth trusted origins and OAuth callbacks deliberately for any preview environment that requires authentication. Keep origin validation enabled.

## Quality Assurance

Run the checks configured in the repository before merging or deploying:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
```

Confirm that each script exists in `package.json`.

A successful build verifies compilation and configured build-time checks. It does not independently prove that external APIs, database connections, OAuth callbacks, or production authentication are functioning correctly.

## Deployment on Vercel

1. Import the GitHub repository into Vercel.
2. Configure environment variables for Production and Preview as needed.
3. Connect a reachable PostgreSQL database.
4. Verify `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` for each environment.
5. Configure OAuth credentials and callback URLs.
6. Configure Better Auth trusted origins for the domains you intend to support.
7. Apply required database migrations.
8. Deploy and wait for the deployment to become Ready.
9. Test product browsing, category filtering, product details, email authentication, social login, and protected profile pages.

**Important:** Preview and Production deployments may use different domains and environment variables. Test both environments separately if both need authentication.

## Security and Reliability

- Store sensitive values in environment variables or the deployment provider's secret store.
- Never expose database passwords, authentication secrets, or OAuth client secrets.
- Keep authentication origin validation enabled.
- Validate and normalize external API data.
- Handle missing or unavailable price fields explicitly.
- Verify integrations in the actual deployment environment before considering them production-ready.

## Project Links

- **Live Website:** https://bazar-dor-chi-gold.vercel.app
- **GitHub:** https://github.com/Abir-Hossan/BazarDor
- **Figma:** https://www.figma.com/design/j3wr1ebfYHSGpZhhxEKQ4n/Bazardor-_-Assignment-07

---

*Built with Next.js, TypeScript, Tailwind CSS, Better Auth, Drizzle ORM, and PostgreSQL.*
