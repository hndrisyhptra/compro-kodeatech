"use client";
import { useState } from "react";
import { MediaChooser, imageUrl } from "./image-picker";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Bold, Italic, List, ListOrdered, Quote, Code, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from "lucide-react";
export function RichEditor({ value, onChange, csrf, onUploadActivity, editable = true }: {
    csrf: string;
    onUploadActivity?: (active: boolean) => void;
    value: string;
    onChange: (html: string) => void;
    editable?: boolean;
}) {
    const [choosingImage, setChoosingImage] = useState(false);
    const editor = useEditor({ extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image], content: value, editable, immediatelyRender: false, onUpdate: ({ editor }) => onChange(editor.getHTML()), editorProps: { attributes: { class: "rich-editor-content prose", "aria-label": "Content editor", role: "textbox", "aria-multiline": "true" } } });
    if (!editor)
        return <div className="skeleton" style={{ height: 250 }}/>;
    const buttons = [{ label: "Bold", Icon: Bold, active: editor.isActive("bold"), run: () => editor.chain().focus().toggleBold().run() }, { label: "Italic", Icon: Italic, active: editor.isActive("italic"), run: () => editor.chain().focus().toggleItalic().run() }, { label: "Heading 2", Icon: Heading2, active: editor.isActive("heading", { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() }, { label: "Heading 3", Icon: Heading3, active: editor.isActive("heading", { level: 3 }), run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() }, { label: "Bullet list", Icon: List, active: editor.isActive("bulletList"), run: () => editor.chain().focus().toggleBulletList().run() }, { label: "Numbered list", Icon: ListOrdered, active: editor.isActive("orderedList"), run: () => editor.chain().focus().toggleOrderedList().run() }, { label: "Quote", Icon: Quote, active: editor.isActive("blockquote"), run: () => editor.chain().focus().toggleBlockquote().run() }, { label: "Code block", Icon: Code, active: editor.isActive("codeBlock"), run: () => editor.chain().focus().toggleCodeBlock().run() }];
    return <div className="rich-editor"><div className="editor-toolbar">{buttons.map(b => <button type="button" key={b.label} title={b.label} aria-label={b.label} aria-pressed={b.active} className={b.active ? "active" : ""} onClick={b.run}><b.Icon size={17}/></button>)}<button type="button" title="Add link" aria-label="Add link" onClick={() => {
            const url = prompt("Link URL (https://)", String(editor.getAttributes("link").href || ""));
            if (url === null)
                return;
            if (!url)
                editor.chain().focus().unsetLink().run();
            else if (/^https?:\/\//.test(url))
                editor.chain().focus().setLink({ href: url }).run();
        }}><LinkIcon size={17}/></button><button type="button" title="Insert image" aria-label="Insert image" disabled={!editable} onClick={() => setChoosingImage(true)}><ImageIcon size={17}/></button><button type="button" aria-label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo size={17}/></button><button type="button" aria-label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo size={17}/></button></div><EditorContent editor={editor}/>{choosingImage && <MediaChooser csrf={csrf} onUploadActivity={onUploadActivity} onClose={() => setChoosingImage(false)} onSelect={assets => { const asset = assets[0]; if (asset) editor.chain().focus().setImage({ src: imageUrl(asset), alt: asset.alt, title: asset.title }).run(); }}/>}</div>;
}
