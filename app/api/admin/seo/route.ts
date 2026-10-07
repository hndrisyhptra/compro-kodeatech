import { validateManagedImages } from "@/lib/media-validation";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizeWrite } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { seoSchema } from "@/lib/validation";
export async function POST(request: Request) {
    try {
        await authorizeWrite(request);
        const value = seoSchema.parse(await readJson(request));
        await validateManagedImages([value.ogImage]);
        await db.seoMetadata.upsert({ where: { path: value.path }, update: value, create: value });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
