import path from "node:path";
export function storageRoot() { return path.resolve(process.env.STORAGE_ROOT || "./storage/uploads"); }
export function mediaPath(filename: string) {
    if (!/^\d{4}\/\d{2}\/[a-f0-9-]+\.webp$/.test(filename))
        throw new Error("Invalid media path");
    return path.join(storageRoot(), filename);
}
