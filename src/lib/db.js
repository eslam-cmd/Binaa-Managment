import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : false,
});
