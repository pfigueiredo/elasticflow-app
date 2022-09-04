import React, { useState } from 'react';

import { Switch, FormGroup, HTMLSelect, ControlGroup, Label, InputGroup, Classes } from '@blueprintjs/core';

function View({activity}) {

    const assignOptions = [
        { label: "payload", value: 0, helperText: "store array back into 'msg.payload[item]'" },
        { label: "msg", value: 1, helperText: "store array back into 'msg[item]'" },
        { label: "process", value: 2, helperText: "store array back into 'process.variables' using 'setValue(item, arr)'" },
        { label: "flow", value: 3, helperText: "store array back into 'flow.variables' using 'getValue(item. arr)'" },
        { label: "activity", value: 4, helperText: "store array back into 'activity.variables' using 'setValue(item, arr)'" }
    ];

    const [sliceProps, setSliceProps] = useState(activity?.properties ?? {});
    const [selectedOption, setSelectedOption] = useState(assignOptions[activity?.properties?.type ?? 0]);

    function setProps(e, key) {
        sliceProps[key] = e.currentTarget.value;
        activity.properties = {...sliceProps};
        setSliceProps({...sliceProps});
    }

    function setMutateMessage(e) {
        sliceProps.mutateMessage = e.currentTarget.checked;
        activity.properties = {...sliceProps};
        setSliceProps({...sliceProps});
    }

    function handleAssignOptionsChange(event) {
        let value = event.currentTarget.value;
        let option = assignOptions[value ?? 0];
        setSelectedOption({...option});
        activity.properties = {...sliceProps, type:value};
        setSliceProps({...sliceProps, type: value});
    }

    function MakeInputMessagePrototype() {
        var sliceData = {
            item: "#item",
            index: "#index",
            length: "#length"
        }

        var msg = {
            payload: {
                "#itemName" : sliceData
            }
        }

        let itemName = sliceProps.source ?? "slice";

        let jsonString = JSON.stringify(msg, null, 2);
        jsonString = jsonString.replace('"#item"', "any");
        jsonString = jsonString.replace('"#index"', 'index');
        jsonString = jsonString.replace('"#length"', 'length');
        jsonString = jsonString.replace('"#itemName"', '"' + itemName + '"');
        return <pre>{jsonString}</pre>;

    }

    function MakeMessagePrototype() {

        let itemsName = (sliceProps.items ?? "items");
        let assignExpression = "";

        switch (selectedOption.value) {
            case 0: assignExpression = "msg.payload['" + itemsName + "'] = gluedArray;\n"; break;
            case 1: assignExpression = "msg['" + itemsName + "'] = gluedArray;\n"; break;
            case 2: assignExpression = "process.setValue('" + itemsName + "', gluedArray);\n"; break;
            case 3: assignExpression = "flow.setValue('" + itemsName + "', gluedArray);\n"; break;
            case 4: assignExpression = "activity.setValue('" + itemsName + "', gluedArray);\n"; break;
            case 5: assignExpression = "payload.setValue('" + itemsName + "', gluedArray);\n"; break;
            default: break;
        }

        if (sliceProps.mutateMessage)
            return <pre>{"msg = {...msg, payload: {...msg.payload}};\n"}{assignExpression}</pre>
        
            return <pre>{"msg = { payload: {}};\n"}{assignExpression}</pre>
    }

    return (<>
        <ControlGroup fill={true} vertical={false} style={{margin:"10px 0", alignItems: "baseline"}}>
            <Label className={Classes.FIXED} style={{margin:"0px 10px 0px 0px"}}>Glue msg.payload</Label>
            <InputGroup leftIcon="dot" placeholder="Source" value={sliceProps.source ?? ""} onChange={e => setProps(e, "source")}/>
            <Label className={Classes.FIXED} style={{margin:"0 10px"}}>as</Label>
            <InputGroup leftIcon="array" placeholder="Items" value={sliceProps.items ?? ""} onChange={e => setProps(e, "items")}/>
        </ControlGroup>
        <FormGroup 
            helperText={selectedOption.helperText}
            label="And store the array into:"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleAssignOptionsChange}
                value={selectedOption.value}
                options={assignOptions.map(o => { return { label: o.label, value: o.value }})}
            >
            </HTMLSelect>
        </FormGroup>
        <Switch checked={sliceProps.mutateMessage} label="Shallow clone the last original message and mutate it or create a new one?" onChange={e => setMutateMessage(e)} />
        <h4>Expected input messages format</h4>
        <MakeInputMessagePrototype></MakeInputMessagePrototype>
        <h4>Output message example</h4>
        <MakeMessagePrototype></MakeMessagePrototype>
        </>
    );
}

export default View;