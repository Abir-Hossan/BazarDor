import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./auth-schema";

const connectionString = process.env.DATABASE_URL;
export const db = connectionString ? drizzle(postgres(connectionString), { schema }) : null;
