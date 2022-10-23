import React, { useState } from 'react';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'
import './Components.css'

function Port(props) {

    let io = props.io;

    var translateY = io.posY + 1;
    let translateX = 184 - 6;
    let translate = "translate(" + translateX + "," + translateY + ")"
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
            <rect style={ioStyle} rx="2" ry="2" width="12" height="8" className="elastic-flow-port"></rect>
        </g>
    } else
        return <g key={io.key} className="elastic-flow-port-output" transform={translate}
            onPointerDown={handleOutputPointerDown}
            onPointerUp={handleOutputPointerUp}
        >
            <rect rx="2" ry="2" width="12" height="8" className="elastic-flow-port"></rect>
        </g>
}

export default React.memo(Port, (prev, next) => {
    const previo = prev.io ?? {};
    const nextio = next.io ?? {};
    return (previo.color !== nextio.color || previo.name !== nextio.name || previo.posY !== nextio.posY);
});