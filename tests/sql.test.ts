import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const migration = readFileSync("database/migrations/20261005000000_initial/migration.sql", "utf8");
const install = readFileSync("database/phpmyadmin-install.sql", "utf8");
test("phpMyAdmin SQL uses the exact migration and records its baseline checksum", () => {
    assert.ok(install.includes(migration));
    assert.ok(install.includes(createHash("sha256").update(migration).digest("hex")));
    assert.ok(!/TEXT NOT NULL DEFAULT/i.test(migration), "MySQL TEXT defaults must not be emitted as string literals");
});
test("every SQL seed insert uses real columns from the migration", () => {
    const tables = new Map<string, Set<string>>();
    for (const match of migration.matchAll(/CREATE TABLE `([^`]+)` \(([\s\S]*?)\) DEFAULT/g)) {
        tables.set(match[1], new Set([...match[2].matchAll(/^\s+`([^`]+)`\s/gm)].map(m => m[1])));
    }
    let count = 0;
    for (const match of install.matchAll(/INSERT INTO `([^`]+)` \(([^)]+)\) VALUES/g)) {
        if (match[1] === "_prisma_migrations")
            continue;
        assert.ok(tables.has(match[1]), `Unknown table ${match[1]}`);
        for (const column of match[2].matchAll(/`([^`]+)`/g))
            assert.ok(tables.get(match[1])?.has(column[1]), `Unknown column ${match[1]}.${column[1]}`);
        count++;
    }
    assert.ok(count >= 60);
});
test("seed contains a bcrypt admin and relational blog taxonomy", () => {
    assert.match(install, /\$2[ab]\$12\$/);
    assert.match(install, /INSERT INTO `blog_categories`/);
    assert.match(install, /INSERT INTO `blog_tags`/);
    assert.match(install, /INSERT INTO `_PostTags`/);
    for (const name of ["services", "solutions", "portfolio", "pages", "technologies"])
        assert.ok(install.includes(`INSERT INTO \`${name}\``));
});
