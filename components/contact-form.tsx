"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
export function ContactForm({ services }: {
    services: string[];
}) {
    const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle"), [error, setError] = useState("");
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setState("loading");
        const form = new FormData(event.currentTarget);
        const data = Object.fromEntries(form.entries());
        try {
            const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.error);
            setState("success");
        }
        catch (e) {
            setState("error");
            setError(e instanceof Error ? e.message : "Something went wrong.");
        }
    }
    if (state === "success")
        return <div className="form-success" role="status"><CheckCircle2 size={40}/><h2>A great start.</h2><p>Thank you for reaching out. Your inquiry has been received and our team will be in touch.</p><button className="button secondary" onClick={() => setState("idle")}>Send another message</button></div>;
    return <form onSubmit={submit} className="contact-form"><div className="form-grid"><label>Your name *<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name"/></label><label>Company<input name="company" maxLength={150} autoComplete="organization" placeholder="Company name"/></label><label>Email address *<input type="email" name="email" required autoComplete="email" placeholder="you@company.com"/></label><label>Phone number<input name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="+62"/></label><label>What can we help with? *<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(s => <option key={s}>{s}</option>)}<option>Not sure yet — let’s discuss</option></select></label><label>Estimated budget<select name="budget" defaultValue=""><option value="">Let’s discuss</option><option>Under IDR 25 million</option><option>IDR 25–100 million</option><option>IDR 100–500 million</option><option>Above IDR 500 million</option></select></label></div><label>Tell us about your project *<textarea name="message" required minLength={20} maxLength={10000} rows={6} placeholder="Your idea, your challenge, and what a great result would look like…"/></label><div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div><p className="form-privacy">By sending this form, you agree to our <Link href="/privacy-policy">privacy policy</Link>.</p>{state === "error" && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={state === "loading"}>{state === "loading" ? <><Loader2 size={17} className="spin"/>Sending…</> : <>Send your message<ArrowUpRight size={17}/></>}</button></form>;
}
