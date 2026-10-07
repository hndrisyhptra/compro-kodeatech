import { cookies } from "next/headers";
import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/utils";
export class HttpError extends Error {
    constructor(public status: number, message: string) { super(message); }
}
export function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export async function getSession() {
    const token = (await cookies()).get("kodea_session")?.value;
    if (!token)
        return null;
    const session = await db.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: { include: { role: true } } } });
    return session && session.expiresAt > new Date() && session.user.active ? session : null;
}
export async function requireSession(write = false, owner = false) {
    const session = await getSession();
    if (!session)
        throw new HttpError(401, "Please sign in.");
    if (owner && session.user.role.name !== "OWNER" || write && session.user.role.name === "VIEWER")
        throw new HttpError(403, "Your role does not allow this action.");
    return session;
}
export async function createSession(userId: string) { const token = randomBytes(32).toString("hex"); const csrfToken = randomBytes(32).toString("hex"); const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }); await db.session.create({ data: { userId, tokenHash: hashToken(token), csrfToken, expiresAt } }); (await cookies()).set("kodea_session", token, { httpOnly: true, secure: siteUrl().startsWith("https://"), sameSite: "strict", path: "/", expires: expiresAt }); }
export function checkOrigin(request: Request) {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(siteUrl()).origin)
        throw new HttpError(403, "Invalid request origin.");
}
export async function authorizeWrite(request: Request, owner = false) {
    checkOrigin(request);
    const session = await requireSession(true, owner);
    const provided = request.headers.get("x-csrf-token") || "";
    const expected = session.csrfToken;
    if (!/^[a-f0-9]{64}$/.test(provided) || provided.length !== expected.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected)))
        throw new HttpError(403, "Session token expired. Reload and try again.");
    return session;
}
export async function rateLimit(request: Request, scope: string, max: number, windowMs: number) {
    const ip = process.env.TRUST_PROXY === "true" ? request.headers.get("x-real-ip") || "unknown" : "local";
    const key = hashToken(`${scope}:${ip}`);
    const now = new Date();
    await db.rateLimit.upsert({ where: { key }, create: { key, count: 0, resetAt: new Date(now.getTime() + windowMs) }, update: {} });
    await db.rateLimit.updateMany({ where: { key, resetAt: { lte: now } }, data: { count: 0, resetAt: new Date(now.getTime() + windowMs) } });
    const accepted = await db.rateLimit.updateMany({ where: { key, count: { lt: max } }, data: { count: { increment: 1 } } });
    if (accepted.count === 0)
        throw new HttpError(429, "Too many attempts. Please try again later.");
}
