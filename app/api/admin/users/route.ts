import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { authorizeWrite, HttpError } from "@/lib/auth";
import { apiError, readJson } from "@/lib/api";
import { userSchema } from "@/lib/validation";
import { z } from "zod";
export async function POST(request: Request) {
    try {
        const session = await authorizeWrite(request, true);
        const { id, record } = z.object({ id: z.string().optional(), record: userSchema }).parse(await readJson(request));
        if (!id && record.password.length < 12 || record.password && record.password.length < 12)
            throw new HttpError(422, "Use a password with at least 12 characters.");
        if (id === session.userId && (!record.active || record.role !== "OWNER"))
            throw new HttpError(422, "You cannot deactivate or demote your own account.");
        const role = await db.role.findUniqueOrThrow({ where: { name: record.role } });
        const data = { name: record.name, email: record.email.toLowerCase(), roleId: role.id, active: record.active, ...(record.password ? { passwordHash: await hash(record.password, 12) } : {}) };
        if (id) {
            await db.user.update({ where: { id }, data });
            await db.session.deleteMany({ where: { userId: id } });
        }
        else
            await db.user.create({ data: { ...data, passwordHash: await hash(record.password, 12) } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
export async function DELETE(request: Request) {
    try {
        const session = await authorizeWrite(request, true);
        const { id } = z.object({ id: z.string() }).parse(await readJson(request));
        if (id === session.userId)
            throw new HttpError(422, "You cannot delete your own account.");
        await db.user.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return apiError(e);
    }
}
