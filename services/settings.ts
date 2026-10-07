import { cache } from "react";
import { db } from "@/lib/db";
import type { SiteSettings } from "@/types/content";
export const getSettings = cache(async (): Promise<SiteSettings> => {
    const row = await db.setting.findUnique({ where: { key: "general" } });
    if (!row)
        throw new Error("Database is not initialized. Run the migrations and seed.");
    return row.value as unknown as SiteSettings;
});
