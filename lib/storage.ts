import path from "node:path";
import { unlink } from "node:fs/promises";
export function storageRoot() { return path.resolve(process.env.STORAGE_ROOT || "./storage/uploads"); }
export function mediaPath(filename: string) {
    if (!/^\d{4}\/\d{2}\/[a-f0-9-]+\.webp$/.test(filename))
        throw new Error("Invalid media path");
    return path.join(storageRoot(), filename);
}

/** Missing files are expected when database records have been migrated without their uploads. */
export async function removeMediaFile(filename: string) {
    try {
        await unlink(mediaPath(filename));
    } catch (error) {
        if (!error || typeof error !== "object" || !("code" in error) || error.code !== "ENOENT")
            throw error;
    }
}
