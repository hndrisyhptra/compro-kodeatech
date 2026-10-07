import Image from "next/image";
import logo from "@/public/logo-kodea.png";

export function BrandLogo({ name = "KODEA TECH", priority = false }: {
    name?: string;
    priority?: boolean;
}) {
    return <>
        <span className="kodea-logo-mark" aria-hidden="true">
            <Image
                className="kodea-logo-image"
                src={logo}
                alt=""
                width={1414}
                height={2000}
                sizes="96px"
                priority={priority}
            />
        </span>
        <span className="kodea-wordmark">{name}</span>
    </>;
}
