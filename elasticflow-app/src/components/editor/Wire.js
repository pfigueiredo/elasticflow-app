import React, { useState, useMemo } from 'react';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events';
import FlowAddress from './ViewModels/FlowAddress';
import generateLinkPath from './Utils/LinkPath';
import './Components.css'

function Wire(props) {

    let wire = props.wire;
    let destination = wire.destination ?? null;
    let source = wire.source ?? null;

    let highlight = (source?.selected || destination?.selected);
    let solidDashArray = "28,2"; // highlight ? "28,2" : "0";

    let dashArray = (((wire.type ?? 0) === 0) ? solidDashArray : "15,2,2,2,2,2,15,10");
    let classes = highlight ? "elastic-flow-wire-selected" : "elastic-flow-wire";

    const [coords, setCoords] = useState(() => getCoords(source, destination, wire, props.dragging));

    function getCoords(source, destination, wire, startDragging, ovx, ovy) {
        let width = 180;
        let xoffset = 0;
        let yoffset = 15;
        startDragging = startDragging ?? false;

        let start = {
            x: source.position.x + xoffset + width,
            y: source.position.y + wire.posY + 5,
        };
    
        if (!destination && !!startDragging) {
            ovx = start.x;
            ovy = start.y;
        }

        let end = {
            x: ovx ?? destination.position.x + xoffset - 10,
            y: ovy ?? destination.position.y + yoffset,
        };

        let labelPos = (wire?.labelPos) 
            ? { 
                x: (start.x + end.x) / 2 + 10,
                y: (start.y + end.y) / 2 - 5,
                cx: wire.labelPos.cx, 
                cy: wire.labelPos.cy, 
            }
            : {
                x: (start.x + end.x) / 2 + 10,
                y: (start.y + end.y) / 2 - 5,
                cx: 0, cy: 0
        }

        let path = generateLinkPath(start.x, start.y, end.x, end.y, 1);

        return { 
            start: start, 
            end: end, 
            path: path, 
            labelPos: labelPos,
            endActive: !!startDragging
        };
    }

    useCustomEventListener('activity:move', data => {
        let address = data.address;
        if (FlowAddress.SameActivity(destination?.address, address)
            || FlowAddress.SameActivity(source?.address, address)) 
        {
            let coords = getCoords(source, destination, wire)
            setCoords(coords);
        }
    });

    function handleLabelPointerDown(e) {
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
        setCoords({
            ...coords,
            lblActive: true,
            offset: { x, y },
            bbox: bbox
        });
    }

    function handleLabelPointerUp(e) {
        e.preventDefault();
        setCoords({
            ...coords,
            lblActive: false
        });
        wire.labelPos = { ...coords.labelPos };
    }

    function handleEndPointerDown(e) {
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
        setCoords({
            ...coords,
            endActive: true,
            offset: { x, y },
            bbox: bbox
        });
    }

    function handleEndPointerUp(e) {
        
        
        if (coords.endActive) {

            //can we find an activity under the mouse cursor?
            let done = false;
            let flow = wire?.source?.flow;

            let mX = e.clientX;
            let mY = e.clientY;

            if (flow) {
                let activity = flow.getActivityAt(mX, mY);
                if (activity) {
                    activity.connect(wire);
                    wire.status = {};
                    done = true;
                    emitCustomEvent('wire:updateWire', { wire: wire });
                }
            }

            if (!done) {
                emitCustomEvent("editor:openContextMenu", { 
                    x: coords.end.x, 
                    y: coords.end.y, 
                    callback: function(activity) {
                        if (!activity) {
                            if (!wire.destination) {
                                emitCustomEvent('wire:destroyWire', { wire: wire });
                                wire.destroyWire();
                            } else {
                                var newCoords = getCoords(source, destination, wire, false);
                                setCoords({ ...newCoords });
                            }
                        } else {
                            activity.connect(wire);
                            wire.status = {};
                            emitCustomEvent('wire:updateWire', { wire: wire });
                        }
                    }}
                );
            }
        }


        setCoords({
            ...coords,
            endActive: false,
            lblActive: false
        });

        //check the new destination
        //and update the source to point to dest.
        //wire.labelPos = { ...coords.labelPos };
    }

    useCustomEventListener('editor:mouseUp', data => {
        
        handleEndPointerUp(data.event);

        // if (!wire.destination) {
        //     emitCustomEvent('wire:destroyWire', { wire: wire });
        //     wire.destroyWire();
        // } else {
        //     var newCoords = getCoords(source, destination, wire, false);
        //     setCoords({ ...newCoords });
        // }
    });

    useCustomEventListener('editor:mouseMove', data => {

        if (coords.lblActive) {
            let cx = data.x - coords.bbox.x - coords.offset.x;
            let cy = data.y - coords.bbox.y - coords.offset.y;
            setCoords({
                ...coords,
                labelPos: {
                    x: coords.labelPos?.x ?? 0,
                    y: coords.labelPos?.y ?? 0,
                    cx: Math.min(Math.abs(cx), 200) * Math.sign(cx),
                    cy: Math.min(Math.abs(cy), 200) * Math.sign(cy)
                }
            });
            wire.labelPos = { ...coords.labelPos };
        } else if (coords.endActive) {

            let mX = data.x;
            let mY = data.y;

            var flow = wire?.source?.flow;
            if (flow) {
                var activity = flow.getActivityAt(data.x, data.y);
                if (activity) {
                    mX = activity.position.x - 10;
                    mY = activity.position.y + 15;
                }
            }

            let x = mX - (coords.offset?.x ?? 0);
            let y = mY - (coords.offset?.y ?? 0);

            var newCoords = getCoords(source, destination, wire, false, x, y);
            setCoords({
                ...coords,
                path: newCoords.path,
                end: { x: x, y: y }
            });
        }
    }); 
    
    const MakeWire = React.memo((props) => {
        let wireDef = []
        if (source?.commitOnOutput) { //filter="url(#double)"
            wireDef.push(<path d={coords.path} style={{
                strokeWidth: 5,
                stroke: "#444",
                fill: "none"
            }}/>);
            wireDef.push(<path d={coords.path} style={{
                strokeWidth: 4,
                stroke: "#FFF",
                fill: "none"
            }}/>);
        }
        wireDef.push(
            <path id={wire.address} className={classes} d={coords.path} markerEnd="url(#wireEndArrow)" style={{
                strokeDasharray: dashArray,
                fill: "none",
                cursor: 'pointer'
            }}/>
        );
        console.log(wire.address);
        return <>{wireDef}</>
    });

    if (!wire) return <></>

    return <>
    <g 
        transform={"translate(" + coords.labelPos.x + "," + coords.labelPos.y + ")"}
    >
        {/* <text 
            onPointerDown={handleLabelPointerDown}
            onPointerUp={handleLabelPointerUp}
            cursor="move" 
            transform={"translate(" + coords.labelPos.cx + "," + coords.labelPos.cy + ")"}
            >{wire.name}</text> */}
    </g>
    <MakeWire {...props}></MakeWire>
    <text dy="20"
        onPointerDown={handleLabelPointerDown}
        onPointerUp={handleLabelPointerUp}
        cursor="move" 
    >
        <textPath href={"#" + wire.address} startOffset={ coords.labelPos.cx ?? 50 } >
            {wire.name}
        </textPath>
    </text>
    <circle 
        onPointerDown={handleEndPointerDown}
        onPointerUp={handleEndPointerUp}
        r="10" fill="transparent"
        transform={"translate(" + coords.end.x + "," + coords.end.y + ")"}></circle>
    </>
}

export default React.memo((props) => <Wire {...props}/>);