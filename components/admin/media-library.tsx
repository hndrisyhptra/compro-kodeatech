"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, Search, Copy, Trash2, Image as ImageIcon, Save } from "lucide-react";
import type { Media } from "@prisma/client";
import { useAdmin } from "@/hooks/use-admin";
import { Notice } from "./notice";
import { Confirm } from "./confirm";
export function MediaLibrary({ items, csrf, canWrite }: {
    items: Media[];
    csrf: string;
    canWrite: boolean;
}) {
    const { request, busy, notice } = useAdmin(csrf), [query, setQuery] = useState(""), [filter, setFilter] = useState("all"), [selected, setSelected] = useState<Media | null>(null), [pending, setPending] = useState<string | null>(null), [copied, setCopied] = useState(""), input = useRef<HTMLInputElement>(null);
    const visible = items.filter(m => `${m.originalName} ${m.title} ${m.alt}`.toLowerCase().includes(query.toLowerCase()) && (filter === "all" || filter === "landscape" && m.width >= m.height || filter === "portrait" && m.width < m.height));
    async function upload(files: FileList | null) {
        if (!files)
            return;
        for (const file of Array.from(files)) {
            const form = new FormData();
            form.set("file", file);
            const result = await request("/api/admin/media", form);
            if (!result)
                break;
        }
        if (input.current)
            input.current.value = "";
    }
    return <><div className="admin-page-heading"><div><span className="eyebrow">A HOME FOR YOUR ASSETS</span><h1>Media library</h1><p>Images are optimized to WebP and organized by upload date.</p></div>{canWrite && <><input hidden ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => upload(e.target.files)}/><button className="button" disabled={busy} onClick={() => input.current?.click()}><Upload size={17}/>{busy ? "Uploading…" : "Upload images"}</button></>}</div><div className="table-toolbar admin-panel"><div className="input-search"><Search size={17}/><input aria-label="Search images" placeholder="Search images…" value={query} onChange={e => setQuery(e.target.value)}/></div><select aria-label="Filter image orientation" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All images</option><option value="landscape">Landscape</option><option value="portrait">Portrait</option></select><span>{visible.length} assets</span></div><div className="media-layout"><div className="media-grid">{visible.map(m => <button key={m.id} className={`media-card ${selected?.id === m.id ? "active" : ""}`} onClick={() => setSelected(m)}><Image src={`/media/${m.filename}`} width={400} height={300} alt={m.alt || m.title} sizes="(max-width: 768px) 50vw, 25vw"/><strong>{m.title || m.originalName}</strong><small>{m.width} × {m.height} · {Math.round(m.size / 1024)} KB</small></button>)}{!visible.length && <div className="empty-state"><ImageIcon size={30}/><h3>{items.length ? "No matching images." : "Ready for your first image."}</h3><p>JPEG, PNG, WebP or AVIF · up to 5 MB each.</p></div>}</div>{selected && <aside className="admin-panel media-details"><Image src={`/media/${selected.filename}`} width={500} height={350} alt={selected.alt} sizes="300px"/><h2>Image details</h2><label>Title<input disabled={!canWrite} value={selected.title} onChange={e => setSelected({ ...selected, title: e.target.value })}/></label><label>Alt text<input disabled={!canWrite} value={selected.alt} onChange={e => setSelected({ ...selected, alt: e.target.value })}/><small>Describe the image for screen readers.</small></label><label>Description<textarea disabled={!canWrite} value={selected.description} onChange={e => setSelected({ ...selected, description: e.target.value })}/></label><label>Image URL<input readOnly value={`/media/${selected.filename}`}/></label><button className="button secondary" onClick={async () => { await navigator.clipboard.writeText(`/media/${selected.filename}`); setCopied(selected.id); }}><Copy size={15}/>{copied === selected.id ? "URL copied" : "Copy URL"}</button>{canWrite && <><button className="button" disabled={busy} onClick={() => request("/api/admin/media", { id: selected.id, title: selected.title, alt: selected.alt, description: selected.description }, "PATCH")}><Save size={15}/>Save details</button><button className="button danger-outline" onClick={() => setPending(selected.id)}><Trash2 size={15}/>Delete image</button></>}</aside>}</div><Notice notice={notice}/><Confirm open={!!pending} title="Delete this image?" description="Pages using this image will need a replacement. This action cannot be undone." onCancel={() => setPending(null)} onConfirm={async () => { await request("/api/admin/media", { id: pending }, "DELETE"); setSelected(null); }}/></>;
}
