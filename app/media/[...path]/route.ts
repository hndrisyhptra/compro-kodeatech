import { readFile } from "node:fs/promises";
import { mediaPath } from "@/lib/storage";
import { db } from "@/lib/db";
export async function GET(request: Request, ctx: {
    params: Promise<{
        path: string[];
    }>;
}) {
    try {
        const filename = (await ctx.params).path.join("/");
        const media = await db.media.findUnique({ where: { filename } });
        if (!media)
            return new Response("Not found", { status: 404 });
        const bytes = await readFile(mediaPath(filename));
        return new Response(bytes, { headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
    }
    catch {
        return new Response("Not found", { status: 404 });
    }
}
