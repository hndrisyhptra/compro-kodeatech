"use client";
import { CheckCircle2, AlertCircle } from "lucide-react";
export function Notice({ notice }: {
    notice: {
        message: string;
        error: boolean;
    } | null;
}) { return notice ? <div className={`toast ${notice.error ? "error" : ""}`} role={notice.error ? "alert" : "status"}>{notice.error ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}<span>{notice.message}</span></div> : null; }
