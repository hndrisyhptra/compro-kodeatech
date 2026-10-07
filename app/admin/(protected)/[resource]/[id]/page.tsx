import { notFound } from "next/navigation";
import { isResource } from "@/features/cms/config";
import { findContent } from "@/services/content";
import { requireSession } from "@/lib/auth";
import { ContentEditor } from "@/components/admin/content-editor";
export default async function EditPage({ params }: {
    params: Promise<{
        resource: string;
        id: string;
    }>;
}) {
    const { resource, id } = await params;
    if (!isResource(resource))
        notFound();
    const session = await requireSession();
    const item = id === "new" ? null : await findContent(resource, id);
    if (id !== "new" && !item)
        notFound();
    return <ContentEditor key={id} resource={resource} item={item} csrf={session.csrfToken} canWrite={session.user.role.name !== "VIEWER"}/>;
}
