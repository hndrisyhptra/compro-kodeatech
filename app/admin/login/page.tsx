import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Admin sign in · KODEA TECH",
    robots: { index: false, follow: false },
};

export default async function Login() {
    if (await getSession()) redirect("/admin/dashboard");

    return (
        <main className="login-page">
            <div className="login-top">
                <Link href="/" className="brand" aria-label="KODEA TECH home">
                    <BrandLogo priority />
                </Link>

                <ThemeToggle />
            </div>

            <div className="login-card">
                <span className="eyebrow">KODEA CONTENT WORKSPACE</span>
                <h1>Welcome back.</h1>
                <p>Good work starts here.</p>
                <LoginForm />
            </div>

            <footer>© {new Date().getFullYear()} KODEA TECH</footer>
        </main>
    );
}
