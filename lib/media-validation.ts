import { db } from "@/lib/db";
import { HttpError } from "@/lib/auth";
export async function validateManagedImages(urls: string[]) {
    for (const url of [...new Set(urls.filter(Boolean))]) {
        if (url === "/icon.svg")
            continue;
        if (!url.startsWith("/media/"))
            throw new HttpError(422, "Upload images to Media library and use their /media/ URL.");
        const filename = url.slice(7);
        const media = await db.media.findUnique({ where: { filename } });
        if (!media)
            throw new HttpError(422, "This image is not in the Media library. Upload it first.");
    }
}
