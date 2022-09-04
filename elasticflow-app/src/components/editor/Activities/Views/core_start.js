import { Button, FormGroup, HTMLSelect, InputGroup } from '@blueprintjs/core';
import React, { useMemo, useState } from 'react';

const startOptions = [
    { label: "http", value: 0, type:"http", helperText: "trigger activity from an http api gateway event" },
    { label: "s3", value: 1, type:"s3", helperText: "trigger activity from a s3 event" },
    { label: "sqs", value: 2, type:"sqs", helperText: "trigger activity from a sqs event" },
    { label: "e-flow", value: 3, type:"e-flow", helperText: "trigger activity from a e-flow event" },
];

const eventOptions = [
    { label: "GET", value: 0, method:"GET", startType: 0, helperText: "accept http GET methods" },
    { label: "POST", value: 1, method:"POST" ,startType: 0, helperText: "accept http POST methods" },
    { label: "PUT", value: 2, method:"PUT", startType: 0, helperText: "accept http PUT methods" },
    { label: "DELETE", value: 3, method:"DELETE", startType: 0, helperText: "accept http DELETE methods" },

    { label: "ANY", value: 4, method:"ANY", startType: 1, helperText: "accept any event type" },
    { label: "ANY", value: 5, method:"ANY", startType: 2, helperText: "accept any event type" },
    { label: "ANY", value: 6, method:"ANY", startType: 3, helperText: "accept any event type" }
];

function getStartTypeIndex(startTypeName) {
    for (let i = 0; i < startOptions.length; i++) {
        const op = startOptions[i];
        if (op.type == startTypeName) {
            return i;
        }
    }
    return 0;
}

function getEventOptions(startType, method) {
    let fullFind, partialFind
    for (let i = 0; i < eventOptions.length; i++) {
        const op = eventOptions[i];
        if (op.startType == startType && !partialFind)
            partialFind = op;
        if (op.startType == startType && op.method == method ) {
            fullFind = op;
            break;
        }
    }

    return fullFind ?? partialFind ?? eventOptions[0];
}

function filterEventOptions(startType) {
    return eventOptions.filter(o => o.startType == startType);
}

function View({activity}) {

    const startTypeName = activity?.properties?.type ?? 0;
    const startMethod = activity?.properties?.method ?? null;
    const startType = getStartTypeIndex(startTypeName);

    const [stateNumber, setStateNumber] = useState(0);
    const [selectedStartOption, setSelectedStartOption] = useState(startOptions[startType]);
    const filteredEventOptions = useMemo(() => filterEventOptions(selectedStartOption.value), [selectedStartOption.value]);
    const [selectedMethodOption, setSelectedMethodOption] = useState(getEventOptions(startType, startMethod));
    
    console.log('new render starting');
    console.log(activity?.properties);
    console.log(`my CURRENT target options is ` + selectedStartOption?.label);
    console.log(`my CURRENT method options is ` + selectedMethodOption?.label);

    function setProps(e, key) {
        const propertiesMutation = {...activity.properties};
        propertiesMutation[key] = e.currentTarget.value;
        activity.properties = propertiesMutation;
        setStateNumber(stateNumber + 1);
    }

    function handleStartOptionsChange(event) {
        const value = event.currentTarget.value;

        console.log(`new value received if ${value}`);

        const option = startOptions[value ?? 0];
        const mOption = getEventOptions(value, null);

        console.log(`my new target options is ${option.label} over ${option.value}`);
        console.log(`my new method options is ${mOption.label} over ${option.value}`);

        const propertiesMutation = {...activity.properties, type:option.type, method: mOption.method}
        activity.properties = propertiesMutation;

        console.log(propertiesMutation);

        setSelectedStartOption({...option});
        setSelectedMethodOption({...mOption});
        // setProperties(propertiesMutation);
    }

    function handleMethodOptionsChange(event) {
        const value = event.currentTarget.value;
        const option = filteredEventOptions[value ?? 0];
        const propertiesMutation = {...activity.properties, method: option.method};
        activity.properties = propertiesMutation;

        setSelectedMethodOption({...option});
        // setProperties(propertiesMutation);

    }

    return (
        <>
        <FormGroup 
            helperText={selectedStartOption?.helperText}
            label="Entry Point Type:"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleStartOptionsChange}
                value={selectedStartOption?.value}
                options={startOptions.map(o => { return { label: o.label, value: o.value }})}
            >
            </HTMLSelect>
        </FormGroup>
        <FormGroup 
            helperText={selectedMethodOption?.helperText}
            label="Method Type:"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleMethodOptionsChange}
                value={selectedMethodOption?.value}
                options={filteredEventOptions.map(o => { return { label: o.label, value: o.value }})}
            >
            </HTMLSelect>
        </FormGroup>eslint
        <FormGroup 
            helperText="entry point / endpoint from the event"
            label="Entry Point:"
            fill={true}>
            <InputGroup leftIcon="arrow-down" placeholder="Source" value={activity.properties.entryPoint ?? ""} onChange={e => setProps(e, "entryPoint")}/>
        </FormGroup>
        <Button rightIcon="clipboard" minimal={true} intent="success" small={true} fill={false}
            onClick={() => {navigator.clipboard.writeText(`https://y0z3wcq4bf.execute-api.eu-west-1.amazonaws.com/default${activity.properties.entryPoint ?? ""}`)}}
        >Copy api link to clipboard.</Button>
        </>
    )
}

export default View;