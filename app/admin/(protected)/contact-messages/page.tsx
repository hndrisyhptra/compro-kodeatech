import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { Messages } from "@/components/admin/messages";
export default async function Inbox() { const session = await requireSession(); return <Messages items={await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } })} csrf={session.csrfToken} canWrite={session.user.role.name !== "VIEWER"}/>; }
