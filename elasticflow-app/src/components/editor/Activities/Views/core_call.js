import React, { useState } from 'react';
import { ControlGroup, InputGroup, HTMLSelect, Classes, } from '@blueprintjs/core';



function View({activity}) {

    const [properties, setProperties] = useState(activity.properties);

    const setFlowId = function(event) {
        const value = event.currentTarget.value ?? 0;
        const mutated = {...properties, flowId: value}
        setProperties(mutated);
        activity.properties = mutated;
    };

    const setEntryPoint = function(event) {
        const value = event.currentTarget.value ?? 0;
        const mutated = {...properties, entryPoint: value}
        setProperties(mutated);
        activity.properties = mutated;
    };

    const setCallType = function(event) {
        const value = event.currentTarget.value ?? 0;
        const mutated = {...properties, type: value}
        setProperties(mutated);
        activity.properties = mutated;
    };

    const outputOptions = [
        { label: "in process", value: "proc" },
        { label: "remote", value: "remote" }
    ];

    return (<>
        <ControlGroup fill={true} vertical={false} style={{marginTop:"10px"}}>
            <HTMLSelect fill={true} className={Classes.FIXED} options={outputOptions} value={properties?.type ?? 0} onChange={e => setCallType(e)}></HTMLSelect>
        </ControlGroup>
        <ControlGroup fill={true} vertical={false} style={{marginTop:"10px"}}>
            <InputGroup leftIcon="flows" placeholder="flowId" value={properties.flowId ?? ""} onChange={e => setFlowId(e)}/>
        </ControlGroup>
        <ControlGroup fill={true} vertical={false} style={{marginTop:"10px"}}>
            <InputGroup leftIcon="dot" placeholder="entry-point" value={properties.entryPoint ?? ""} onChange={e => setEntryPoint(e)}/>
        </ControlGroup>  
    </>)

}

export default View;