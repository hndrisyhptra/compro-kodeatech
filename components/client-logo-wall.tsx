"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ContentRecord } from "@/types/content";

type ClientLogo = Pick<ContentRecord, "id" | "title" | "image">;
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
    const media = window.matchMedia(motionQuery);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}
function subscribeToVisibility(callback: () => void) {
    document.addEventListener("visibilitychange", callback);
    return () => document.removeEventListener("visibilitychange", callback);
}

export function ClientLogoWall({ items }: { items: ClientLogo[] }) {
    const viewport = useRef<HTMLDivElement>(null);
    const group = useRef<HTMLUListElement>(null);
    const drag = useRef<{ x: number; scroll: number } | null>(null);
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const [dragging, setDragging] = useState(false);
    const reducedMotion = useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => false);
    const pageVisible = useSyncExternalStore(subscribeToVisibility, () => !document.hidden, () => true);
    const canSlide = items.length > 1;
    // Each group exceeds the viewport, even with only a few published partners.
    const repeated = canSlide ? Array.from({ length: Math.ceil(6 / items.length) }, () => items).flat() : items;

    useEffect(() => {
        const element = viewport.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const element = viewport.current;
        const firstGroup = group.current;
        if (!element || !firstGroup || !canSlide || !visible || !pageVisible || paused || hovered || focused || reducedMotion) return;
        let loopWidth = firstGroup.getBoundingClientRect().width;
        let lastTime = 0;
        let frame = 0;
        const resize = new ResizeObserver(() => { loopWidth = firstGroup.getBoundingClientRect().width; });
        resize.observe(firstGroup);
        function tick(time: number) {
            if (lastTime && loopWidth > 0) {
                // A constant 20 pixels per second gives a gentle, uninterrupted movement.
                element!.scrollLeft = (element!.scrollLeft + Math.min(time - lastTime, 64) * 0.02) % loopWidth;
            }
            lastTime = time;
            frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(frame); resize.disconnect(); };
    }, [canSlide, visible, pageVisible, paused, hovered, focused, reducedMotion]);

    function move(direction: number) {
        const element = viewport.current;
        const firstGroup = group.current;
        if (!element || !firstGroup) return;
        setPaused(true);
        const logo = firstGroup.firstElementChild;
        const step = logo ? logo.getBoundingClientRect().width + parseFloat(getComputedStyle(firstGroup).gap) : 250;
        const loopWidth = firstGroup.getBoundingClientRect().width;
        if (loopWidth > 0) {
            if (direction < 0 && element.scrollLeft < step) element.scrollLeft += loopWidth;
            else if (element.scrollLeft >= loopWidth) element.scrollLeft %= loopWidth;
        }
        element.scrollBy({ left: step * direction, behavior: reducedMotion ? "auto" : "smooth" });
    }

    function logos(duplicate: boolean) {
        return <ul ref={duplicate ? undefined : group} className="client-logo-group" aria-hidden={duplicate || undefined}>
            {repeated.map((item, index) => <li className="client-logo-item" key={`${item.id}:${index}`} aria-hidden={duplicate || index >= items.length || undefined}>
                {item.image ? <Image src={item.image} alt={duplicate || index >= items.length ? "" : item.title} width={440} height={200} sizes="(max-width: 600px) 176px, 220px" draggable={false}/> : <span className="client-logo-name">{item.title}</span>}
            </li>)}
        </ul>;
    }

    if (!items.length) return null;
    return <div className="client-logo-carousel" role="region" aria-roledescription="carousel" aria-label="Client and partner logos">
        <div ref={viewport} className={`client-logo-viewport ${dragging ? "is-dragging" : ""} ${!canSlide ? "is-static" : ""}`} tabIndex={canSlide ? 0 : undefined} aria-label="Client logos. Use left and right arrow keys to browse." onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onWheel={() => setPaused(true)} onKeyDown={e => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); move(e.key === "ArrowLeft" ? -1 : 1); }
        }} onPointerDown={e => {
            setPaused(true);
            if (e.pointerType === "mouse" && e.button === 0) {
                drag.current = { x: e.clientX, scroll: e.currentTarget.scrollLeft };
                setDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
            }
        }} onPointerMove={e => {
            if (!drag.current) return;
            e.preventDefault();
            e.currentTarget.scrollLeft = drag.current.scroll + drag.current.x - e.clientX;
        }} onPointerUp={e => {
            drag.current = null;
            setDragging(false);
            if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
        }} onPointerCancel={() => { drag.current = null; setDragging(false); }} onLostPointerCapture={() => { drag.current = null; setDragging(false); }}>
            <div className="client-logo-track">{logos(false)}{canSlide && logos(true)}</div>
        </div>
        {canSlide && <div className="client-logo-footer"><small>Drag to explore</small><div className="client-logo-controls">
            <button type="button" className="icon-button" aria-label="Previous client logos" onClick={() => move(-1)}><ArrowLeft size={17}/></button>
            <button type="button" className="client-logo-play" disabled={reducedMotion} aria-label={reducedMotion ? "Automatic scrolling disabled by reduced motion preference" : paused ? "Resume automatic logo scrolling" : "Pause automatic logo scrolling"} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused || reducedMotion ? <Play size={14}/> : <Pause size={14}/>}<span>{reducedMotion ? "Auto off" : paused ? "Play" : "Pause"}</span></button>
            <button type="button" className="icon-button" aria-label="Next client logos" onClick={() => move(1)}><ArrowRight size={17}/></button>
        </div></div>}
    </div>;
}
