"use client";
import Script from "next/script";
import { useSyncExternalStore } from "react";
const subscribe = (fn: () => void) => { window.addEventListener("kodea-consent", fn); return () => window.removeEventListener("kodea-consent", fn); };
export function Analytics({ id }: {
    id: string;
}) {
    const consent = useSyncExternalStore(subscribe, () => localStorage.getItem("kodea-analytics") || "", () => "");
    if (!/^G-[A-Z0-9]+$/.test(id))
        return null;
    function choose(v: string) { localStorage.setItem("kodea-analytics", v); window.dispatchEvent(new Event("kodea-consent")); }
    if (consent === "no")
        return null;
    if (consent !== "yes")
        return <div className="consent-box"><p>Allow anonymous analytics to help improve this website?</p><button onClick={() => choose("yes")} className="button small">Allow</button><button onClick={() => choose("no")} className="button secondary small">Decline</button></div>;
    return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive"/><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}</Script></>;
}
