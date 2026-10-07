import { PublicShell } from "@/components/public-shell";
import { getSettings } from "@/services/settings";
import { listContent } from "@/services/content";
import { jsonLd, siteUrl } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function Layout({ children }: {
    children: React.ReactNode;
}) { const [settings, services] = await Promise.all([getSettings(), listContent("services", true)]); return <PublicShell settings={settings} services={services}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Organization", name: settings.companyName, url: siteUrl(), email: settings.email, ...(settings.logo ? { logo: new URL(settings.logo, siteUrl()).toString() } : {}), sameAs: [settings.linkedin, settings.instagram, settings.github].filter(Boolean) }) }}/>{children}</PublicShell>; }
