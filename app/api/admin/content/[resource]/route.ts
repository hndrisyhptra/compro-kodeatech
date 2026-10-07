import { validateManagedImages } from "@/lib/media-validation";
import { arrayValue, obj, stringValue } from "@/lib/utils";
import { cleanHtml } from "@/lib/html";
import { NextResponse } from "next/server";
import { isResource } from "@/features/cms/config";
import { listContent, saveContent, deleteContent } from "@/services/content";
import { authorizeWrite, requireSession, HttpError } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { contentSchema } from "@/lib/validation";
import { z } from "zod";
type Context = {
    params: Promise<{
        resource: string;
    }>;
};
export async function GET(request: Request, ctx: Context) {
    try {
        await requireSession();
        const { resource } = await ctx.params;
        if (!isResource(resource))
            throw new HttpError(404, "Unknown content type.");
        return NextResponse.json(await listContent(resource));
    }
    catch (e) {
        return apiError(e);
    }
}
export async function POST(request: Request, ctx: Context) {
    try {
        const session = await authorizeWrite(request);
        const { resource } = await ctx.params;
        if (!isResource(resource))
            throw new HttpError(404, "Unknown content type.");
        const raw = z.object({ id: z.string().optional(), record: contentSchema }).parse(await readJson(request));
        const record = { ...raw.record, content: cleanHtml(raw.record.content), publishedAt: raw.record.publishedAt ? new Date(raw.record.publishedAt) : raw.record.status === "published" ? new Date() : null };
        if (record.publishedAt && Number.isNaN(record.publishedAt.getTime()))
            throw new HttpError(422, "Invalid publication date.");
        const details = obj(record.data);
        const embedded = [...record.content.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m => m[1]);
        await validateManagedImages([record.image, record.ogImage, stringValue(details.thumbnail), ...arrayValue(details.gallery), ...embedded]);
        const result = await saveContent(resource, record, raw.id, session.userId);
        return NextResponse.json(result);
    }
    catch (e) {
        return apiError(e);
    }
}
export async function DELETE(request: Request, ctx: Context) {
    try {
        await authorizeWrite(request);
        const { resource } = await ctx.params;
        if (!isResource(resource))
            throw new HttpError(404, "Unknown content type.");
        const { id } = z.object({ id: z.string().min(1) }).parse(await readJson(request));
        await deleteContent(resource, id);
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
