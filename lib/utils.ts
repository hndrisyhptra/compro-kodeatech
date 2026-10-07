export function slugify(s: string) { return s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function safeUrl(s: string) { return s.startsWith("/") && !s.startsWith("//") ? s : /^https?:\/\//i.test(s) ? s : "#"; }
export function obj(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
export function stringValue(value: unknown, fallback = "") { return typeof value === "string" ? value : fallback; }
export function arrayValue(value: unknown): string[] { return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []; }
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
export function siteUrl() { return (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""); }
