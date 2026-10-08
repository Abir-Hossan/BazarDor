import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./database";
import * as schema from "./auth-schema";

const secret = process.env.BETTER_AUTH_SECRET;
const databaseUrl = process.env.DATABASE_URL;
const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be set and contain at least 32 characters.");
}
if (!baseURL) {
  throw new Error("BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL must be configured.");
}
if (!databaseUrl || !db) {
  throw new Error("DATABASE_URL must be configured for persistent Better Auth storage.");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  secret,
  baseURL,
  emailAndPassword: { enabled: true },
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
      [process.env.NEXT_PUBLIC_APP_URL, process.env.BETTER_AUTH_URL].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ),
});
