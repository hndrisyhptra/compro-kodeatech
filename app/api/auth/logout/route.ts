import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authorizeWrite } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api";
export async function POST(request: Request) {
    try {
        const session = await authorizeWrite(request);
        await db.session.delete({ where: { id: session.id } });
        (await cookies()).delete("kodea_session");
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
