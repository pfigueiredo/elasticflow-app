import React, { useState } from 'react';
import { ControlGroup, Button, Classes, InputGroup, HTMLSelect } from '@blueprintjs/core';


function ActivityOutput({output, allowExtraPorts, onRemove}) {

    const [state, setState] = useState({ output: output })

    function setOuputState(e, key) {
        state.output[key] = e.currentTarget.value;
        state.output.updateWiresAndProperties();
        setState({ output: state.output })
    }

    const outputOptions = [
        { label: "normal", value: 0 },
        { label: "remote", value: 1 }
    ];

    const handleDelete = (e) => {
        if (onRemove)
            onRemove(output);
    }

    const DeleteButton = ({allowExtraPorts}) => {
        if (allowExtraPorts) {
            return <Button className={Classes.FIXED} intent="danger" icon="delete" onClick={handleDelete}></Button>
        } else
            return <></>
    }

    return <>
        <ControlGroup key={output?.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
            <HTMLSelect disabled={state.output?.locked ?? false} className={Classes.FIXED} options={outputOptions} value={state.output?.type ?? 0} onChange={e => setOuputState(e, "type")}></HTMLSelect>
            <InputGroup leftIcon={(state.output?.isErrorOutput) ? "error" : "tag"} placeholder="Output Name" value={state.output?.name ?? ""} onChange={e => setOuputState(e, "name")}/>
            <DeleteButton allowExtraPorts={allowExtraPorts} onClick={handleDelete}></DeleteButton>
        </ControlGroup>    
    </>;
}

export default ActivityOutput;