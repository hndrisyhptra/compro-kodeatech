export interface ProfilePhotoCrop {
    x: number;
    y: number;
    zoom: number;
}

export const defaultProfilePhotoCrop: ProfilePhotoCrop = { x: 50, y: 50, zoom: 1 };

function bounded(value: unknown, fallback: number, min: number, max: number) {
    return typeof value === "number" && Number.isFinite(value)
        ? Math.max(min, Math.min(max, value))
        : fallback;
}

export function profilePhotoCrop(value: unknown): ProfilePhotoCrop {
    const crop = value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : {};
    return {
        x: bounded(crop.x, 50, 0, 100),
        y: bounded(crop.y, 50, 0, 100),
        zoom: bounded(crop.zoom, 1, 1, 3),
    };
}
