"use client";
export default function ErrorPage({ reset }: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) { return <div className="error-page"><span className="eyebrow">LET’S TRY THAT AGAIN</span><h1>We couldn’t load this page.</h1><p>Please try again in a moment. If you are setting up this project, check the database connection and run the migrations and seed.</p><button onClick={reset} className="button">Try again</button></div>; }
