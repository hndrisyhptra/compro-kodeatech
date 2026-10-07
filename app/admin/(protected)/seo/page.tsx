import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { SEOEditor } from "@/components/admin/seo-editor";
export default async function SEO() { const session = await requireSession(); return <SEOEditor items={await db.seoMetadata.findMany({ orderBy: { path: "asc" } })} csrf={session.csrfToken} canWrite={session.user.role.name !== "VIEWER"}/>; }
