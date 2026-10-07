import { randomUUID, createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import type { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../database/seed";
type Row = Record<string, unknown>;
const records = new Map<string, Row[]>();
const tables: Record<string, string> = { postTags: "_PostTags", blogCategory: "blog_categories", blogTag: "blog_tags", role: "roles", user: "users", setting: "settings", service: "services", solution: "solutions", technology: "technologies", portfolio: "portfolio", blogPost: "blog_posts", partner: "partners", testimonial: "testimonials", teamMember: "team_members", page: "pages", seoMetadata: "seo_metadata" };
const fake = new Proxy({}, { get(_target, model: string) {
        return { async upsert(args: {
                create: Row;
            }) {
                const row = { id: randomUUID().replace(/-/g, ""), ...args.create };
                if (["service", "solution", "technology", "portfolio", "blogPost", "partner", "testimonial", "teamMember", "page"].includes(model))
                    Object.assign(row, { createdAt: new Date(), updatedAt: new Date() });
                if (model === "user")
                    Object.assign(row, { createdAt: new Date() });
                if (model === "setting") {
                    delete (row as Row).id;
                    Object.assign(row, { updatedAt: new Date() });
                }
                const list = records.get(model) || [];
                list.push(row);
                records.set(model, list);
                return row;
            }, async update(args: {
                where: {
                    id: string;
                };
                data: {
                    tags?: {
                        connect: {
                            id: string;
                        };
                    };
                };
            }) {
                if (model === "blogPost" && args.data.tags) {
                    const joins = records.get("postTags") || [];
                    joins.push({ A: args.where.id, B: args.data.tags.connect.id });
                    records.set("postTags", joins);
                }
                return records.get(model)?.find(r => r.id === args.where.id);
            }, async findUniqueOrThrow(args: {
                where: Row;
            }) { return records.get(model)?.find(row => Object.entries(args.where).every(([k, v]) => row[k] === v)); } };
    } }) as unknown as PrismaClient;
function quote(value: unknown): string {
    if (value === null || value === undefined)
        return "NULL";
    if (typeof value === "boolean")
        return value ? "1" : "0";
    if (typeof value === "number")
        return String(value);
    let text = typeof value === "object" ? (value instanceof Date ? value.toISOString().slice(0, 23).replace("T", " ") : JSON.stringify(value)) : String(value);
    text = text.replace(/\\/g, "\\\\").replace(/'/g, "''").replace(/\u0000/g, "");
    return `'${text}'`;
}
async function main() {
    await seedDatabase(fake);
    const migration = await readFile("database/migrations/20261005000000_initial/migration.sql", "utf8");
    const checksum = createHash("sha256").update(migration).digest("hex");
    let sql = `-- KODEA TECH · MySQL 8 / phpMyAdmin installation
-- Import into an EMPTY database selected in phpMyAdmin.
-- Admin email/password: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in local .env.
-- Passwords are bcrypt-hashed. Keep the local .env private.
SET NAMES utf8mb4;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

${migration}

START TRANSACTION;
`;
    for (const [model, rows] of records) {
        for (const row of rows) {
            const cols = Object.keys(row);
            sql += `INSERT INTO \`${tables[model]}\` (${cols.map(c => `\`${c}\``).join(", ")}) VALUES (${cols.map(c => quote(row[c])).join(", ")});\n`.replace(/\`/g, "`").replace(/\\n$/, "\n");
        }
    }
    sql += `COMMIT;

CREATE TABLE \`_prisma_migrations\` (id VARCHAR(36) NOT NULL PRIMARY KEY, checksum VARCHAR(64) NOT NULL, finished_at DATETIME(3) NULL, migration_name VARCHAR(255) NOT NULL, logs TEXT NULL, rolled_back_at DATETIME(3) NULL, started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), applied_steps_count INTEGER UNSIGNED NOT NULL DEFAULT 0) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
INSERT INTO \`_prisma_migrations\` (id, checksum, finished_at, migration_name, started_at, applied_steps_count) VALUES (${quote(randomUUID())}, ${quote(checksum)}, CURRENT_TIMESTAMP(3), '20261005000000_initial', CURRENT_TIMESTAMP(3), 1);
`.replace(/\`/g, "`");
    await writeFile("database/phpmyadmin-install.sql", sql);
    await writeFile("database/schema-only.sql", `-- Select an EMPTY database in phpMyAdmin before import. Run seed separately.
SET NAMES utf8mb4;
${migration}`);
    console.log("Exported schema-only.sql and phpmyadmin-install.sql. Credentials remain in .env.");
}
main().catch(e => { console.error(e); process.exitCode = 1; });
