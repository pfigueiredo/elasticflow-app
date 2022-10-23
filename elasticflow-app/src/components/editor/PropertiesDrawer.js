import './PropertiesDrawer.css'
import React, { useState } from 'react';
import ActivityProperties from './Activities/ActivityProperties';
import { useCustomEventListener } from 'react-custom-events'
import { Drawer, DrawerSize, Classes, Position } from '@blueprintjs/core';

function PropertiesDrawer(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [title, setTitle] = useState("");
    const [object, setObject] = useState(null);

    useCustomEventListener('activity:select', data => {
        console.log("open drawer");
        console.log(data);
        setShow(true);
        let title = data.activity.name + ' [' + data.address + ']';
        setObject(data.activity);
        setTitle(title);
    });

    useCustomEventListener('activity:unselect', data => {
        setShow(false);
        setObject(null);
        setTitle("");
    })

    const verticalFlexContainerStyle = {
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignContent: "stretch",
        alignItems: "stretch"
    };

    const flexGrow1 = {
        flexGrow: 1
    }

    return <Drawer
        icon="document"
        onClose={handleClose}
        title={title}
        isOpen={show}
        autoFocus={true}
        enforceFocus={true}
        canOutsideClickClo  se={true}
        isCloseButtonShown={true}
        canEscapeKeyClose={true}
        hasBackdrop={false}
        position={Position.RIGHT}
        usePortal={true}
        size={DrawerSize.STANDARD}
    >
        <div className={Classes.DRAWER_BODY} style={verticalFlexContainerStyle}>
            <div className={Classes.DIALOG_BODY} style={{...verticalFlexContainerStyle, ...flexGrow1}}>
                {/* this will render diferent properties depending on which activity is selected */}
                <ActivityProperties activity={object}></ActivityProperties>
            </div>
        </div>
    </Drawer>
    
}

export default PropertiesDrawer;