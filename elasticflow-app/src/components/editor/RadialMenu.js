import  "./RadialMenu.css";
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'
import React, { useState } from 'react';

//preparation
var angles = [ //let play with the unit circle again
    0,
    Math.PI/4,
    Math.PI/2,
    3 * Math.PI/4,
    Math.PI,
    5 * Math.PI/4,
    3* Math.PI/2,
    7 * Math.PI/4
];

var commands = [
    "createAssign",
    "createIf",
    "createAndJoin",
    "createFx",
    "createGlue",
    "createSlice",
    "createTransform",
    "createTrigger"
];

var images = [
    "assign.svg",
    "if.svg",
    "andJoin.svg",
    "fx.svg",
    "glue.svg",
    "slice.svg",
    "transform.svg",
    "triggerOut.svg"
];

var tips = [
    "assign a value to a msg/payload",
    "conditionaly split message path",
    "join messages in the current process",
    "creates a user defined function node",
    "glues several msgs into one",
    "slices a msg into several msgs",
    "transform msg/payload",
    "trigger a new event"
];

var circleRadius = 18;
var globalRadius = 50;
var points = [];

for (var a = 0; a < angles.length; a++) {
    points.push({
        x: Math.round(Math.cos(angles[a]) * globalRadius) + globalRadius,
        y: Math.round(Math.sin(angles[a]) * globalRadius) + globalRadius
    });
}


function RadialMenu(props) {

    const [status, setStatus] = useState({ isOpen: false, callback: null });

    function onCircleClick(e, command) {
        console.log(command);
        console.log("circle mouse up!! yes!!");
        e.stopPropagation();
        emitCustomEvent(
            'menu:command', { 
                command: command,
                position: { x: status.cx, y: status.cy },
                callback: function(activity) {
                    const callback = status.callback;
                    setStatus({isOpen: false, callback: null});
                    callback?.apply(null, [activity]);
                }
            }
        );
    }

    useCustomEventListener('editor:openContextMenu', data => {
        console.log("open context menu");
        setStatus(
            { 
                isOpen: true, 
                x: (data.x - globalRadius) ?? 100, 
                y: (data.y - ( globalRadius + circleRadius) ) ?? 100,
                cx: data.x,
                cy: data.y,
                callback: data.callback ?? null
            })
    });

    const checkMouseUpPropagation = (e) => {
        console.log("checking propagation of mouseUP");
        e.stopPropagation();
    }

    useCustomEventListener('editor:mouseUp', data => {
        if (status.isOpen) {
            console.log("editor mouse up!! fck");
            setStatus({ isOpen: false, callback: null });
            const callback = status.callback;
            callback?.apply(null, [null, true]);
            emitCustomEvent('editor:refresh', {});
        }
    });

    var circles = [];

    if (!status.isOpen)
        return <></>
    else {
        for(let i = 0; i < points.length && i < images.length; ++i) {

            let point = points[i];
            let command = commands[i];

            var circle = <g key={i} transform={"translate(" + point.x + "," + point.y + ")"} >
                <circle transform="translate(18,18)" className="elastic-flow-context-menu-item" cx="0" cy="0" r={circleRadius}></circle>
                <image transform={"translate(3,3)"}  width={30} height="30" href={"/icons/n/" + images[i]}></image>
                <circle transform="translate(18,18)" className="elastic-flow-context-menu-item-cover" cx="0" cy="0" r={circleRadius}
                    onClick={e => onCircleClick(e, command)} onPointerUp={checkMouseUpPropagation}></circle>
                <title>{tips[i]}</title>
            </g>

            circles.push(circle);

        }

        return <g transform={"translate("+ status.x + "," + status.y + ")"} filter="url(#dropShadow)"> 
            {circles} 
            <g transform="translate(50,50)">
                <circle transform="translate(18,18)" className="elastic-flow-context-menu-item" cx="0" cy="0" r={circleRadius * 1.5}></circle>
                <image transform={"translate(3,3)"}  width={30} height="30" href="/icons/n/plus.svg"></image>
                <circle transform="translate(18,18)" className="elastic-flow-context-menu-item-cover" cx="0" cy="0" r={circleRadius * 1.5} 
                    onClick={e => onCircleClick(e, "addNode")} onPointerUp={checkMouseUpPropagation}></circle>
                <title>opens a list of extra available nodes do add</title>
            </g>
        </g>;
    }
}

export default RadialMenu;