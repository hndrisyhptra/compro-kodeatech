import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminShell } from "@/components/admin/shell";
export const dynamic = "force-dynamic";
export const metadata = { title: "Content workspace · KODEA TECH", robots: { index: false, follow: false } };
export default async function Layout({ children }: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session)
        redirect("/admin/login");
    const unread = await db.contactMessage.count({ where: { status: "unread" } });
    return <AdminShell name={session.user.name} role={session.user.role.name} unread={unread} csrf={session.csrfToken}>{children}</AdminShell>;
}
