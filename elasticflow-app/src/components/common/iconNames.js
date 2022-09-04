import { IconNames } from "@blueprintjs/icons";
export const NONE = "(none)";

export function getIconNames() {
    const iconNames = [];
    for (const [, name] of Object.entries(IconNames)) {
        if (!iconNames.includes(name))
            iconNames.push(name);
    }
    iconNames.push(NONE);
    return iconNames
}