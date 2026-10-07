import { db } from "@/lib/db";
import type { Resource } from "@/features/cms/config";
import type { ContentRecord } from "@/types/content";
import type { Prisma } from "@prisma/client";
export type ContentInput = Omit<ContentRecord, "id" | "createdAt" | "updatedAt" | "data"> & {
    data: Prisma.InputJsonValue;
};
export async function listContent(resource: Resource, publicOnly = false, locale = "en"): Promise<ContentRecord[]> {
    const where = publicOnly ? { locale, OR: [{ status: "published" }, { status: "scheduled", publishedAt: { lte: new Date() } }] } : {};
    const args = { where, orderBy: [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }] };
    switch (resource) {
        case "pages": return db.page.findMany(args);
        case "services": return db.service.findMany(args);
        case "solutions": return db.solution.findMany(args);
        case "portfolio": return db.portfolio.findMany(args);
        case "blog": return db.blogPost.findMany(args);
        case "testimonials": return db.testimonial.findMany(args);
        case "partners": return db.partner.findMany(args);
        case "team": return db.teamMember.findMany(args);
        case "technologies": return db.technology.findMany(args);
    }
}
export async function findContent(resource: Resource, id: string): Promise<ContentRecord | null> {
    switch (resource) {
        case "pages": return db.page.findUnique({ where: { id } });
        case "services": return db.service.findUnique({ where: { id } });
        case "solutions": return db.solution.findUnique({ where: { id } });
        case "portfolio": return db.portfolio.findUnique({ where: { id } });
        case "blog": return db.blogPost.findUnique({ where: { id } });
        case "testimonials": return db.testimonial.findUnique({ where: { id } });
        case "partners": return db.partner.findUnique({ where: { id } });
        case "team": return db.teamMember.findUnique({ where: { id } });
        case "technologies": return db.technology.findUnique({ where: { id } });
    }
}
export async function saveContent(resource: Resource, data: ContentInput, id?: string, authorId?: string): Promise<ContentRecord> {
    let result: ContentRecord;
    switch (resource) {
        case "pages":
            result = id ? await db.page.update({ where: { id }, data }) : await db.page.create({ data });
            break;
        case "services":
            result = id ? await db.service.update({ where: { id }, data }) : await db.service.create({ data });
            break;
        case "solutions":
            result = id ? await db.solution.update({ where: { id }, data }) : await db.solution.create({ data });
            break;
        case "portfolio":
            result = id ? await db.portfolio.update({ where: { id }, data }) : await db.portfolio.create({ data });
            break;
        case "blog":
            result = id ? await db.blogPost.update({ where: { id }, data }) : await db.blogPost.create({ data: { ...data, authorId } });
            break;
        case "testimonials":
            result = id ? await db.testimonial.update({ where: { id }, data }) : await db.testimonial.create({ data });
            break;
        case "partners":
            result = id ? await db.partner.update({ where: { id }, data }) : await db.partner.create({ data });
            break;
        case "team":
            result = id ? await db.teamMember.update({ where: { id }, data }) : await db.teamMember.create({ data });
            break;
        case "technologies":
            result = id ? await db.technology.update({ where: { id }, data }) : await db.technology.create({ data });
            break;
    }
    if (resource === "portfolio") {
        const details = data.data as Record<string, unknown>;
        const gallery = Array.isArray(details.gallery) ? details.gallery.filter((v): v is string => typeof v === "string") : [];
        const names = Array.isArray(details.technology) ? details.technology.filter((v): v is string => typeof v === "string") : [];
        const tech = await db.technology.findMany({ where: { title: { in: names } } });
        await db.portfolio.update({ where: { id: result.id }, data: { technologies: { set: tech.map(t => ({ id: t.id })) }, images: { deleteMany: {}, create: gallery.map((url, sortOrder) => ({ url, alt: result.title, sortOrder })) } } });
    }
    if (resource === "blog") {
        const details = data.data as Record<string, unknown>;
        const category = typeof details.category === "string" && details.category ? await db.blogCategory.upsert({ where: { name: details.category }, update: {}, create: { name: details.category, slug: details.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") } }) : null;
        const names = Array.isArray(details.tags) ? details.tags.filter((v): v is string => typeof v === "string") : [];
        const tags = await Promise.all(names.map(name => db.blogTag.upsert({ where: { name }, update: {}, create: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") } })));
        await db.blogPost.update({ where: { id: result.id }, data: { categoryId: category?.id ?? null, tags: { set: tags.map(t => ({ id: t.id })) } } });
    }
    return result;
}
export async function deleteContent(resource: Resource, id: string) {
    switch (resource) {
        case "pages":
            await db.page.delete({ where: { id } });
            break;
        case "services":
            await db.service.delete({ where: { id } });
            break;
        case "solutions":
            await db.solution.delete({ where: { id } });
            break;
        case "portfolio":
            await db.portfolio.delete({ where: { id } });
            break;
        case "blog":
            await db.blogPost.delete({ where: { id } });
            break;
        case "testimonials":
            await db.testimonial.delete({ where: { id } });
            break;
        case "partners":
            await db.partner.delete({ where: { id } });
            break;
        case "team":
            await db.teamMember.delete({ where: { id } });
            break;
        case "technologies":
            await db.technology.delete({ where: { id } });
            break;
    }
}
