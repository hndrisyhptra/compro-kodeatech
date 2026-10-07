import Link from "next/link";
export default function NotFound() { return <main className="error-page"><span className="eyebrow">404 — A LITTLE OFF TRACK</span><h1>Let’s find your way back.</h1><p>The page you are looking for doesn’t exist or hasn’t been published yet.</p><Link href="/" className="button">Back to KodeaTech</Link></main>; }
