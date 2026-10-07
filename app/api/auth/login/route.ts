import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { checkOrigin, createSession, rateLimit, HttpError } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { apiError, readJson } from "@/lib/api";
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        await rateLimit(request, "login", 8, 15 * 60 * 1000);
        const data = loginSchema.parse(await readJson(request));
        const user = await db.user.findUnique({ where: { email: data.email.toLowerCase() } });
        const valid = await compare(data.password, user?.passwordHash || "$2b$12$zRpx3AIXBpxCTfo60lpge.OEMxeVXutUtLIpnMV5Bs9ET9Nbjy/bS");
        if (!user || !user.active || !valid)
            throw new HttpError(401, "Email or password is incorrect.");
        await createSession(user.id);
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
