import React, { useState } from 'react';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'
import './Components.css'

function Port(props) {

    let io = props.io;

    var translateY = io.posY;
    let translate = "translate(175," + translateY + ")"
    let color = io.color;

    const [status, setStatus] = useState({ active: false});

    function handleOutputPointerDown(e) {
        const el = e.target;
        el.setPointerCapture(e.pointerId);
        e.stopPropagation();
        setStatus({ active: true });
    }

    function handleOutputPointerUp(e) {
        if (status.active) {
            setStatus({
                ...status,
                active: false
            });
        }
    }

    useCustomEventListener('editor:mouseUp', data => {
        handleOutputPointerUp(data.event);
    });

    useCustomEventListener('editor:mouseMove', data => {
        if (status.active) {
            status.active = false;
            console.log("CREATE WIRE");
            let wire = io.createWire({ dragging: true });
            //ready to try and create a new wire
            emitCustomEvent('port:createWire', { io: io, wire: wire });
            setStatus({
                ...status,
                active: false
            }); 
        }
    });

    if (color) {
        let ioStyle = { fill: color };
        return <g key={io.key} className="elastic-flow-port-output" transform={translate}
            onPointerDown={handleOutputPointerDown}
            onPointerUp={handleOutputPointerUp}
        >
            <rect style={ioStyle} rx="3" ry="3" width="10" height="10" className="elastic-flow-port"></rect>
        </g>
    } else
        return <g key={io.key} className="elastic-flow-port-output" transform={translate}
            onPointerDown={handleOutputPointerDown}
            onPointerUp={handleOutputPointerUp}
        >
            <rect rx="3" ry="3" width="10" height="10" className="elastic-flow-port"></rect>
        </g>
}

export default Port;