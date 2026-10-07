import { cleanHtml } from "@/lib/html";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, Phone, Check, Linkedin, Instagram } from "lucide-react";
import { listContent } from "@/services/content";
import { getSettings } from "@/services/settings";
import { pageMetadata } from "@/services/seo";
import { ServiceCard } from "@/components/content-cards";
import { ServiceIcon } from "@/components/icons";
import { FilterGrid } from "@/components/filter-grid";
import { Testimonials } from "@/components/testimonial-slider";
import { ContactForm } from "@/components/contact-form";
import { Stat, Reveal } from "@/components/motion";
import { obj, stringValue, safeUrl } from "@/lib/utils";
type Props = {
    params: Promise<{
        section: string;
    }>;
    searchParams: Promise<{
        lang?: string;
    }>;
};
async function dataFor(section: string, locale = "en") {
    const pages = await listContent("pages", true, locale);
    const page = pages.find(p => p.slug === section);
    if (!page)
        notFound();
    return page;
}
export async function generateMetadata({ params, searchParams }: Props) { const { section } = await params; const locale = (await searchParams).lang === "id" ? "id" : "en"; return pageMetadata(`/${section}`, await dataFor(section, locale)); }
export default async function Section({ params, searchParams }: Props) {
    const { section } = await params;
    const locale = (await searchParams).lang === "id" ? "id" : "en";
    const page = await dataFor(section, locale), settings = await getSettings();
    let body: React.ReactNode;
    if (section === "services") {
        const items = await listContent("services", true, locale);
        body = <div className="services-grid">{items.map((item, index) => <ServiceCard key={item.id} item={item} index={index}/>)}</div>;
    }
    else if (section === "portfolio" || section === "blog") {
        const items = await listContent(section, true, locale);
        body = <FilterGrid items={items} kind={section}/>;
    }
    else if (section === "solutions") {
        const items = await listContent("solutions", true, locale);
        body = <div className="solutions-grid">{items.map((item, i) => <Link className="solution-card" href={`/solutions/${item.slug}`} key={item.id}><span className="eyebrow">0{i + 1}</span>{item.image ? <Image className="solution-image" src={item.image} alt={item.title} width={600} height={340} sizes="(max-width: 768px) 100vw, 50vw"/> : <ServiceIcon name={stringValue(obj(item.data).icon)} size={36}/>}<h2>{item.title}</h2><p>{item.excerpt}</p><span className="card-link">Explore solution<ArrowUpRight size={18}/></span></Link>)}</div>;
    }
    else if (section === "testimonials")
        body = <Testimonials items={await listContent("testimonials", true, locale)}/>;
    else if (section === "partners") {
        const items = await listContent("partners", true, locale);
        body = <div className="partners-grid">{items.map(p => <article className="partner-card" key={p.id}>{p.image ? <Image src={p.image} alt={p.title} width={170} height={65}/> : <h2>{p.title}</h2>}<span className="eyebrow">{stringValue(obj(p.data).category)}</span><p>{p.excerpt}</p>{stringValue(obj(p.data).websiteUrl) && <a className="text-button" href={safeUrl(stringValue(obj(p.data).websiteUrl))} target="_blank" rel="noopener noreferrer">Visit partner<ArrowUpRight size={15}/></a>}</article>)}</div>;
    }
    else if (section === "contact") {
        const services = await listContent("services", true, locale);
        const maps = settings.mapsUrl.startsWith("https://www.google.com/maps/embed") ? settings.mapsUrl : "";
        body = <div className="contact-layout"><aside><h2>Good things start<br />with a conversation.</h2><a href={`mailto:${settings.email}`}><Mail size={20}/><div><small>EMAIL US</small>{settings.email}</div></a>{settings.phone && <a href={`tel:${settings.phone}`}><Phone size={20}/><div><small>CALL US</small>{settings.phone}</div></a>}<div className="contact-address"><MapPin size={20}/><div><small>FIND US</small>{settings.address}</div></div><a className="text-button" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer">Prefer WhatsApp?<ArrowUpRight size={17}/></a>{maps && <iframe src={maps} title="Office location" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>}</aside><ContactForm services={services.map(s => s.title)}/></div>;
    }
    else if (section === "about") {
        const team = await listContent("team", true, locale);
        body = <><div className="about-page-grid"><h2>Thoughtful people.<br />Useful technology.<br /><span className="blue">Lasting partnerships.</span></h2><div className="prose" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }}/></div><div className="stats-grid">{settings.stats.map(s => <Stat key={s.label} {...s}/>)}</div><div className="about-values">{[["Understand first", "We start with the business challenge and the people behind it."], ["Build with purpose", "Every technical decision should contribute to a useful result."], ["Stay connected", "Good delivery continues with clear handover and dependable support."]].map(([title, text]) => <article key={title}><Check className="blue"/><h3>{title}</h3><p>{text}</p></article>)}</div><div className="section-heading"><div><span className="eyebrow">THE PEOPLE BEHIND THE WORK</span><h2>Meet the team.</h2></div></div><div className="team-grid">{team.map(t => <article key={t.id} className="team-card">{t.image ? <Image src={t.image} alt={t.title} width={500} height={450}/> : <div className="team-placeholder"><ServiceIcon name={t.sortOrder === 0 ? "Code" : t.sortOrder === 1 ? "Network" : "Compass"} size={70}/></div>}<h3>{t.title}</h3><span>{stringValue(obj(t.data).position)}</span><p>{t.excerpt}</p><div className="social-links">{stringValue(obj(t.data).linkedin) && <a href={safeUrl(stringValue(obj(t.data).linkedin))} aria-label={`${t.title} LinkedIn`}><Linkedin size={18}/></a>}{stringValue(obj(t.data).instagram) && <a href={safeUrl(stringValue(obj(t.data).instagram))} aria-label={`${t.title} Instagram`}><Instagram size={18}/></a>}</div></article>)}</div></>;
    }
    else if (section === "careers")
        body = <div className="careers-box"><span className="eyebrow">LET’S BUILD WHAT’S NEXT</span><h2>Your next chapter<br />could start here.</h2><div className="prose" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }}/><a href={`mailto:${settings.email}?subject=Career%20inquiry`} className="button">Introduce yourself<ArrowUpRight size={18}/></a></div>;
    else
        body = <article className="prose legal-copy" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }}/>;
    return <><section lang={locale} className="page-hero container"><Reveal><span className="eyebrow"><span className="blue-square"/>{stringValue(obj(page.data).eyebrow)}</span><h1>{page.title}</h1><p>{page.excerpt}</p></Reveal>{page.image && <Image className="page-cover-image" src={page.image} alt={page.title} width={1400} height={650} sizes="100vw" priority/>}</section><section lang={locale} className="container section page-content">{["services", "solutions", "portfolio", "blog", "testimonials", "partners", "contact"].includes(section) && page.content !== `<p>${page.excerpt}</p>` && <div className="prose page-intro" dangerouslySetInnerHTML={{ __html: cleanHtml(page.content) }}/>}{body}</section></>;
}
