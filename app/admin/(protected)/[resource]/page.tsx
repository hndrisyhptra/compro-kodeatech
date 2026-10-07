import { notFound } from "next/navigation";
import { isResource } from "@/features/cms/config";
import { listContent } from "@/services/content";
import { requireSession } from "@/lib/auth";
import { ContentList } from "@/components/admin/content-list";
export default async function ContentPage({ params }: {
    params: Promise<{
        resource: string;
    }>;
}) {
    const { resource } = await params;
    if (!isResource(resource))
        notFound();
    const [items, session] = await Promise.all([listContent(resource), requireSession()]);
    return <ContentList resource={resource} items={items} csrf={session.csrfToken} canWrite={session.user.role.name !== "VIEWER"}/>;
}
