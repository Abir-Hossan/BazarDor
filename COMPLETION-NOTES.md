# BazarDor handoff notes

## Assignment alignment
- Responsive Next.js App Router application with Bengali UI.
- Home, category, product detail, sign-in, sign-up, profile, and profile-update routes.
- Product/category API integration with primary and fallback endpoints.
- Better Auth email/password and optional Google/GitHub providers.
- Product loading states, sorting, toasts, and custom not-found route.

## Changes in this handoff
- Disabled email verification to match the assignment's explicit requirement not to implement email verification or password reset.
- Removed the sign-up verification/resend UI; successful sign-up now directs the user to sign in.
- Removed eager Resend initialization from the auth setup, so email credentials are not needed for the required assignment flows.
- Updated `.env.example` and README setup notes.
- Excluded `.env.local` and `.git` from this shareable ZIP. Configure your own environment locally; do not share real credentials.

## Verification status
A fresh dependency install was attempted with `npm ci`, but it timed out in this environment. Therefore lint, typecheck, unit tests, production build, live API behavior, database-backed auth, OAuth, and deployment have not been newly verified in this handoff. Run the commands in README on a machine with npm registry access before submission.
