"use client";
import { useState } from "react";
import { Mail, Search, Save, ArrowUpRight } from "lucide-react";
import type { ContactMessage } from "@prisma/client";
import { useAdmin } from "@/hooks/use-admin";
import { Notice } from "./notice";
export function Messages({ items, csrf, canWrite }: {
    items: ContactMessage[];
    csrf: string;
    canWrite: boolean;
}) {
    const [filter, setFilter] = useState("all"), [query, setQuery] = useState(""), [selected, setSelected] = useState<ContactMessage | null>(null), { request, busy, notice } = useAdmin(csrf);
    const visible = items.filter(m => (filter === "all" || m.status === filter) && `${m.name} ${m.email} ${m.company}`.toLowerCase().includes(query.toLowerCase()));
    return <><div className="admin-page-heading"><div><span className="eyebrow">GOOD CONVERSATIONS START HERE</span><h1>Contact messages</h1><p>Manage inquiries and keep track of your follow-up.</p></div><span className="badge unread">{items.filter(m => m.status === "unread").length} unread</span></div><div className="messages-layout"><section className="admin-panel"><div className="table-toolbar"><div className="input-search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} aria-label="Search messages" placeholder="Find a contact…"/></div><select aria-label="Filter message status" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option>{["unread", "read", "replied", "archived"].map(s => <option key={s}>{s}</option>)}</select></div><div className="message-list">{visible.map(m => <button key={m.id} className={selected?.id === m.id ? "active" : ""} onClick={async () => {
                setSelected(m);
                if (m.status === "unread" && canWrite) {
                    const result = await request("/api/admin/messages", { id: m.id, status: "read", notes: m.notes });
                    if (result)
                        setSelected({ ...m, status: "read" });
                }
            }}><span className="person-avatar">{m.name[0]}</span><div><strong>{m.name}<span className={`badge ${m.status}`}>{m.status}</span></strong><small>{m.company || m.email}</small><p>{m.message.slice(0, 95)}</p></div></button>)}{!visible.length && <div className="empty-state"><Mail size={28}/><h3>No messages here.</h3><p>New inquiries will appear when visitors contact you.</p></div>}</div></section><section className="admin-panel message-detail">{selected ? <><span className="eyebrow">{new Date(selected.createdAt).toLocaleString("en-US")}</span><h2>{selected.name}</h2><p>{selected.company}</p><div className="message-contact"><a href={`mailto:${selected.email}`}>{selected.email}</a>{selected.phone && <a href={`tel:${selected.phone}`}>{selected.phone}</a>}</div><div className="message-facts"><div><small>SERVICE</small><strong>{selected.service}</strong></div><div><small>BUDGET</small><strong>{selected.budget || "To discuss"}</strong></div></div><div className="message-body">{selected.message}</div><label>Status<select disabled={!canWrite} value={selected.status} onChange={e => setSelected({ ...selected, status: e.target.value })}>{["unread", "read", "replied", "archived"].map(s => <option key={s}>{s}</option>)}</select></label><label>Internal notes<textarea disabled={!canWrite} rows={4} value={selected.notes} onChange={e => setSelected({ ...selected, notes: e.target.value })}/></label>{canWrite && <button className="button" disabled={busy} onClick={() => request("/api/admin/messages", { id: selected.id, status: selected.status, notes: selected.notes })}><Save size={16}/>Save status & notes</button>}<a className="button secondary" href={`mailto:${selected.email}?subject=${encodeURIComponent("Your inquiry to KodeaTech")}`}>Reply by email<ArrowUpRight size={16}/></a><small className="muted">Email opens in your mail app. Mark the inquiry as replied after sending.</small></> : <div className="empty-state"><Mail size={32}/><h3>Select a conversation.</h3><p>Contact details, project information, and notes appear here.</p></div>}</section></div><Notice notice={notice}/></>;
}
