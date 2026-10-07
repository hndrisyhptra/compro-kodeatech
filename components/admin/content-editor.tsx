"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { ImageField } from "./image-picker";
import { ProfilePhotoField } from "./profile-photo-field";
import { ArrowLeft, Save, ExternalLink, Image as ImageIcon } from "lucide-react";
import type { ContentRecord } from "@/types/content";
import { extraFields, resourceLabels, type Resource } from "@/features/cms/config";
import { useAdmin } from "@/hooks/use-admin";
import { Notice } from "./notice";
import { slugify, obj } from "@/lib/utils";
const RichEditor = dynamic(() => import("./rich-editor").then(m => m.RichEditor), { ssr: false, loading: () => <div className="skeleton" style={{ height: 240 }}/> });
type Draft = {
    title: string;
    slug: string;
    locale: string;
    excerpt: string;
    content: string;
    image: string;
    status: string;
    featured: boolean;
    sortOrder: number;
    data: Record<string, unknown>;
    seoTitle: string;
    seoDescription: string;
    ogImage: string;
    canonical: string;
    keywords: string;
    publishedAt: string | null;
};
const empty: Draft = { title: "", slug: "", locale: "en", excerpt: "", content: "", image: "", status: "draft", featured: false, sortOrder: 0, data: {}, seoTitle: "", seoDescription: "", ogImage: "", canonical: "", keywords: "", publishedAt: null };
export function ContentEditor({ item, resource, csrf, canWrite }: {
    item: ContentRecord | null;
    resource: Resource;
    csrf: string;
    canWrite: boolean;
}) {
    const [draft, setDraft] = useState<Draft>(item ? { ...item, data: obj(item.data), publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : null } : empty), [manualSlug, setManualSlug] = useState(!!item), [tab, setTab] = useState("content");
    const { request, busy, notice, router } = useAdmin(csrf);
    const [uploads, setUploads] = useState(0);
    const uploadActivity = useCallback((active: boolean) => setUploads(n => Math.max(0, n + (active ? 1 : -1))), []);
    const imageLabel = resource === "partners" || resource === "technologies" ? "Logo" : resource === "team" || resource === "testimonials" ? "Profile photo" : "Featured / cover image";
    function field<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft(d => ({ ...d, [key]: value })); }
    async function save(e: React.FormEvent) {
        e.preventDefault();
        if (uploads || busy || !canWrite) return;
        const result = await request(`/api/admin/content/${resource}`, { id: item?.id, record: draft });
        if (result && !item) {
            const id = (result as {
                id: string;
            }).id;
            router.push(`/admin/${resource}/${id}`);
        }
    }
    return <form onSubmit={save}><div className="admin-page-heading"><div><Link className="back-link" href={`/admin/${resource}`}><ArrowLeft size={15}/>{resourceLabels[resource]}</Link><h1>{item ? "Edit" : "Add"} {resource === "portfolio" ? "project" : resource === "blog" ? "post" : "content"}</h1></div><div className="editor-header-actions"><Link className="button secondary" href="/admin/media"><ImageIcon size={17}/>Media library</Link>{canWrite && <button disabled={busy || uploads > 0} className="button"><Save size={16}/>{uploads ? "Uploading…" : busy ? "Saving…" : "Save changes"}</button>}</div></div><div className="editor-layout"><div className="admin-panel editor-main"><div className="editor-tabs">{["content", "details", "seo"].map(t => <button key={t} type="button" disabled={uploads > 0} onClick={() => setTab(t)} className={tab === t ? "active" : ""}>{t === "seo" ? "SEO & sharing" : t === "details" ? "Additional details" : "Content"}</button>)}</div><fieldset disabled={!canWrite} className="editor-fields">{tab === "content" && <><label>Title *<input value={draft.title} required minLength={2} maxLength={200} placeholder="A clear, useful title" onChange={e => { const title = e.target.value; setDraft(d => ({ ...d, title, ...(!manualSlug ? { slug: slugify(title) } : {}) })); }}/></label><label>Slug *<input value={draft.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={e => { setManualSlug(true); field("slug", e.target.value); }}/><small>Lowercase words separated by hyphens. You can edit the automatically generated slug.</small></label><label>Short description<textarea rows={3} value={draft.excerpt} onChange={e => field("excerpt", e.target.value)} maxLength={3000}/></label><div className="field-label">Content</div><RichEditor csrf={csrf} onUploadActivity={uploadActivity} editable={canWrite} value={draft.content} onChange={value => field("content", value)}/>{resource === "testimonials" ? <ProfilePhotoField value={draft.image} crop={draft.data.photoCrop} csrf={csrf} disabled={!canWrite || uploads > 0} onUploadActivity={uploadActivity} onChange={(image, photoCrop) => setDraft(d => ({ ...d, image, data: { ...d.data, photoCrop } }))}/> : <ImageField label={imageLabel} value={draft.image} csrf={csrf} disabled={!canWrite} onUploadActivity={uploadActivity} onChange={urls => field("image", urls[0] || "")}/>}</>}{tab === "details" && extraFields[resource].map(f => f.kind === "image" || f.kind === "gallery" ? <ImageField key={f.key} label={f.label} value={f.kind === "gallery" ? (Array.isArray(draft.data[f.key]) ? (draft.data[f.key] as string[]) : []) : String(draft.data[f.key] || "")} multiple={f.kind === "gallery"} csrf={csrf} disabled={!canWrite} onUploadActivity={uploadActivity} onChange={urls => field("data", { ...draft.data, [f.key]: f.kind === "gallery" ? urls : urls[0] || "" })}/> : <label key={f.key}>{f.label}{f.kind === "textarea" || f.kind === "list" ? <textarea rows={f.kind === "list" ? 5 : 4} value={f.kind === "list" ? (Array.isArray(draft.data[f.key]) ? (draft.data[f.key] as string[]).join("\n") : "") : String(draft.data[f.key] ?? "")} onChange={e => field("data", { ...draft.data, [f.key]: f.kind === "list" ? e.target.value.split("\n").filter(Boolean) : e.target.value })}/> : <input type={f.kind === "number" ? "number" : f.kind === "url" ? "url" : "text"} value={String(draft.data[f.key] ?? "")} onChange={e => field("data", { ...draft.data, [f.key]: f.kind === "number" ? Number(e.target.value) : e.target.value })}/>}<small>{f.help || (f.kind === "list" ? "One item per line." : "")}</small></label>)}{tab === "seo" && <><label>SEO title<input value={draft.seoTitle} onChange={e => field("seoTitle", e.target.value)} maxLength={200}/><small>{draft.seoTitle.length} characters · aim for 50–60</small></label><label>Meta description<textarea rows={3} value={draft.seoDescription} onChange={e => field("seoDescription", e.target.value)} maxLength={1000}/><small>{draft.seoDescription.length} characters · aim for 150–160</small></label><ImageField label="Open Graph image" value={draft.ogImage} csrf={csrf} disabled={!canWrite} onUploadActivity={uploadActivity} onChange={urls => field("ogImage", urls[0] || "")}/><label>Canonical URL<input value={draft.canonical} onChange={e => field("canonical", e.target.value)} placeholder="Leave blank to use the page URL"/></label><label>Meta keywords<input value={draft.keywords} onChange={e => field("keywords", e.target.value)}/></label><div className="seo-preview"><small>SEARCH RESULT PREVIEW</small><strong>{draft.seoTitle || draft.title || "Your page title"}</strong><span>kodeatech.cloud/{resource}/{draft.slug}</span><p>{draft.seoDescription || draft.excerpt}</p></div></>}</fieldset></div><aside><section className="admin-panel editor-publish"><h2>Publication</h2><label>Status<select disabled={!canWrite} value={draft.status} onChange={e => field("status", e.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select></label><label>Language<select disabled={!canWrite} value={draft.locale} onChange={e => field("locale", e.target.value)}><option value="en">English</option><option value="id">Bahasa Indonesia</option></select></label><label>Publish date<input type="datetime-local" disabled={!canWrite} value={draft.publishedAt ? new Date(new Date(draft.publishedAt).getTime() - new Date(draft.publishedAt).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""} onChange={e => field("publishedAt", e.target.value ? new Date(e.target.value).toISOString() : null)}/><small>Scheduled content becomes visible at this time.</small></label><label>Display order<input type="number" min={0} max={10000} disabled={!canWrite} value={draft.sortOrder} onChange={e => field("sortOrder", Number(e.target.value))}/></label><label className="checkbox-label"><input type="checkbox" disabled={!canWrite} checked={draft.featured} onChange={e => field("featured", e.target.checked)}/>Featured on homepage</label>{item && ["pages", "services", "solutions", "portfolio", "blog"].includes(resource) && <Link className="button secondary" target="_blank" href={`${resource === "pages" ? "" : `/${resource}`}/${draft.slug}${draft.locale === "id" ? "?lang=id" : ""}`}><ExternalLink size={15}/>View page</Link>}</section><div className="editor-tip"><span className="eyebrow">A LITTLE EDITORIAL CARE</span><p>Keep copy clear, add useful alt text, and preview your page before sharing it.</p></div></aside></div><Notice notice={notice}/></form>;
}
