"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { BrandLogo } from "./brand-logo";
const links = [["Company", "/about"], ["Services", "/services"], ["Solutions", "/solutions"], ["Our work", "/portfolio"], ["Insights", "/blog"]];
export function Navigation({ companyName, logo }: {
    companyName: string;
    logo: string;
}) {
    const path = usePathname();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open)
            return;
        const escape = (e: KeyboardEvent) => {
            if (e.key === "Escape")
                setOpen(false);
        };
        document.addEventListener("keydown", escape);
        return () => document.removeEventListener("keydown", escape);
    }, [open]);
    return <header className="site-header"><div className="container header-inner"><Link href="/" aria-label={`${companyName} home`} className="brand">{logo ? <Image src={logo} alt={companyName} width={150} height={40}/> : <BrandLogo name={companyName} priority/>}</Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, url]) => <Link key={url} href={url} aria-current={path === url ? "page" : undefined}>{label}</Link>)}</nav><div className="header-actions"><ThemeToggle /><Link href="/contact" className="button small">Let’s talk <ArrowUpRight size={16}/></Link><button className="icon-button mobile-menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div></div>{open && <nav id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav">{links.map(([label, url]) => <Link key={url} href={url} onClick={() => setOpen(false)}>{label}<ArrowUpRight size={18}/></Link>)}<Link href="/contact" onClick={() => setOpen(false)}>Start a project <ArrowUpRight size={18}/></Link></nav>}</header>;
}
