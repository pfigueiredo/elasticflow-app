import React, { useState, useEffect } from 'react';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'
import './Components.css'
import FlowAddress from './ViewModels/FlowAddress';
import nodes from './Activities/Nodes';
import Port from './Port';
import snapToGrid from './Utils/Grid';

function Activity(props) {
    
    var activity = props.activity ?? {};

    var name = activity.name ?? "unnamed";
    var error = activity.hasErrors ?? activity.error ?? 0;
    var changed = activity.changed ?? 0;

    var nodeIcon = nodes[activity.type].icon ?? "function.svg";

    useEffect(() => { });

    const [position, setPosition] = useState({
        x: activity.position.x,
        y: activity.position.y,
        active: false,
        offset: { }
    });

    const [status, setStatus] = useState({
        selected: activity.selected ?? false
    })

    const ActivityRect = () => <>
        {/* <g transform="translate(-25,2)" className="elastic-flow-node-button">
            <rect className="elastic-flow-node-button-background" rx="5" ry="5" width="32" height="26"></rect>
            <rect className="elastic-flow-node-button-button" x="5" y="4" rx="4" ry="4" width="16" height="18" fill="#a6bbcf"></rect>
        </g> */}
        <rect className="elastic-flow-node" rx="2" ry="2" fill="#a6bbcf" width="180" height="30"></rect>
        <g className="elastic-flow-node-icon-group" x="0" y="0" transform="" /*style="pointer-events: none;"*/>
            <rect x="0" y="0" className="elastic-flow-node-icon-shade" width="30" height="30"></rect>
            <image href={"/icons/" + nodeIcon} className="elastic-flow-node-icon" x="0" width="30" height="30" y="0"></image>
            <path d="M 30 1 l 0 28" className="elastic-flow-node-icon-shade-border"></path>
        </g>
        {/*className="styles-elastic-workspace-flow-node-label" */}
        <g className="elastic-workspace-flow-node-label" transform="translate(38,16)">
            <text className="elastic-flow-node-label-text" x="0" y="0">{name}</text>
        </g>
        {/* <g className="elastic-flow-node-status-group" transform='translate(180,-10)'>
            <rect className="elastic-flow-node-status-ring-red" x="6" y="1" width="9" height="9" rx="2" ry="2" stroke-width="3"></rect>
            <text className="elastic-flow-node-status-label" x="20" y="10"></text>
        </g> */}
        <rect className="elastic-flow-node-cover" rx="2" ry="2" width="180" height="30"></rect>


    </>

    /**
     <g className="elastic-flow-node-status-group">
        <rect className="elastic-flow-node-status" x="6" y="1" width="9" height="9" rx="2" ry="2" stroke-width="3"></rect>
        <text className="elastic-flow-node-status-label" x="20" y="10"></text>
    </g>
     */

    const ChangedAttribute = function (props) {
        if (props.changed && props.error)
            return <g className="elastic-flow-node-error" transform="translate(155, -2)"><circle r="5"></circle></g>
        else if (props.changed)
            return <g className="elastic-flow-node-changed" transform="translate(170, -2)"><circle r="5"></circle></g>
        else return <></>
    }

    const ErrorAttribute = function(props) { 
        if (props.error)
            return <g className="elastic-flow-node-error" transform="translate(170, -2)"><path d="M -5,4 l 10,0 -5,-8 z"></path></g>
        else
            return <></>
    }

    useCustomEventListener('editor:activityCodeChanged', data => {
        var address = data.address ?? "";
        if (FlowAddress.SameActivity(address, activity.address)) {
            console.log('got: activity:change ' + data.address);
            setStatus({ ...status });
        }
    })

    useCustomEventListener('activity:change', data => {
        var address = data.address ?? "";
        if (FlowAddress.SameActivity(address, activity.address)) {
            console.log('got: activity:change ' + data.address);
            setStatus({ ...status });
        }
    });

    useCustomEventListener('activity:select', data => {
        var address = data.address ?? "";
        if (!FlowAddress.SameActivity(address, activity.address)) {
            activity.selected = false;
            setStatus({ selected: false });
        }
    });

    function handleActivityPointerDown(e) {
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);
        setPosition({
            ...position,
            active: true,
            offset: { x, y }
        });
        activity.selected = true;
        setStatus({ selected: true });
    }

    function handleActivityPointerUp(e) {
        if (position.active) {
            let wasMoving = position.moving;
            setPosition({
                ...position,
                active: false,
                moving: false
            });
            activity.position.x = position.x;
            activity.position.y = position.y;
            if (wasMoving) {
                activity.selected = false;
                setStatus({ selected: false });
                emitCustomEvent('activity:move', { address: activity.address });
            } else
                emitCustomEvent('activity:select', { address: activity.address, activity: activity });
        }
    }

    useCustomEventListener('editor:mouseUp', data => {
        handleActivityPointerUp(data.event);
    });

    useCustomEventListener('editor:mouseMove', data => {
        if (position.active) {
            setPosition({
                ...position,
                moving: true,
                x: snapToGrid(data.x - position.offset.x, 10),
                y: snapToGrid(data.y - position.offset.y, 10)
            });
            activity.position.x = position.x;
            activity.position.y = position.y;
            emitCustomEvent('activity:move', { address: activity.address });
        }
    });

    let nodeClassName = status.selected ? "elastic-flow-node-selected elastic-flow-activity" : "elastic-flow-node elastic-flow-activity";

    return <g 
            className={nodeClassName} 
            id={activity.address} 
            transform={"translate(" + position.x + "," + position.y + ")"}
            onPointerDown={handleActivityPointerDown}
            onPointerUp={handleActivityPointerUp}
        >
            <ActivityRect></ActivityRect>
            <ChangedAttribute changed={changed} error={error}></ChangedAttribute>
            <ErrorAttribute error={error}></ErrorAttribute>

            { activity.outputs.map((io) => <Port key={io.key} io={io}></Port>) }

        </g>;
}

export default Activity;