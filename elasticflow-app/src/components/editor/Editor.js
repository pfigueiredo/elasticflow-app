import React, { useState, useMemo, useCallback } from 'react';
import { Button, Spinner } from '@blueprintjs/core';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'
import { useFlowData, useFlowMutation, useFlowCache, useFlowDelete } from '../../datahooks/useFlowsData'
import FlowViewModel from './ViewModels/FlowViewModel.js'
import snapToGrid from './Utils/Grid';
import './Editor.css'
import RadialMenu from './RadialMenu';
import Activity from './Activity';
import Wire from './Wire'
import PropertiesDrawer from './PropertiesDrawer';
import CodeEditor from './CodeEditor';
import { AddActivityDialog } from './AddActivity.dialog';

const flowMemo = {};


function buildFlowModel (flowData, isLoading) {


    console.log(`isLoading ${isLoading} ${flowData?.valueOf()}`)

    if (isLoading)
        return null;
    else if (flowData) {

        if (!!flowMemo[flowData.flowId])
            return flowMemo[flowData.flowId];

        const flow = new FlowViewModel(flowData);
        if (flow.activities.length === 0)
            flow.createActivity('core:start', {x: 50, y: 100 });

        flowMemo[flowData.flowId] = flow

        return flow;
    } else
        return null;
}

function sliptWires(flowData, dragging) {
    const wires = [];
    const dragWires = [];
    if (!!flowData) {
        flowData.activities.forEach(a => {
            a.outputs.forEach(o => {
                o.wires.forEach(c => {
                if (!!c.status?.dragging)
                    dragWires.push(c);
                else
                    wires.push(c);
                })
            })
        });
    }
    return [wires, dragWires];
}

export const Editor = (props) => {

    console.log('loading editor');

    const { isLoading, data, isError, error } = useFlowData(props.flowId);
    const [ editorStatus, setEditorStatus ] = useState({ flowId: props.flowId });
    const [ wireInteractions, setWireInteractions ] = useState(0);
    const { mutate: mutateFlow } = useFlowMutation((data, variables, context) => {
        console.log('recived data after mutation');
        console.log(data);
    });

    const flow = (!isLoading) ? buildFlowModel(data.data.Item, isLoading) : null;

    //const flow = useMemo(() => buildFlowModel(data?.data.Item, isLoading), [props.flowId, isLoading]);
    const [wires, dragWires] = useMemo(() => sliptWires(flow, wireInteractions), [flow, wireInteractions]);

    useCustomEventListener('editor:refresh', data => {
        setEditorStatus({...editorStatus});
    });
  
    useCustomEventListener('port:createWire', data => {
        let wire = data.wire;
        if (!!wire) {
            setWireInteractions(wireInteractions + 1);
        }
    });

    useCustomEventListener('wire:updateWire', data => {
        let wire = data.wire;
        if (!!wire) {
          setWireInteractions(wireInteractions + 1);
        }
    })
  
    useCustomEventListener('wire:destroyWire', data => {
        let wire = data.wire;
        if (!!wire) {
          setWireInteractions(wireInteractions + 1);
        }
    });

    function saveFlow() {
        flow.prepareEntryPoints();
        const dataforSave = flow.getDataForSerialization();
        console.log("ABOUT TO SAVE FLOW");
        console.log(dataforSave);
        mutateFlow({...dataforSave});
    }

    function createActivity(type, position) {

        var activityPosition = {
          x: snapToGrid(position.x + 10, 10),
          y: snapToGrid(position.y - 15, 10)
        }
    
        console.log("create activity of type " + type + " at " + activityPosition.x + ":" + activityPosition.y);
        return flow.createActivity(type, activityPosition);

    }

    function openAddListDialog(callback, position) {
        console.log("and node extra called");
        emitCustomEvent('editor:openAddActivityDialog', { callback: callback, position: position });
    }

    useCustomEventListener('menu:addActivity', data => {
        let position = data.position;
        let activityType = data.type;
        let callback = data.callback;
        let activity = createActivity(activityType, position);
        if (callback) callback(activity);
        setWireInteractions(wireInteractions + 1);
    })

    useCustomEventListener('menu:command', data => {
        let command = data.command;
        let position = data.position;
        let callback = data.callback;
        let activity = null;
        switch (command) {
          case "createAssign": activity = createActivity("core:assign", position); break;
          case "createIf": activity = createActivity("core:switch", position); break;
          case "createAndJoin": activity = createActivity("core:join", position); break;
          case "createFx": activity = createActivity("core:function", position); break;
          case "createCall": activity = createActivity("core:call", position); break;
          case "createGlue": activity = createActivity("core:glue", position); break;
          case "createSlice": activity = createActivity("core:slice", position); break;
          case "createTransform": activity = createActivity("core:transform", position); break;
          case "createTrigger": activity = createActivity("core:trigger", position); break;
          case "addNode": openAddListDialog(callback, position); return;
          default: break;
        }
        if (callback) callback(activity);
        setWireInteractions(wireInteractions + 1);
    });

    function handlePointerMove(e) {
        const x = e.clientX;
        const y = e.clientY;
        emitCustomEvent('editor:mouseMove', {event: e, x: x, y: y});
    };
    
    function handlePointerDown(e) {
        const x = e.clientX;
        const y = e.clientY;
        emitCustomEvent('editor:mouseDown', {event: e, x: x, y: y});
    };
    
    function handlePointerUp(e) {
        const x = e.clientX;
        const y = e.clientY;
        emitCustomEvent('editor:mouseUp', {event: e, x: x, y: y});
    };

    const Loader = () => {
        if (isLoading)
            return <Spinner size={100} className="loading-spinner"></Spinner>
        else
            return <></>
    }

    const FlowEditor = () => {
        if (!isLoading)
            return (<>
                { wires.map(wire => <Wire key={wire.key} wire={wire}></Wire>)}
                { flow.activities.map(activity => <Activity key={activity.key} activity={activity}></Activity>) }
                { dragWires.map(wire => <Wire key={wire.key} wire={wire} dragging={true}></Wire>)}
            </>);
        else
            return <></>
    }

    if (isError) return <h2>{error.message}</h2>

    return (
        <><div id="editor-container">
            <svg height="100%" width="100%" className="elastic-flow-area" id="editorGraphics"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}>
                <defs>
                    <filter id="double">
                        <feMorphology in="SourceGraphic" result="a" operator="dilate" radius="4" />
                        <feComposite in="SourceGraphic" in2="a" result="xx" operator="xor" />
                    </filter>
                    <filter id='dropShadow' colorInterpolationFilters="sRGB">
                        <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                    </filter>
                    <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                        <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#A0A0A0" strokeWidth="0.5"/>
                    </pattern>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                        <rect width="80" height="80" fill="url(#smallGrid)"/>
                        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#FFA0A0" strokeWidth="1"/>
                    </pattern>
                    <marker id="wireEndArrow" markerUnits="strokeWidth"
                        markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" >
                        <path d="M0,0 L0,6 L9,3 z" fill="#444" strokeWidth="1" />
                    </marker>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <FlowEditor/>
                <RadialMenu/>
            </svg>
        </div>
        <PropertiesDrawer></PropertiesDrawer>
        <CodeEditor editor={editorStatus}></CodeEditor>
        <AddActivityDialog></AddActivityDialog>
        <Loader/>
        <Button intent='success' icon="floppy-disk"
            style={{position: "absolute", top: "60px", right: "10px", zIndex: "2"}} onClick={() => saveFlow()}
            >Save Flow Definition</Button>
        </>
    )

}