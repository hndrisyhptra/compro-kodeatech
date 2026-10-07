"use client";
import { motion, useReducedMotion } from "framer-motion";
export default function Template({ children }: {
    children: React.ReactNode;
}) { const reduced = useReducedMotion(); return <motion.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28, ease: "easeOut" }}>{children}</motion.div>; }
