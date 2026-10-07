import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { MediaLibrary } from "@/components/admin/media-library";
export default async function Media() { const session = await requireSession(); return <MediaLibrary items={await db.media.findMany({ orderBy: { createdAt: "desc" } })} csrf={session.csrfToken} canWrite={session.user.role.name !== "VIEWER"}/>; }
