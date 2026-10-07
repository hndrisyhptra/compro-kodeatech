import { validateManagedImages } from "@/lib/media-validation";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizeWrite } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { settingsSchema } from "@/lib/validation";
export async function POST(request: Request) {
    try {
        await authorizeWrite(request, true);
        const value = settingsSchema.parse(await readJson(request));
        await validateManagedImages([value.logo, value.favicon, value.ogImage, value.heroImage, value.aboutImage]);
        await db.setting.upsert({ where: { key: "general" }, update: { value }, create: { key: "general", value } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
