import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkOrigin, rateLimit } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { contactSchema } from "@/lib/validation";
export async function POST(request: Request) {
    try {
        checkOrigin(request);
        await rateLimit(request, "contact", 5, 60 * 60 * 1000);
        const { website, ...data } = contactSchema.parse(await readJson(request));
        void website;
        await db.contactMessage.create({ data: { ...data, notes: "" } });
        return NextResponse.json({ ok: true }, { status: 201 });
    }
    catch (e) {
        return apiError(e);
    }
}
