
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.ts";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const connection = new URL(databaseUrl);

const database = decodeURIComponent(
  connection.pathname.replace(/^\/+/, "")
);

if (!database) {
  throw new Error("DATABASE_URL must include a database name.");
}

const caCertificate = process.env.DATABASE_CA_CERT;

const adapter = new PrismaMariaDb({
  host: connection.hostname,
  port: Number(connection.port || 3306),
  user: decodeURIComponent(connection.username),
  password: decodeURIComponent(connection.password),
  database,
  connectionLimit: 5,
  ...(caCertificate
    ? { ssl: { ca: caCertificate } }
    : process.env.NODE_ENV === "production"
      ? { ssl: true }
      : {}),
});

export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["warn", "error"]
      : ["error"],
});
