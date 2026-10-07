import { Code2, Smartphone, Layers, Workflow, Network, ShieldCheck, Server, Cable, Headphones, Sparkles, Compass, Activity, ChartNoAxesCombined, Cloud } from "lucide-react";
const icons = { Code: Code2, Smartphone, Layers, Workflow, Network, Shield: ShieldCheck, Server, Cable, Headphones, Sparkles, Compass, Activity, ChartNoAxesCombined, Cloud };
export function ServiceIcon({ name, size = 25 }: {
    name: string;
    size?: number;
}) { const Icon = icons[name as keyof typeof icons] || Code2; return <Icon size={size} strokeWidth={1.6}/>; }
