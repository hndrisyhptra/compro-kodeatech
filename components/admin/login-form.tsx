"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
export function LoginForm() {
    const [busy, setBusy] = useState(false), [error, setError] = useState(""), [show, setShow] = useState(false), router = useRouter();
    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const form = new FormData(e.currentTarget);
            const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.error);
            router.push("/admin/dashboard");
            router.refresh();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "Could not sign in.");
        }
        finally {
            setBusy(false);
        }
    }
    return <form onSubmit={submit} className="login-form"><label>Email address<input name="email" type="email" required autoComplete="username" placeholder="you@kodeatech.cloud"/></label><label>Password<div className="password-input"><input name="password" type={show ? "text" : "password"} required autoComplete="current-password"/><button type="button" className="icon-button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={busy}>{busy ? <Loader2 size={18} className="spin"/> : <>Sign in to your workspace<ArrowRight size={18}/></>}</button><p className="muted">Access is restricted to authorized team members.</p></form>;
}
