import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ContentRecord } from "@/types/content";
import { ServiceIcon } from "./icons";
import { ProjectArt } from "./project-art";
import { obj, stringValue } from "@/lib/utils";
export function ServiceCard({ item, index = 0 }: {
    item: ContentRecord;
    index?: number;
}) { return <Link href={`/services/${item.slug}`} className="service-card"><div className="service-card-top"><span className="service-icon"><ServiceIcon name={stringValue(obj(item.data).icon)}/></span><span className="card-number">{String(index + 1).padStart(2, "0")}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><span className="card-link">Explore service <ArrowUpRight size={17}/></span></Link>; }
export function ProjectCard({ item }: {
    item: ContentRecord;
}) { const data = obj(item.data), thumbnail = stringValue(data.thumbnail) || item.image; return <Link className="project-card" href={`/portfolio/${item.slug}`}><div className="project-image">{thumbnail ? <Image src={thumbnail} alt={item.title} width={900} height={560} sizes="(max-width: 768px) 100vw, 50vw"/> : <ProjectArt variant={stringValue(data.illustration)}/>}<span className="project-open"><ArrowUpRight size={19}/></span></div><div className="project-meta"><span>{stringValue(data.category)}</span><span>{data.demo === "true" ? "CONCEPT CASE STUDY" : stringValue(data.projectDate)}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p></Link>; }
export function BlogCard({ item }: {
    item: ContentRecord;
}) { const data = obj(item.data); return <Link href={`/blog/${item.slug}`} className="blog-card"><div className="blog-art">{item.image ? <Image src={item.image} alt={item.title} width={600} height={360} sizes="(max-width: 768px) 100vw, 33vw"/> : <><span className="blog-art-grid"/><span>{stringValue(data.category) === "Infrastructure" ? <ServiceIcon name="Network" size={68}/> : stringValue(data.category) === "Engineering" ? <ServiceIcon name="Code" size={68}/> : <ServiceIcon name="Workflow" size={68}/>}</span><small>KODEA JOURNAL / {String(item.sortOrder + 1).padStart(2, "0")}</small></>}</div><div className="blog-meta"><span>{stringValue(data.category)}</span><span>{stringValue(data.readTime)}</span></div><h3>{item.title}</h3><p>{item.excerpt}</p><span className="card-link">Read the story <ArrowRight size={16}/></span></Link>; }
