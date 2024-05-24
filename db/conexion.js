import dotenv from "dotenv";
import pkg from "pg";

dotenv.config({ path: "./.env.local" });

const { Pool } = pkg;
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});
