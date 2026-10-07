import localFont from "next/font/local";
const geist = localFont({ src: "../public/fonts/Geist-Regular.ttf", variable: "--font-geist", display: "swap" });
import type { Metadata } from "next";
import { defaultFavicon } from "@/lib/branding";
import "./globals.css";
export const metadata: Metadata = { title: "KODEA TECH", description: "Technology that moves business forward.", icons: { icon: { url: defaultFavicon, type: "image/svg+xml", sizes: "any" } } };
export default function RootLayout({ children }: {
    children: React.ReactNode;
}) { return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{const t=localStorage.getItem('kodea-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch{}` }}/></head><body className={geist.variable}>{children}</body></html>; }
