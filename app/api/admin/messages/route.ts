import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizeWrite } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { z } from "zod";
export async function POST(request: Request) {
    try {
        await authorizeWrite(request);
        const { id, ...data } = z.object({ id: z.string(), status: z.enum(["unread", "read", "replied", "archived"]), notes: z.string().max(10000) }).parse(await readJson(request));
        await db.contactMessage.update({ where: { id }, data });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
