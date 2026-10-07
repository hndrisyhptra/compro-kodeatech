export const resources = ["pages", "services", "solutions", "portfolio", "blog", "testimonials", "partners", "team", "technologies"] as const;
export type Resource = typeof resources[number];
export const resourceLabels: Record<Resource, string> = { pages: "Pages", services: "Services", solutions: "Solutions", portfolio: "Portfolio", blog: "Blog", testimonials: "Testimonials", partners: "Partners", team: "Team", technologies: "Technologies" };
export function isResource(s: string): s is Resource { return resources.includes(s as Resource); }
export interface ExtraField {
    key: string;
    label: string;
    kind?: "text" | "textarea" | "list" | "number" | "url" | "image" | "gallery";
    help?: string;
}
export const extraFields: Record<Resource, ExtraField[]> = {
    pages: [{ key: "eyebrow", label: "Eyebrow" }, { key: "sectionTitle", label: "Section title" }, { key: "sectionText", label: "Section text", kind: "textarea" }],
    services: [{ key: "icon", label: "Icon", help: "Code, Smartphone, Layers, Workflow, Network, Shield, Server, Cable, Headphones, Sparkles, Compass" }, { key: "benefits", label: "Benefits", kind: "list" }, { key: "features", label: "Features", kind: "list" }, { key: "technology", label: "Technologies", kind: "list" }, { key: "workflow", label: "Workflow steps", kind: "list" }, { key: "faq", label: "FAQ", kind: "list", help: "One question | answer per line" }],
    solutions: [{ key: "icon", label: "Icon" }, { key: "features", label: "Capabilities", kind: "list" }, { key: "benefits", label: "Outcomes", kind: "list" }],
    portfolio: [{ key: "client", label: "Client" }, { key: "category", label: "Category" }, { key: "challenge", label: "Challenge", kind: "textarea" }, { key: "solution", label: "Solution", kind: "textarea" }, { key: "result", label: "Results", kind: "textarea" }, { key: "metrics", label: "Metrics", kind: "list", help: "Value | label per line" }, { key: "technology", label: "Technologies", kind: "list" }, { key: "projectDate", label: "Project date" }, { key: "websiteUrl", label: "Website URL", kind: "url" }, { key: "thumbnail", label: "Thumbnail", kind: "image" }, { key: "gallery", label: "Project gallery", kind: "gallery" }, { key: "illustration", label: "Illustration style", help: "monitor, operations, network, automation, security" }, { key: "demo", label: "Demonstration case study (true/false)" }],
    blog: [{ key: "category", label: "Category" }, { key: "tags", label: "Tags", kind: "list" }, { key: "author", label: "Author display name" }, { key: "readTime", label: "Reading time" }],
    testimonials: [{ key: "position", label: "Position" }, { key: "company", label: "Company" }, { key: "rating", label: "Rating (1–5)", kind: "number" }, { key: "demo", label: "Demonstration testimonial (true/false)" }],
    partners: [{ key: "category", label: "Partner category" }, { key: "websiteUrl", label: "Website URL", kind: "url" }, { key: "demo", label: "Placeholder partner (true/false)" }],
    team: [{ key: "position", label: "Position" }, { key: "linkedin", label: "LinkedIn URL", kind: "url" }, { key: "instagram", label: "Instagram URL", kind: "url" }],
    technologies: [{ key: "category", label: "Category" }, { key: "symbol", label: "Short symbol" }]
};
