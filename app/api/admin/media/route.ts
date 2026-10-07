import { resources } from "@/features/cms/config";
import { listContent } from "@/services/content";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { db } from "@/lib/db";
import { authorizeWrite, requireSession, HttpError } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { mediaPath } from "@/lib/storage";
import { z } from "zod";
export async function GET(request: Request) {
    try {
        await requireSession();
        const params = new URL(request.url).searchParams;
        const { search, cursor } = z.object({ search: z.string().max(200), cursor: z.string().max(100).nullable() }).parse({ search: params.get("search") || "", cursor: params.get("cursor") });
        const records = await db.media.findMany({
            where: search ? { OR: [{ title: { contains: search } }, { originalName: { contains: search } }, { alt: { contains: search } }] } : undefined,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 41,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            select: { id: true, filename: true, originalName: true, title: true, alt: true, width: true, height: true }
        });
        const items = records.slice(0, 40);
        return NextResponse.json({ items, nextCursor: records.length > 40 ? items.at(-1)?.id : null }, { headers: { "Cache-Control": "private, no-store" } });
    } catch (error) {
        return apiError(error);
    }
}
export async function POST(request: Request) {
    try {
        await authorizeWrite(request);
        if (Number(request.headers.get("content-length")) > 6 * 1024 * 1024)
            throw new HttpError(413, "Maximum image size is 5 MB.");
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File) || !file.size || file.size > 5 * 1024 * 1024)
            throw new HttpError(422, "Select an image up to 5 MB.");
        if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type))
            throw new HttpError(422, "Only JPEG, PNG, WebP and AVIF images are allowed.");
        const bytes = Buffer.from(await file.arrayBuffer());
        const metadata = await sharp(bytes, { limitInputPixels: 40000000 }).metadata();
        const allowed: Record<string, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", heif: "image/avif" };
        if (!metadata.format || allowed[metadata.format] !== file.type || metadata.format === "heif" && metadata.compression !== "av1")
            throw new HttpError(422, "Image type does not match its contents.");
        const { data, info } = await sharp(bytes).rotate().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
        const date = new Date();
        const filename = `${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${randomUUID()}.webp`;
        const target = mediaPath(filename);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, data, { mode: 0o640 });
        try {
            const media = await db.media.create({ data: { filename, originalName: file.name.slice(0, 200), mime: "image/webp", size: info.size, width: info.width, height: info.height, title: file.name.slice(0, 200), alt: "", description: "" } });
            return NextResponse.json(media, { status: 201 });
        }
        catch (e) {
            await unlink(target);
            throw e;
        }
    }
    catch (e) {
        return apiError(e);
    }
}
export async function PATCH(request: Request) {
    try {
        await authorizeWrite(request);
        const { id, ...data } = z.object({ id: z.string(), alt: z.string().max(300), title: z.string().max(200), description: z.string().max(2000) }).parse(await readJson(request));
        await db.media.update({ where: { id }, data });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
export async function DELETE(request: Request) {
    try {
        await authorizeWrite(request);
        const { id } = z.object({ id: z.string() }).parse(await readJson(request));
        const media = await db.media.findUniqueOrThrow({ where: { id } });
        const contents = await Promise.all(resources.map(r => listContent(r)));
        const [settings, seo] = await Promise.all([db.setting.findMany(), db.seoMetadata.findMany()]);
        if (JSON.stringify([contents, settings, seo]).includes(media.filename))
            throw new HttpError(409, "This image is in use. Remove it from content and settings before deleting.");
        await unlink(mediaPath(media.filename));
        await db.media.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
