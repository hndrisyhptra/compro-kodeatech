"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function useAdmin(csrf: string) {
    const [busy, setBusy] = useState(false), [notice, setNotice] = useState<{
        message: string;
        error: boolean;
    } | null>(null);
    const router = useRouter();
    async function request(url: string, data: unknown, method = "POST") {
        setBusy(true);
        setNotice(null);
        try {
            const form = data instanceof FormData;
            const response = await fetch(url, { method, headers: { "x-csrf-token": csrf, ...(!form ? { "Content-Type": "application/json" } : {}) }, body: form ? data : JSON.stringify(data) });
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.error || "Request failed");
            setNotice({ message: method === "DELETE" ? "Deleted successfully." : "Saved successfully.", error: false });
            router.refresh();
            return result as unknown;
        }
        catch (e) {
            setNotice({ message: e instanceof Error ? e.message : "Something went wrong.", error: true });
            return null;
        }
        finally {
            setBusy(false);
        }
    }
    return { request, busy, notice, router };
}
