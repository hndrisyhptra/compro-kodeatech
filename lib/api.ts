import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "@/lib/auth";
import { Prisma } from "@prisma/client";
export function apiError(error: unknown) {
    if (error instanceof HttpError)
        return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof ZodError)
        return NextResponse.json({ error: error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 422 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
        return NextResponse.json({ error: "This slug or email already exists." }, { status: 409 });
    console.error(error);
    return NextResponse.json({ error: "We couldn't complete this request. Please try again." }, { status: 500 });
}
export async function readJson(request: Request) {
    const text = await request.text();
    if (Buffer.byteLength(text) > 512 * 1024)
        throw new HttpError(413, "Request is too large.");
    try {
        return JSON.parse(text) as unknown;
    }
    catch {
        throw new HttpError(400, "Invalid JSON.");
    }
}
