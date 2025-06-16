import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables.");
}

export default defineConfig({
  out: "./migrations", // अभी drizzle mongodb में actual migrations नहीं चलते, लेकिन folder structure रखने के लिए ok
  schema: "./shared/schema.ts",
  dialect: "mongodb",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
// Note: Make sure to have the `drizzle-kit` package installed and configured properly in your project.