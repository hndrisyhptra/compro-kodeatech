"use client";
import { motion, useReducedMotion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
export function Reveal({ children, className = "" }: {
    children: React.ReactNode;
    className?: string;
}) { const reduced = useReducedMotion(); return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .55, ease: "easeOut" }}>{children}</motion.div>; }
export function Stat({ value, label }: {
    value: string;
    label: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const visible = useInView(ref, { once: true });
    const reduced = useReducedMotion();
    const [number, setNumber] = useState(0);
    const numeric = /^\d+\+?$/.test(value);
    useEffect(() => {
        if (!visible || !numeric || reduced)
            return;
        const control = animate(0, parseInt(value), { duration: 1.4, onUpdate: v => setNumber(Math.round(v)) });
        return () => control.stop();
    }, [visible, value, numeric, reduced]);
    return <div ref={ref} className="stat"><strong>{numeric && !reduced ? (number.toString().padStart(value.startsWith("0") ? 2 : 1, "0") + (value.endsWith("+") ? "+" : "")) : value}</strong><span>{label}</span></div>;
}
