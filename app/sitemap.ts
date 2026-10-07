import type { MetadataRoute } from "next";
import { listContent } from "@/services/content";
import { siteUrl } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base = siteUrl(); const [pages, ...groups] = await Promise.all([listContent("pages", true), ...(["services", "solutions", "portfolio", "blog"] as const).map(r => listContent(r, true))]); return [{ url: base, lastModified: new Date(), priority: 1 }, ...pages.map(p => ({ url: `${base}/${p.slug}`, lastModified: p.updatedAt, priority: .7 })), ...groups.flatMap((items, i) => items.map(p => ({ url: `${base}/${["services", "solutions", "portfolio", "blog"][i]}/${p.slug}`, lastModified: p.updatedAt, priority: .6 })))]; }
