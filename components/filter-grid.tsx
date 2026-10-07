"use client";
import { useState } from "react";
import type { ContentRecord } from "@/types/content";
import { ProjectCard, BlogCard } from "./content-cards";
import { obj, stringValue } from "@/lib/utils";
export function FilterGrid({ items, kind }: {
    items: ContentRecord[];
    kind: "portfolio" | "blog";
}) { const [filter, setFilter] = useState("All"), [query, setQuery] = useState(""); const categories = ["All", ...new Set(items.map(i => stringValue(obj(i.data).category)).filter(Boolean))]; const visible = items.filter(i => (filter === "All" || obj(i.data).category === filter) && `${i.title} ${i.excerpt}`.toLowerCase().includes(query.toLowerCase())); return <><div className="filter-bar"><div className="filter-tabs">{categories.map(c => <button className={filter === c ? "active" : ""} aria-pressed={filter === c} key={c} onClick={() => setFilter(c)}>{c}</button>)}</div><input aria-label={`Search ${kind}`} placeholder={`Search ${kind === "blog" ? "insights" : "projects"}…`} value={query} onChange={e => setQuery(e.target.value)}/></div><div className={kind === "blog" ? "blog-grid" : "projects-grid"}>{visible.map(item => kind === "blog" ? <BlogCard key={item.id} item={item}/> : <ProjectCard key={item.id} item={item}/>)}</div>{!visible.length && <div className="empty-state"><h3>No results yet.</h3><p>Try a different search or category.</p></div>}</>; }
