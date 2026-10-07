"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    FileText,
    Code2,
    Layers,
    BriefcaseBusiness,
    BookOpen,
    Quote,
    Handshake,
    Users,
    Image as ImageIcon,
    Mail,
    Search,
    Settings,
    Globe,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
    Bell,
    ExternalLink,
    LogOut,
    ChevronDown,
    Boxes,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";

const nav = [
    ["Dashboard", "dashboard", LayoutDashboard],
    ["Pages", "pages", FileText],
    ["Services", "services", Code2],
    ["Solutions", "solutions", Layers],
    ["Portfolio", "portfolio", BriefcaseBusiness],
    ["Blog", "blog", BookOpen],
    ["Testimonials", "testimonials", Quote],
    ["Partners", "partners", Handshake],
    ["Team", "team", Users],
    ["Technologies", "technologies", Boxes],
    ["Media library", "media", ImageIcon],
    ["Contact messages", "contact-messages", Mail],
    ["SEO", "seo", Globe],
    ["Settings", "settings", Settings],
    ["Users & roles", "users", Users],
] as const;

export function AdminShell({
    children,
    name,
    role,
    unread,
    csrf,
}: {
    children: React.ReactNode;
    name: string;
    role: string;
    unread: number;
    csrf: string;
}) {
    const path = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobile, setMobile] = useState(false);
    const [query, setQuery] = useState("");
    const [profile, setProfile] = useState(false);

    async function logout() {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "x-csrf-token": csrf },
        });

        if (response.ok) {
            router.push("/admin/login");
            router.refresh();
        }
    }

    return (
        <div className={`admin-layout ${collapsed ? "collapsed" : ""}`}>
            <aside
                className={`admin-sidebar ${
                    mobile ? "mobile-open" : ""
                }`}
            >
                <Link
                    href="/admin/dashboard"
                    className="brand admin-brand"
                    aria-label="KODEA TECH dashboard"
                >
                    <BrandLogo priority />
                </Link>

                <span className="sidebar-caption">WORKSPACE</span>

                <nav aria-label="CMS navigation">
                    {nav
                        .filter(
                            ([, slug]) =>
                                role === "OWNER" ||
                                !["users", "settings"].includes(slug)
                        )
                        .map(([label, slug, Icon]) => (
                            <Link
                                key={slug}
                                href={`/admin/${slug}`}
                                className={
                                    path.startsWith(`/admin/${slug}`)
                                        ? "active"
                                        : ""
                                }
                                title={collapsed ? label : undefined}
                                onClick={() => setMobile(false)}
                            >
                                <Icon size={18} />
                                <span>{label}</span>

                                {slug === "contact-messages" &&
                                    unread > 0 && (
                                        <b className="sidebar-badge">
                                            {unread}
                                        </b>
                                    )}
                            </Link>
                        ))}
                </nav>

                <div className="sidebar-bottom">
                    <Link href="/" target="_blank">
                        <ExternalLink size={17} />
                        <span>View website</span>
                    </Link>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {collapsed ? (
                            <PanelLeftOpen size={18} />
                        ) : (
                            <PanelLeftClose size={18} />
                        )}
                        <span>Collapse sidebar</span>
                    </button>
                </div>
            </aside>

            {mobile && (
                <button
                    className="sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={() => setMobile(false)}
                />
            )}

            <div className="admin-workspace">
                <header className="admin-topbar">
                    <button
                        className="icon-button admin-menu"
                        aria-label="Toggle navigation"
                        onClick={() => setMobile(!mobile)}
                    >
                        {mobile ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="admin-search">
                        <Search size={17} />

                        <input
                            placeholder="Find a section…"
                            aria-label="Search CMS sections"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        {query && (
                            <div className="search-results">
                                {nav
                                    .filter(([name]) =>
                                        name
                                            .toLowerCase()
                                            .includes(query.toLowerCase())
                                    )
                                    .filter(
                                        ([, slug]) =>
                                            role === "OWNER" ||
                                            !["users", "settings"].includes(
                                                slug
                                            )
                                    )
                                    .map(([name, slug]) => (
                                        <Link
                                            key={slug}
                                            href={`/admin/${slug}`}
                                            onClick={() => setQuery("")}
                                        >
                                            {name}
                                        </Link>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="admin-topbar-actions">
                        <ThemeToggle />

                        <Link
                            href="/admin/contact-messages"
                            className="icon-button notification"
                            aria-label={`${unread} unread messages`}
                        >
                            <Bell size={19} />
                            {unread > 0 && <i />}
                        </Link>

                        <div className="profile-wrap">
                            <button
                                className="profile-button"
                                onClick={() => setProfile(!profile)}
                                aria-expanded={profile}
                            >
                                <span className="person-avatar">
                                    {name[0]}
                                </span>

                                <span>
                                    {name}
                                    <small>{role.toLowerCase()}</small>
                                </span>

                                <ChevronDown size={14} />
                            </button>

                            {profile && (
                                <div className="profile-menu">
                                    <button onClick={logout}>
                                        <LogOut size={16} />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="admin-main">{children}</main>

                <footer className="admin-footer">
                    KODEA TECH · Content workspace
                    <span>Build. Connect. Grow.</span>
                </footer>
            </div>
        </div>
    );
}
