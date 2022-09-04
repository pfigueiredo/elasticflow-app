import React, { useState } from 'react';
import { ControlGroup, Classes, InputGroup, HTMLSelect } from '@blueprintjs/core';


function ActivityOutput({output}) {

    const [state, setState] = useState({ output: output })

    function setOuputState(e, key) {
        state.output[key] = e.currentTarget.value;
        state.output.updateWiresAndProperties();
        setState({ output: state.output })
    }

    const outputOptions = [
        { label: "async", value: 0 },
        { label: "remote", value: 1 }
    ];

    return <>
        <ControlGroup key={output?.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
            <HTMLSelect className={Classes.FIXED} options={outputOptions} value={state.output?.type ?? 0} onChange={e => setOuputState(e, "type")}></HTMLSelect>
            <InputGroup leftIcon={(state.output?.isErrorOutput) ? "error" : "tag"} placeholder="Output Name" value={state.output?.name ?? ""} onChange={e => setOuputState(e, "name")}/>
        </ControlGroup>    
    </>;
}

export default ActivityOutput;