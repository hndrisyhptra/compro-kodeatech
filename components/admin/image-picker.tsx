"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, Image as ImageIcon, LoaderCircle, Search, Upload, X } from "lucide-react";

export interface MediaAsset {
    id: string;
    filename: string;
    originalName: string;
    title: string;
    alt: string;
    width: number;
    height: number;
}
type UploadActivity = (active: boolean) => void;
const acceptedImages = "image/jpeg,image/png,image/webp,image/avif";
export const imageUrl = (asset: MediaAsset) => `/media/${asset.filename}`;

async function responseJson<T>(response: Response): Promise<T> {
    const data = await response.json();
    if (!response.ok) throw new Error(typeof data.error === "string" ? data.error : "Unable to load media. Please try again.");
    return data as T;
}

function useImageUpload(csrf: string, onUploadActivity?: UploadActivity) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    async function upload(files: File[]): Promise<MediaAsset[]> {
        setUploading(true);
        setError("");
        onUploadActivity?.(true);
        const assets: MediaAsset[] = [];
        const errors: string[] = [];
        try {
            for (const file of files) {
                try {
                    if (!acceptedImages.split(",").includes(file.type)) throw new Error("Use a JPEG, PNG, WebP or AVIF image.");
                    if (!file.size || file.size > 5 * 1024 * 1024) throw new Error("Choose an image up to 5 MB.");
                    const body = new FormData();
                    body.set("file", file);
                    const response = await fetch("/api/admin/media", { method: "POST", headers: { "x-csrf-token": csrf }, body });
                    assets.push(await responseJson<MediaAsset>(response));
                } catch (cause) {
                    errors.push(`${file.name}: ${cause instanceof Error ? cause.message : "Upload failed. Please try again."}`);
                }
            }
            setError(errors.join("\n"));
            return assets;
        } finally {
            setUploading(false);
            onUploadActivity?.(false);
        }
    }
    return { upload, uploading, error };
}

/** Uses the native file chooser on desktop and mobile, with the same secure CMS upload API. */
export function ImageField({ label, value, onChange, csrf, disabled = false, multiple = false, showPreview = true, onUploadActivity }: {
    label: string;
    value: string | string[];
    onChange: (urls: string[]) => void;
    csrf: string;
    disabled?: boolean;
    multiple?: boolean;
    showPreview?: boolean;
    onUploadActivity?: UploadActivity;
}) {
    const titleId = useId();
    const input = useRef<HTMLInputElement>(null);
    const [choosing, setChoosing] = useState(false);
    const { upload, uploading, error } = useImageUpload(csrf, onUploadActivity);
    const urls = (Array.isArray(value) ? value : [value]).filter(Boolean);
    function select(assets: MediaAsset[]) {
        if (!assets.length) return;
        const selected = assets.map(imageUrl);
        onChange(multiple ? [...new Set([...urls, ...selected])] : selected.slice(0, 1));
    }
    function move(index: number, direction: number) {
        const reordered = [...urls];
        [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
        onChange(reordered);
    }
    return <div className="image-field" role="group" aria-labelledby={titleId}>
        <span className="field-label" id={titleId}>{label}</span>
        {urls.length > 0 ? showPreview && <div className={`image-field-previews ${multiple ? "is-gallery" : ""}`}>
            {urls.map((url, index) => <div className="image-field-preview" key={`${index}:${url}`}>
                <Image src={url} alt={`${label} preview ${index + 1}`} width={360} height={200} sizes={multiple ? "160px" : "(max-width: 600px) 80vw, 300px"}/>
                <div className="image-field-preview-actions">
                    {multiple && <><button type="button" className="icon-button" disabled={disabled || uploading || index === 0} aria-label={`Move image ${index + 1} earlier`} onClick={() => move(index, -1)}><ArrowUp size={15}/></button><button type="button" className="icon-button" disabled={disabled || uploading || index === urls.length - 1} aria-label={`Move image ${index + 1} later`} onClick={() => move(index, 1)}><ArrowDown size={15}/></button></>}
                    <button type="button" className="icon-button" disabled={disabled || uploading} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} onClick={() => onChange(urls.filter((_, i) => i !== index))}><X size={16}/></button>
                </div>
            </div>)}
        </div> : <div className="image-field-empty"><ImageIcon size={24}/><span>No {multiple ? "images" : "image"} selected</span></div>}
        <div className="image-field-actions">
            <button type="button" className="button secondary" disabled={disabled || uploading} onClick={() => input.current?.click()}>{uploading ? <LoaderCircle size={16} className="upload-spinner"/> : <Upload size={16}/>} {uploading ? "Uploading…" : "Upload from device"}</button>
            <button type="button" className="button secondary" disabled={disabled || uploading} onClick={() => setChoosing(true)}><ImageIcon size={16}/>Choose from library</button>
        </div>
        <input ref={input} type="file" hidden disabled={disabled || uploading} accept={acceptedImages} multiple={multiple} aria-label={`Upload ${label.toLowerCase()} from device`} onChange={async e => {
            const files = Array.from(e.currentTarget.files || []);
            e.currentTarget.value = "";
            if (files.length) select(await upload(files));
        }}/>
        <small>JPEG, PNG, WebP or AVIF · up to 5 MB each. Uploaded images are saved to your Media Library.</small>
        {error && <p className="image-picker-error" role="alert">{error}</p>}
        {choosing && <MediaChooser csrf={csrf} multiple={multiple} onUploadActivity={onUploadActivity} onClose={() => setChoosing(false)} onSelect={select}/>}
    </div>;
}

export function MediaChooser({ csrf, multiple = false, onSelect, onClose, onUploadActivity }: {
    csrf: string;
    multiple?: boolean;
    onSelect: (assets: MediaAsset[]) => void;
    onClose: () => void;
    onUploadActivity?: UploadActivity;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const titleId = useId();
    const [items, setItems] = useState<MediaAsset[]>([]);
    const [selected, setSelected] = useState<MediaAsset[]>([]);
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [cursor, setCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const { upload, uploading, error } = useImageUpload(csrf, onUploadActivity);
    const busy = uploading || loading;
    const requestController = useRef<AbortController | null>(null);

    async function load(query: string, nextCursor?: string) {
        requestController.current?.abort();
        const controller = new AbortController();
        requestController.current = controller;
        setLoading(true);
        setLoadError("");
        try {
            const params = new URLSearchParams({ search: query });
            if (nextCursor) params.set("cursor", nextCursor);
            const result = await responseJson<{ items: MediaAsset[]; nextCursor: string | null }>(await fetch(`/api/admin/media?${params}`, { cache: "no-store", signal: controller.signal }));
            setItems(current => nextCursor ? [...new Map([...current, ...result.items].map(asset => [asset.id, asset])).values()] : result.items);
            setCursor(result.nextCursor);
            setAppliedSearch(query);
        } catch (cause) {
            if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : "Unable to load media.");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }

    useEffect(() => {
        dialog.current?.showModal();
        const controller = new AbortController();
        requestController.current = controller;
        fetch("/api/admin/media", { cache: "no-store", signal: controller.signal })
            .then(response => responseJson<{ items: MediaAsset[]; nextCursor: string | null }>(response))
            .then(result => { setItems(result.items); setCursor(result.nextCursor); })
            .catch(cause => { if (!controller.signal.aborted) setLoadError(cause instanceof Error ? cause.message : "Unable to load media."); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => { requestController.current?.abort(); };
    }, []);

    function toggle(asset: MediaAsset) {
        setSelected(current => current.some(item => item.id === asset.id) ? current.filter(item => item.id !== asset.id) : multiple ? [...current, asset] : [asset]);
    }
    return <dialog ref={dialog} className="media-picker-dialog" aria-labelledby={titleId} onCancel={e => { e.preventDefault(); if (!uploading) onClose(); }}>
        <div className="media-picker-heading"><div><h2 id={titleId}>{multiple ? "Choose images" : "Choose an image"}</h2><p>Upload from your device or use an existing image.</p></div><button type="button" className="icon-button" aria-label="Close image picker" disabled={uploading} onClick={onClose}><X size={20}/></button></div>
        <div className="media-picker-toolbar"><label className="input-search"><Search size={17}/><input aria-label="Search images" placeholder="Search by name or alt text" maxLength={200} value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void load(search); } }}/></label><button type="button" className="button secondary" disabled={busy} onClick={() => load(search)}>Search</button><button type="button" className="button" disabled={busy} onClick={() => fileInput.current?.click()}>{uploading ? <LoaderCircle size={16} className="upload-spinner"/> : <Upload size={16}/>} {uploading ? "Uploading…" : "Upload from device"}</button></div>
        <input ref={fileInput} type="file" hidden accept={acceptedImages} multiple={multiple} aria-label="Upload images to library" onChange={async e => {
            const files = Array.from(e.currentTarget.files || []);
            e.currentTarget.value = "";
            if (!files.length) return;
            const uploaded = await upload(files);
            setItems(current => [...uploaded, ...current]);
            setSelected(current => multiple ? [...current, ...uploaded] : uploaded.length ? [uploaded[0]] : current);
        }}/>
        <small className="media-picker-help">JPEG, PNG, WebP or AVIF · up to 5 MB each. Edit alt text in Media Library.</small>
        {(loadError || error) && <p className="image-picker-error" role="alert">{loadError || error}</p>}
        <div className="media-picker-body" aria-busy={busy}>
            {loading && items.length === 0 ? <div className="image-picker-state" role="status"><LoaderCircle className="upload-spinner"/>Loading your images…</div> : !items.length ? <div className="image-picker-state"><ImageIcon size={32}/><strong>{loadError ? "Images could not be loaded" : appliedSearch ? "No matching images" : "Your library is empty"}</strong><p>{loadError ? "Use Search to try again." : "Upload an image from your laptop or phone to get started."}</p></div> : <div className="media-picker-grid">{items.map(asset => {
                const checked = selected.some(item => item.id === asset.id);
                return <button type="button" className={`media-picker-card ${checked ? "selected" : ""}`} key={asset.id} disabled={uploading} aria-pressed={checked} aria-label={`Select ${asset.title || asset.originalName}`} onClick={() => toggle(asset)}>
                    <Image src={imageUrl(asset)} alt={asset.alt || asset.title} width={320} height={200} sizes="(max-width: 600px) 40vw, 180px"/>
                    <span>{asset.title || asset.originalName}</span><small>{asset.width} × {asset.height}</small>{checked && <i><Check size={16}/></i>}
                </button>;
            })}</div>}
            {cursor && <button type="button" className="button secondary media-picker-more" disabled={busy} onClick={() => load(appliedSearch, cursor)}>{loading ? "Loading…" : "Load more images"}</button>}
        </div>
        <div className="media-picker-footer"><span>{selected.length ? `${selected.length} selected` : "Select an image to continue"}</span><button type="button" className="button secondary" disabled={uploading} onClick={onClose}>Cancel</button><button type="button" className="button" disabled={!selected.length || uploading} onClick={() => { onSelect(selected); onClose(); }}>Use {multiple ? "selected images" : "image"}</button></div>
    </dialog>;
}
