import { PrismaClient } from "@prisma/client";

const globalDb = globalThis as unknown as {
    prisma?: PrismaClient;
    databaseUrl?: string;
};
const databaseUrl = process.env.DATABASE_URL;
const isDevelopment = process.env.NODE_ENV !== "production";
const cachedClient = isDevelopment && globalDb.databaseUrl === databaseUrl
    ? globalDb.prisma
    : undefined;

export const db = cachedClient ?? new PrismaClient({ datasourceUrl: databaseUrl });

if (isDevelopment) {
    if (globalDb.prisma && globalDb.prisma !== db) {
        void globalDb.prisma.$disconnect().catch(() => undefined);
    }
    globalDb.prisma = db;
    globalDb.databaseUrl = databaseUrl;
}
