import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";
import * as schema from "./auth-schema";

const secret = process.env.BETTER_AUTH_SECRET;
const databaseUrl = process.env.DATABASE_URL;
const authURL = process.env.BETTER_AUTH_URL?.replace(/\/+$/, "");
const appURL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");
const baseURL = authURL ?? appURL;

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be set and contain at least 32 characters.");
}
if (!baseURL) {
  throw new Error("BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL must be configured.");
}
if (!databaseUrl || !db) {
  throw new Error("DATABASE_URL must be configured for persistent Better Auth storage.");
}
console.log("[BazarDor] Auth configuration loaded");

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret,
  baseURL,
  
  // Assignment requirements explicitly omit email verification and password reset.
  // This keeps email/password registration usable without a mail-provider key.
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  
trustedOrigins: Array.from(
  new Set(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",

      // Production
      "https://bazar-dor-chi-gold.vercel.app",

      // Preview deployments
      "https://bazar-qxpuqoot1-abir-hossan.vercel.app",
      "https://bazar-dor-git-main-abir-hossan.vercel.app",

      process.env.NEXT_PUBLIC_APP_URL
        ? new URL(process.env.NEXT_PUBLIC_APP_URL).origin
        : undefined,
      process.env.BETTER_AUTH_URL
        ? new URL(process.env.BETTER_AUTH_URL).origin
        : undefined,
    ].filter((value): value is string => Boolean(value)),
  ),
),

});
