"use client";
import { useEffect, useRef } from "react";
export function Confirm({ open, title = "Delete this item?", description = "This action cannot be undone.", onConfirm, onCancel }: {
    open: boolean;
    title?: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if (open)
            ref.current?.showModal();
        else
            ref.current?.close();
    }, [open]);
    return <dialog ref={ref} className="confirm-dialog" onCancel={onCancel}><h2>{title}</h2><p>{description}</p><div><button className="button secondary" autoFocus onClick={onCancel}>Cancel</button><button className="button danger" onClick={() => { onConfirm(); onCancel(); }}>Delete</button></div></dialog>;
}
