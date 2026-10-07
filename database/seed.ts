import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { slugify } from "../lib/utils";
export async function seedDatabase(db: PrismaClient) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password || password.length < 12 || password.includes("REPLACE_"))
        throw new Error("Set SEED_ADMIN_EMAIL and a unique SEED_ADMIN_PASSWORD (12+ characters) in .env.");
    for (const name of ["OWNER", "EDITOR", "VIEWER"])
        await db.role.upsert({ where: { name }, update: {}, create: { name } });
    const owner = await db.role.findUniqueOrThrow({ where: { name: "OWNER" } });
    const admin = await db.user.upsert({ where: { email }, update: {}, create: { email, name: "Kodea Administrator", passwordHash: await hash(password, 12), roleId: owner.id } });
    const settings = { companyName: "KODEA TECH", tagline: "Technology that works for your business.", logo: "", favicon: "", email: "hello@kodeatech.cloud", phone: "", whatsapp: "6281234567890", address: "Indonesia · Working with teams everywhere", mapsUrl: "", linkedin: "", instagram: "", github: "", copyright: "KODEA TECH. All rights reserved.", heroLabel: "ENGINEERED FOR YOUR NEXT CHAPTER", heroTitle: "Good technology.", heroAccent: "Great possibilities.", heroSubtitle: "From your first idea to your next big milestone. We build digital products and IT infrastructure that move your business forward.", ctaLabel: "Start a project", ctaUrl: "/contact", secondaryCtaLabel: "Explore our solutions", secondaryCtaUrl: "/solutions", aboutTitle: "Technology that solves real business problems.", aboutText: "KodeaTech brings software engineering, digital solutions, and IT infrastructure together. We help businesses turn ambitious ideas into reliable systems — thoughtfully designed, carefully built, and supported for the long run.", stats: [{ value: "11", label: "Specialist services" }, { value: "08", label: "Solution areas" }, { value: "15", label: "Core technologies" }, { value: "24/7", label: "Support options" }], technologiesIntro: "The right tools for the job. Proven technology, chosen around your needs.", gaId: "", searchVerification: "", seoTitle: "KODEA TECH — Technology That Moves Business Forward", seoDescription: "Software engineering, digital solutions, and dependable IT infrastructure. KodeaTech helps businesses build, connect, and grow.", ogImage: "", supportLabel: "Built for today. Ready for tomorrow." };
    await db.setting.upsert({ where: { key: "general" }, update: {}, create: { key: "general", value: settings } });
    const base = (title: string, excerpt: string, data: Prisma.InputJsonValue = {}, index = 0) => ({ title, slug: slugify(title), locale: "en", excerpt, content: `<p>${excerpt}</p>`, image: "", status: "published", featured: true, sortOrder: index, data, seoTitle: title, seoDescription: excerpt, ogImage: "", canonical: "", keywords: "", publishedAt: new Date() });
    const services = [
        ["Web Application Development", "Fast, intuitive web applications built around the way your business works.", "Code", "React, Next.js, TypeScript"],
        ["Mobile Application Development", "Useful mobile experiences that connect your business to people on the move.", "Smartphone", "React Native, Flutter, REST APIs"],
        ["Custom Software Development", "Purpose-built software for the challenges off-the-shelf products cannot solve.", "Layers", "Node.js, Laravel, MySQL"],
        ["IT Tools & Automation", "Less repetitive work. More time to focus on what matters.", "Workflow", "Node.js, Python, REST APIs"],
        ["Network & Internet Infrastructure", "Stable connectivity that keeps your people, systems, and operations connected.", "Network", "Mikrotik, Cisco, Linux"],
        ["CCTV & Security System", "Thoughtfully designed security and monitoring for your physical spaces.", "Shield", "IP cameras, NVR, Network monitoring"],
        ["IT Infrastructure", "Reliable foundations for business-critical applications and everyday operations.", "Server", "Linux, Docker, Cloud"],
        ["System Integration", "Bring separate tools and data together into one connected business.", "Cable", "REST APIs, MySQL, Redis"],
        ["IT Maintenance & Support", "Practical, responsive support that helps your technology keep performing.", "Headphones", "Monitoring, Linux, Network tools"],
        ["Digital Transformation", "Turn business goals into a practical roadmap for meaningful digital change.", "Sparkles", "Process design, Analytics, Cloud"],
        ["IT Consulting", "Clear technical advice to make confident decisions about your next investment.", "Compass", "Architecture, Security, Infrastructure"]
    ];
    for (const [i, [title, excerpt, icon, tech]] of services.entries()) {
        const record = base(title, excerpt, { icon, benefits: ["A solution designed around your business", "A dependable foundation that can grow with you", "Clear ownership, documentation, and ongoing support"], features: ["Discovery and requirements mapping", "Architecture and implementation", "Testing, security review, and handover", "Maintenance and continuous improvement"], technology: tech.split(", "), workflow: ["Discover your goals", "Design the right solution", "Build and validate", "Launch and support"], faq: ["How do we get started? | Tell us about your goals and we will arrange a discovery conversation.", "Can you work with existing systems? | Yes. We assess your current environment and plan integrations around your needs.", "Do you provide ongoing support? | Support scope and response times are agreed as part of your project."] }, i);
        await db.service.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
    }
    const solutions = [["Business Application", "Bring your business processes into one intuitive workspace.", "Layers"], ["Digital Monitoring", "Understand what is happening across your operations in real time.", "Activity"], ["Workflow Automation", "Connect tasks, reduce manual work, and keep progress moving.", "Workflow"], ["Network Infrastructure", "Build stable, secure connectivity across locations and teams.", "Network"], ["Security & CCTV", "Protect your spaces with clear visibility and connected security.", "Shield"], ["Data & Analytics", "Turn operational information into useful business decisions.", "ChartNoAxesCombined"], ["Cloud & Server", "Deploy your applications on a reliable, scalable foundation.", "Cloud"], ["System Integration", "Connect your existing tools without losing what already works.", "Cable"]];
    for (const [i, [title, excerpt, icon]] of solutions.entries()) {
        const record = base(title, excerpt, { icon, features: ["Business discovery", "Solution architecture", "Implementation and training"], benefits: ["Clearer visibility", "More efficient operations", "A foundation for growth"] }, i);
        await db.solution.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
    }
    for (const [i, title] of ["React", "Next.js", "Laravel", "PHP", "Node.js", "TypeScript", "JavaScript", "MySQL", "PostgreSQL", "Redis", "Docker", "Linux", "Mikrotik", "Cisco", "Cloud"].entries()) {
        const record = base(title, `Part of our technology toolkit.`, { symbol: title.slice(0, 2), category: i < 7 ? "Development" : i < 10 ? "Data" : "Infrastructure" }, i);
        await db.technology.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
    }
    const projects = [["Enterprise Monitoring Platform", "A clearer view of complex operations.", "Digital platforms", "monitor"], ["Digital Operation Management", "One workspace. A more connected team.", "Business software", "operations"], ["Network Infrastructure Deployment", "A dependable network for distributed operations.", "Infrastructure", "network"], ["Business Workflow Automation", "Move from manual processes to connected workflows.", "Automation", "automation"], ["CCTV & Security Infrastructure", "Visibility and security, working together.", "Security systems", "security"]];
    for (const [i, [title, excerpt, category, illustration]] of projects.entries()) {
        const record = base(title, excerpt, { client: "Demonstration project", category, challenge: "Teams need better visibility across disconnected processes and systems. This demonstration explores a practical approach to bringing that information together.", solution: "A central platform combines a focused interface, reliable data flows, and clear operational workflows. The architecture is designed to support future integrations.", result: "This example illustrates the delivery approach and intended business outcomes. No client-specific performance claims are made.", metrics: ["01 | Connected workspace", "04 | Delivery phases"], technology: ["Next.js", "TypeScript", "MySQL"], projectDate: "2026", websiteUrl: "", thumbnail: "", gallery: [], illustration, demo: "true" }, i);
        await db.portfolio.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
    }
    const articles = [
        ["Great software starts with better questions", "Before choosing a framework, get clear on the problem you are solving.", "Engineering", "6 min read", `<h2>Start with the business</h2><p>A successful digital product begins with understanding the people who will use it. Map their current workflow, ask where time is lost, and agree on what a better outcome would look like.</p><h2>Make the scope measurable</h2><p>Choose a few concrete outcomes: fewer manual steps, faster reporting, or more reliable information. These goals help a team decide what belongs in the first release.</p><blockquote>Good discovery turns a long feature list into a clear product direction.</blockquote><h2>Build in small, useful increments</h2><p>Validate the most important workflow early. Bring users into the process, keep decisions visible, and use real feedback to shape the next iteration.</p>`],
        ["Building an IT foundation that grows with you", "A practical approach to networks, servers, and business continuity.", "Infrastructure", "5 min read", `<h2>Reliability is a design decision</h2><p>A dependable infrastructure starts with understanding your critical systems. Document which applications your team uses, who needs access, and what happens when a connection fails.</p><h2>Plan for operations</h2><p>Monitoring, tested backups, clear access control, and documented recovery steps matter as much as the initial deployment.</p><h2>Keep the architecture understandable</h2><p>Choose tools your team can maintain. Record configurations, review capacity regularly, and agree on support responsibilities before launch.</p>`],
        ["The real value of workflow automation", "How to choose the repetitive tasks worth automating first.", "Digital transformation", "4 min read", `<h2>Follow the work</h2><p>Look for tasks that repeat often and follow predictable rules. Data entry, status updates, and routine notifications are useful places to start.</p><h2>Improve before automating</h2><p>Remove unnecessary steps first. Automating an unclear process can make the same problems happen faster.</p><h2>Keep people in control</h2><p>Make exceptions visible, provide a way to review changes, and measure how much time the new process actually saves.</p>`]
    ];
    for (const [i, [title, excerpt, category, readTime, content]] of articles.entries()) {
        const categoryRow = await db.blogCategory.upsert({ where: { name: category }, update: {}, create: { name: category, slug: slugify(category) } });
        const tagRow = await db.blogTag.upsert({ where: { name: category }, update: {}, create: { name: category, slug: slugify(category) } });
        const record = { ...base(title, excerpt, { category, tags: [category, "Technology"], author: "KodeaTech Editorial", readTime }, i), content, authorId: admin.id, categoryId: categoryRow.id };
        const post = await db.blogPost.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
        await db.blogPost.update({ where: { id: post.id }, data: { tags: { connect: { id: tagRow.id } } } });
    }
    for (const [i, title] of ["ASTER", "Bumi Group", "NEXORA", "orbit", "VANTAGE"].entries()) {
        const record = base(title, "Illustrative company identity. Replace with an authorized client or partner before publication.", { category: "Business Partner", websiteUrl: "", demo: "true" }, i);
        await db.partner.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
    }
    const testimonial = base("Example client", "What stood out was the clarity. From the first conversation to the final handover, every decision had a purpose and our team knew what to expect.", { position: "Operations lead", company: "Demonstration testimonial", rating: 5, demo: "true" });
    await db.testimonial.upsert({ where: { slug_locale: { slug: testimonial.slug, locale: "en" } }, update: {}, create: testimonial });
    for (const [i, [title, position, excerpt]] of [["Software Engineering", "Engineering team", "Thoughtful architecture, useful interfaces, and maintainable software."], ["Infrastructure & Networks", "Infrastructure team", "Reliable connectivity and systems designed for real operations."], ["Delivery & Support", "Delivery team", "Clear communication from discovery through launch and ongoing care."]].entries()) {
        const record = base(title, excerpt, { position, linkedin: "", instagram: "" }, i);
        await db.teamMember.upsert({ where: { slug_locale: { slug: record.slug, locale: "en" } }, update: {}, create: record });
    }
    const pages = [
        ["about", "A technology partner for your next chapter.", "We believe good technology should make business simpler. KodeaTech combines thoughtful software engineering with practical infrastructure expertise to help teams build, connect, and grow.", "OUR COMPANY"],
        ["services", "Expertise that brings your ideas to life.", "From digital products to the infrastructure behind them, we connect the expertise you need to move forward.", "WHAT WE DO"],
        ["solutions", "Connected solutions. Real possibilities.", "Technology works best when it fits your business. Explore practical solutions for your next challenge.", "BUILT AROUND YOUR BUSINESS"],
        ["portfolio", "Good ideas, thoughtfully engineered.", "Explore our approach to digital products, business systems, and reliable infrastructure.", "SELECTED WORK"],
        ["blog", "A little perspective. A lot of possibility.", "Ideas and practical thinking from the world of software, infrastructure, and digital business.", "THE KODEA JOURNAL"],
        ["testimonials", "Partnership is at the heart of our work.", "Clear communication, thoughtful decisions, and a shared commitment to a useful result.", "CLIENT PERSPECTIVES"],
        ["partners", "Better technology, built together.", "Our ecosystem brings together expertise across software, networks, cloud, and infrastructure.", "OUR PARTNERS"],
        ["contact", "Let's build something great together.", "Have an idea, a challenge, or a question? Tell us what you have in mind. We will help you find a practical next step.", "START A CONVERSATION"],
        ["careers", "Do meaningful work. Build what matters.", "We are interested in thoughtful people who care about useful technology. Share your experience and the work you want to do with our team.", "GROW WITH KODEA"],
        ["privacy-policy", "Privacy policy", "We collect information you choose to send through our contact form, including your name, contact details, company, and project description. We use it to respond to your inquiry and manage our business communications.", "YOUR PRIVACY"],
        ["terms", "Terms & conditions", "This website describes our services and provides general information. Project scope, fees, delivery schedules, intellectual property, and support are agreed in a separate written agreement.", "WEBSITE TERMS"]
    ];
    for (const [slug, title, excerpt, eyebrow] of pages) {
        const record = { ...base(title, excerpt, { eyebrow }), slug };
        if (slug === "privacy-policy")
            record.content += `<h2>Storage and access</h2><p>Submitted information is stored in our systems and accessed by authorized staff. Contact us to request correction or deletion. We retain information only as needed for business communications and applicable obligations.</p><h2>Cookies and analytics</h2><p>We use necessary cookies for admin authentication and browser storage for your theme preference. Optional analytics, when enabled, require your consent.</p><h2>Contact</h2><p>Send privacy requests to hello@kodeatech.cloud.</p>`;
        await db.page.upsert({ where: { slug_locale: { slug, locale: "en" } }, update: {}, create: record });
        await db.seoMetadata.upsert({ where: { path: `/${slug}` }, update: {}, create: { path: `/${slug}`, title, description: excerpt, keywords: "" } });
    }
    console.log("Seed complete. Existing content and admin passwords were preserved. Replace example contacts, partners and case studies before publication.");
}
if (process.argv[1]?.endsWith("seed.ts")) {
    const db = new PrismaClient();
    seedDatabase(db).catch(e => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
}
