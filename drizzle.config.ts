import { defineConfig } from "drizzle-kit";
import configData from "./config/appConfig";
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: {
    user: configData.db.dbUser,
    password: configData.db.dbPassword,
    host: configData.db.dbHost,
    port: configData.db.dbPort,
    database: configData.db.dbName,
    ssl: {
        rejectUnauthorized: true,
        ca: configData.db.dbCa
    },
  },
});