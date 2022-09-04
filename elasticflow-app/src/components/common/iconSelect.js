import classNames from "classnames"
import { Alignment, Button, Classes, Icon, MenuItem } from "@blueprintjs/core";
import { Select2 } from "@blueprintjs/select";

import { getIconNames, NONE } from "./iconNames";

const ICON_NAMES = getIconNames();

export const IconSelect = (props) => {

    const disabled = props.disabled;
    const icon = props.icon;
    const color = props.color ?? 'black';

    console.log("got color " + color);

    const renderIconItem = (checkIcon, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                selected={modifiers.active}
                icon={checkIcon === NONE ? undefined : checkIcon}
                key={checkIcon}
                onClick={handleClick}
                onFocus={handleFocus}
                text={checkIcon}
            />
        );
    };

    const filterIconName = (query, checkIcon) => {
        //the none icon is always shown
        if (checkIcon === NONE) return true;
        //if there is no query display only the current icon
        if (query === "") return true;
        // else check if the name is a match
        return checkIcon.toLowerCase().indexOf(query.toLowerCase()) >= 0;
    };

    const handleIconChange = (newIcon) => {
        const name = newIcon === NONE ? undefined : newIcon;
        props.onChange(name);
    }

    const getIconElement = (icon, color) => {
        return <Icon color={color} icon={icon}></Icon>
    }

    return (
        <label className={classNames(Classes.LABEL, { [Classes.DISABLED]: disabled })}>
            <Select2
                disabled={disabled}
                items={ICON_NAMES}
                itemPredicate={filterIconName}
                itemRenderer={renderIconItem}
                noResults={<MenuItem disabled={true} text="No results" />}
                onItemSelect={handleIconChange}
                popoverProps={{ minimal: true }}
            >
                <Button
                    style={ { color: color} }
                    alignText={Alignment.LEFT}
                    className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                    disabled={disabled}
                    fill={true}
                    icon={getIconElement(icon, color)}
                    text={icon || NONE}
                    rightIcon="caret-down"
                />
            </Select2>
        </label>
    );
    
}