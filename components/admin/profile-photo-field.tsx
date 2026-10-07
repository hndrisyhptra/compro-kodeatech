"use client";

import { useId } from "react";
import { RotateCcw } from "lucide-react";
import { ImageField } from "./image-picker";
import { ProfilePhoto } from "@/components/profile-photo";
import { defaultProfilePhotoCrop, profilePhotoCrop, type ProfilePhotoCrop } from "@/lib/profile-photo";

export function ProfilePhotoField({ value, crop, csrf, disabled, onUploadActivity, onChange }: {
    value: string;
    crop: unknown;
    csrf: string;
    disabled: boolean;
    onUploadActivity: (active: boolean) => void;
    onChange: (image: string, crop: ProfilePhotoCrop) => void;
}) {
    const id = useId();
    const current = profilePhotoCrop(crop);

    return <div className="profile-photo-field">
        <ImageField label="Profile photo" value={value} csrf={csrf} disabled={disabled}
            showPreview={false} onUploadActivity={onUploadActivity}
            onChange={urls => {
                const image = urls[0] || "";
                onChange(image, image === value ? current : { ...defaultProfilePhotoCrop });
            }}/>
        {value && <fieldset disabled={disabled} className="profile-photo-adjustment" aria-labelledby={`${id}-title`}>
            <div className="profile-photo-preview">
                <ProfilePhoto src={value} alt="Client photo preview" crop={current} preview/>
                <small>Preview on the website</small>
            </div>
            <div className="profile-photo-controls">
                <h3 id={`${id}-title`}>Adjust photo</h3>
                <p id={`${id}-help`}>Zoom and reposition the photo to keep the face inside the circle. Save changes to apply.</p>
                <label htmlFor={`${id}-zoom`}><span>Zoom <output>{Math.round(current.zoom * 100)}%</output></span>
                    <input id={`${id}-zoom`} type="range" min={1} max={3} step={0.05} value={current.zoom} aria-describedby={`${id}-help`}
                        onChange={e => onChange(value, { ...current, zoom: Number(e.target.value) })}/>
                </label>
                <label htmlFor={`${id}-x`}><span>Horizontal position <output>{current.x}%</output></span>
                    <input id={`${id}-x`} type="range" min={0} max={100} step={1} value={current.x}
                        onChange={e => onChange(value, { ...current, x: Number(e.target.value) })}/>
                </label>
                <label htmlFor={`${id}-y`}><span>Vertical position <output>{current.y}%</output></span>
                    <input id={`${id}-y`} type="range" min={0} max={100} step={1} value={current.y}
                        onChange={e => onChange(value, { ...current, y: Number(e.target.value) })}/>
                </label>
                <div className="profile-photo-actions">
                    <button type="button" className="button secondary" onClick={() => onChange(value, { ...defaultProfilePhotoCrop })}><RotateCcw size={15}/>Reset position</button>
                    <button type="button" className="button secondary" onClick={() => onChange("", { ...defaultProfilePhotoCrop })}>Remove photo</button>
                </div>
            </div>
        </fieldset>}
    </div>;
}
