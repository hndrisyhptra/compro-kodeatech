import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { UsersEditor } from "@/components/admin/users";
export default async function Users() {
    const session = await requireSession();
    if (session.user.role.name !== "OWNER")
        return <div className="empty-state"><h1>Owner access required.</h1></div>;
    const items = await db.user.findMany({ select: { id: true, name: true, email: true, active: true, role: { select: { name: true } } }, orderBy: { createdAt: "asc" } });
    return <UsersEditor items={items} csrf={session.csrfToken}/>;
}
