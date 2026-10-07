// Version the default icon so browsers refresh the previous cached favicon.
export const defaultFavicon = "/icon.svg?v=kodea-transparent-20261006";

export function faviconUrl(value = "") {
    return !value || value.split("?")[0] === "/icon.svg" ? defaultFavicon : value;
}
