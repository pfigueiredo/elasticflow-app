import React, { useState } from 'react';

import { Switch, FormGroup, HTMLSelect, ControlGroup, Label, InputGroup, Classes } from '@blueprintjs/core';

function View({activity}) {

    const assignOptions = [
        { label: "payload", value: 0, helperText: "take values from 'msg.payload[item]'" },
        { label: "msg", value: 1, helperText: "take values from 'msg[item]'" },
        { label: "process", value: 2, helperText: "take values from 'process.variables' using 'getValue(item)'" },
        { label: "flow", value: 3, helperText: "take values from 'flow.variables' using 'getValue(item)'" },
        { label: "activity", value: 4, helperText: "take values from 'activity.variables' using 'getValue(item)'" }
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

    function setIncludeSliceData(e) {
        sliceProps.includeSliceData = e.currentTarget.checked;
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

    function MakeMessagePrototype() {

        var sliceData = {
            item: "#item",
            index: "#index",
            length: "#length"
        }

        var msg = {
            payload: {
                "#itemName" : sliceProps.includeSliceData ? sliceData : "#item"
            }
        }



        let sourceName = (sliceProps.source ?? "source");

        switch (selectedOption.value) {
            case 0: sourceName = "msg.payload." + sourceName; break;
            case 1: sourceName = "msg." + sourceName; break;
            case 2: sourceName = "process.getValue('" + sourceName + "')"; break;
            case 3: sourceName = "flow.getValue('" + sourceName + "')"; break;
            case 4: sourceName = "activity.getValue('" + sourceName + "')"; break;
            case 5: sourceName = "payload.getValue('" + sourceName + "')"; break;
            default: break;
        }


        let itemName = sliceProps.item ?? "slice";

        let jsonSource = sliceProps.mutateMessage ? 
            sliceProps.includeSliceData ? sliceData : "#item" 
            : msg;

        let jsonString = JSON.stringify(jsonSource, null, 2);
        jsonString = jsonString.replace('"#item"', sourceName + '[i]');
        jsonString = jsonString.replace('"#index"', 'i');
        jsonString = jsonString.replace('"#length"', sourceName + '.length');
        jsonString = jsonString.replace('"#itemName"', itemName);

        if (sliceProps.mutateMessage)
            return <pre>{"msg = {...msg, payload: {...msg.payload}};\n"}msg.payload.{itemName} = {jsonString};</pre>
        
        return <pre>msg = {jsonString};</pre>
    }

    return (<>
        <FormGroup 
            helperText={selectedOption.helperText}
            label="Take values from:"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleAssignOptionsChange}
                value={selectedOption.value}
                options={assignOptions.map(o => { return { label: o.label, value: o.value }})}
            >
            </HTMLSelect>
        </FormGroup>
        <ControlGroup fill={true} vertical={false} style={{margin:"10px 0", alignItems: "baseline"}}>
            <Label className={Classes.FIXED} style={{margin:"0px 10px 0px 0px"}}>Slice</Label>
            <InputGroup leftIcon="array" placeholder="Source" value={sliceProps.source ?? ""} onChange={e => setProps(e, "source")}/>
            <Label className={Classes.FIXED} style={{margin:"0 10px"}}>as msg.payload</Label>
            <InputGroup leftIcon="dot" placeholder="Item" value={sliceProps.item ?? ""} onChange={e => setProps(e, "item")}/>
        </ControlGroup>
        <Switch checked={sliceProps.mutateMessage} label="Shallow clone the original message and mutate it or create a new one?" onChange={e => setMutateMessage(e)} />
        <Switch checked={sliceProps.includeSliceData} label="Include slice data or just the sliced item?" onChange={e => setIncludeSliceData(e)} />
        <h4>Output message example</h4>
        <MakeMessagePrototype></MakeMessagePrototype>
        </>
    );
}

export default View;