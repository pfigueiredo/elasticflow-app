import React, { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useCustomEventListener } from 'react-custom-events'
import { ControlGroup, Button, InputGroup, HTMLSelect, FormGroup, Classes, Switch } from '@blueprintjs/core';



function View({activity}) {

    console.log("-------------------------");
    console.log(activity.properties)

    const assignOptions = [
        { label: "payload",  value: "0", helperText: "assigns values to 'msg.payload[item]'" },
        { label: "msg",      value: "1", helperText: "assigns values to 'msg[item]'" },
        { label: "process",  value: "2", helperText: "assigns values to 'process.variables' using 'setValue(item, value)'" },
        { label: "flow",     value: "3", helperText: "assigns values to 'flow.variables' using 'setValue(item, value)'" },
        { label: "activity", value: "4", helperText: "assigns values to 'activity.variables' using 'setValue(item, value)'" }
    ];
    
    const valueTypeOptions = [
        { label: "string",   value: "0" },
        { label: "number",   value: "1" },
        { label: "js expr.", value: "2" },
        { label: "jsonata",  value: "3" },
        { label: "http get", value: "4" }
    ];

    const baseState = { ...activity?.properties, assignments: activity?.properties?.assignments ?? [] };

    const [properties, setProperties] = useState(baseState);
    const assignments = useMemo(() => properties.assignments, [properties]);
    const [selectedOption, setSelectedOption] = useState(assignOptions[properties?.type ?? "0"]);

    function updateProperties(properties) {
        console.log(activity.properties);
        activity.properties = properties;
        console.log('set properties on activity');
        console.log(activity.properties);
    }

    function handleAddAssignment() {
        assignments.push({ key: nanoid(), type: "0" });
        const mutated = {...properties, assignments: assignments ?? [] };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function deleteAssignment(a, e) {
        const arr = assignments;
        const elem = arr.find(item => item.key === a.key);
        const index = arr.indexOf(elem)
        arr.splice (index, 1);
        const mutated = {...properties, assignments: assignments ?? [] }
        setProperties(mutated);
        updateProperties(mutated);
    }

    function handleAssignOptionsChange(event) {
        const value = event.currentTarget.value ?? 0;
        const option = assignOptions[value];
        setSelectedOption({...option});

        const mutated = {...properties, type: value };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function setAssignment(assignment, event, property) {
        assignment[property] = event.currentTarget.value;
        const mutated = {...properties, assignments: assignments ?? [] };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function setMutateMessage(e) {
        properties.mutateMessage = e.currentTarget.checked;
        activity.properties = {...properties};
        const mutated = { ...properties };
        setProperties(mutated);
        updateProperties(mutated);
    }

    useCustomEventListener('editor:activityPropertiesChanged', data => {

    });

    function MakeMessagePrototype() {

        let expression = "";

        assignments.forEach((element, i) => {
            let item = element.item;
            let type = element.type;
            let value = element.value;

            let assignExpression = null;
            let itemExpression = null;

            switch (type.toString()) {
                case "0": itemExpression = '"' + value + '"'; break;
                case "1": itemExpression = "" + value + ""; break;
                case "2": itemExpression = "" + value + ""; break;
                case "3": itemExpression = 'await jsonAta("' + value + '")'; break;
                case "4": itemExpression = 'await httpGet("' + value + '")'; break;
                default: itemExpression = type;
            }

            switch (selectedOption.value.toString()) {
                case "0": assignExpression = "msg.payload['" + item + "'] = "+itemExpression+";\n"; break;
                case "1": assignExpression = "msg['" + item + "'] = "+itemExpression+";\n"; break;
                case "2": assignExpression = "process.setValue('" + item + "', "+itemExpression+");\n"; break;
                case "3": assignExpression = "flow.setValue('" + item + "', "+itemExpression+");\n"; break;
                case "4": assignExpression = "activity.setValue('" + item + "', "+itemExpression+");\n"; break;
                case "5": assignExpression = "payload.setValue('" + item + "', "+itemExpression+");\n"; break;
                default: break;
            }

            expression += assignExpression;

        });

        if (properties.mutateMessage)
            return <pre>{"msg = {...msg, payload: {...msg.payload}};\n"}{expression}</pre>
        
        return <pre>{"msg = { payload: {}};\n"}{expression}</pre>
    }

    const getAssignOptions = () => {
        return assignOptions.map(o => { return { label: o.label, value: o.value }})
    }

    return (<>
        <FormGroup 
            helperText={selectedOption.helperText}
            label="Assign values to:"
            labelFor="text-input"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleAssignOptionsChange}
                value={selectedOption.value}
                options={getAssignOptions()}
            >

            </HTMLSelect>
        </FormGroup>
        {
            assignments?.map(a => 
                <ControlGroup key={a.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
                    <InputGroup leftIcon="dot" placeholder="Item" value={a.item ?? ""} onChange={e => setAssignment(a, e, "item")}/>
                    <HTMLSelect className={Classes.FIXED} options={valueTypeOptions} value={a.type ?? 0} onChange={e => setAssignment(a, e, "type")}></HTMLSelect>
                    <InputGroup leftIcon="arrow-left" placeholder="Value" value={a.value ?? ""} onChange={e => setAssignment(a, e, "value")}/>
                    <Button className={Classes.FIXED} intent="none" icon="edit"></Button>
                    <Button className={Classes.FIXED} intent="danger" icon="delete" onClick={e => deleteAssignment(a, e)}></Button>
                </ControlGroup>  
            )
        }
        <Button intent="primary" alignText="left" icon="add" style={{marginTop:"10px", marginBottom:"10px"}} onClick={handleAddAssignment}></Button>
        <Switch checked={properties.mutateMessage} label="Shallow clone the original message and mutate it or create a new one?" onChange={e => setMutateMessage(e)} />
        <h4>Output message example</h4>
        <MakeMessagePrototype></MakeMessagePrototype>
    </>)
    
}

export default View;