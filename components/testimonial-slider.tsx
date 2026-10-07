"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { ProfilePhoto } from "@/components/profile-photo";
import type { ContentRecord } from "@/types/content";
import { obj, stringValue } from "@/lib/utils";

const cardsPerPage = 3;

export function Testimonials({ items }: { items: ContentRecord[] }) {
    const [page, setPage] = useState(0);
    if (!items.length)
        return <p className="muted">Client perspectives will be published here.</p>;

    const pageCount = Math.ceil(items.length / cardsPerPage);
    const currentPage = page % pageCount;
    const visibleItems = items.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage);

    return <div className="testimonials">
        <div className="testimonials-grid" aria-live="polite" aria-atomic="true">
            {visibleItems.map(item => {
                const data = obj(item.data);
                const rating = Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5)));
                const role = [stringValue(data.position), stringValue(data.company)].filter(Boolean).join(" · ");

                return <article className="testimonial-card" key={item.id}>
                    <div className="testimonial-card-top">
                        <Quote size={28} className="blue" aria-hidden="true"/>
                        <div className="stars" aria-label={`${rating} out of 5 stars`}>
                            {Array.from({ length: rating }, (_, index) => <Star key={index} size={14} fill="currentColor" aria-hidden="true"/>)}
                        </div>
                    </div>
                    <blockquote>“{item.excerpt}”</blockquote>
                    <div className="quote-person">
                        {item.image ? <ProfilePhoto src={item.image} alt={item.title} crop={data.photoCrop}/> : <span className="person-avatar" aria-hidden="true">{item.title[0]}</span>}
                        <div><strong>{item.title}</strong>{role && <small>{role}</small>}</div>
                    </div>
                    
                </article>;
            })}
        </div>
        {pageCount > 1 && <div className="testimonial-pagination">
            <button type="button" className="icon-button" aria-label="Previous testimonials" onClick={() => setPage((currentPage - 1 + pageCount) % pageCount)}><ArrowLeft size={18}/></button>
            <span>{String(currentPage + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span>
            <button type="button" className="icon-button" aria-label="Next testimonials" onClick={() => setPage((currentPage + 1) % pageCount)}><ArrowRight size={18}/></button>
        </div>}
    </div>;
}
