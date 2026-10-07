import Image from "next/image";
import { profilePhotoCrop } from "@/lib/profile-photo";

export function ProfilePhoto({ src, alt, crop, preview = false }: {
    src: string;
    alt: string;
    crop?: unknown;
    preview?: boolean;
}) {
    const { x, y, zoom } = profilePhotoCrop(crop);
    const position = `${x}% ${y}%`;

    return <span className={`client-profile-photo${preview ? " is-preview" : ""}`}>
        <Image src={src} alt={alt} width={preview ? 600 : 240} height={preview ? 600 : 240}
            sizes={preview ? `${Math.ceil(200 * zoom)}px` : `(max-width: 600px) ${Math.ceil(72 * zoom)}px, ${Math.ceil(80 * zoom)}px`}
            draggable={false}
            style={{ objectPosition: position, transformOrigin: position, transform: `scale(${zoom})` }}/>
    </span>;
}
