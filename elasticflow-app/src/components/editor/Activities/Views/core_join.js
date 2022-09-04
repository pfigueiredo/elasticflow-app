import React, { useState } from 'react';
import { Button, ButtonGroup, FormGroup, HTMLSelect } from '@blueprintjs/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'

function View({activity}) {

    const joinTypeOptions = [
        { label: "AND Join", value: 0, helperText: "Waits for all messages to be available before continuing." },
        { label: "OR Join", value: 1, helperText: "Continues with any messages available in the input." },
        { label: "XOR Join", value: 2, helperText: "Continues with each message available in the input. (this is the normal beaviour when 2 or more wires connect to any activity)" }
    ];

    const outputOptions = [
        { label: "First Message", value: 0, helperText: "Outputs the first message" },
        { label: "Merge Messages", value: 1, helperText: "Ouputs Shallow Merge messages payloads" },
        { label: "All Messages", value: 2, helperText: "Outputs and array of all the messages payloads" },
        { label: "User Defined", value: 3, helperText: "Calls user code to deal with messages" }
    ];

    const [properties, setProperties] = useState(activity.properties ?? { joinType: 0, outputType: 0 });
    const [selectedJoinTypeOption, setSelectedJoinTypeOption] = useState(joinTypeOptions[properties?.joinType ?? 0]);
    const [selectedOutputOption, setSelectedOutputOption] = useState(outputOptions[properties?.outputType ?? 0]);
    const [code, setCode] = useState(activity.properties.functionCode ?? "");

    function updateProperties() {
        activity.properties = properties;
    }

    function handleJoinTypeOptionChange(event) {
        let value = event.currentTarget.value;
        let option = joinTypeOptions[value ?? 0];
        setSelectedJoinTypeOption({...option});
        setProperties({...properties, joinType: value})
        updateProperties();
    }

    function handleOuputOptionChange(event) {
        let value = event.currentTarget.value;
        let option = outputOptions[value ?? 0];
        setSelectedOutputOption({...option});
        setProperties({...properties, outputType: value})
        updateProperties();
    }

    function editCode() {
        emitCustomEvent('editor:editActivityCode', { code: code, activity: activity });
    }

    useCustomEventListener('editor:activityCodeChanged', data => {
        setCode(activity?.properties?.functionCode ?? "");
    });

    return <>
        <FormGroup 
            helperText={selectedJoinTypeOption.helperText}
            label="Type of Join:"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleJoinTypeOptionChange}
                value={selectedJoinTypeOption.value}
                options={joinTypeOptions.map(o => { return { label: o.label, value: o.value }})}
            >

            </HTMLSelect>
        </FormGroup>
        <FormGroup 
            helperText={selectedOutputOption.helperText}
            label="Output Options:"
            fill={true}>
            <HTMLSelect 
                fill={true} 
                onChange={handleOuputOptionChange}
                value={selectedOutputOption.value}
                options={outputOptions.map(o => { return { label: o.label, value: o.value }})}
            >

            </HTMLSelect>
        </FormGroup>
        <ButtonGroup fill={true}>
            <Button disabled={selectedOutputOption?.value !== 3} intent="primary" alignText="left" icon="code" onClick={editCode}>Edit User Code</Button>
        </ButtonGroup>
        <pre>
            { JSON.stringify(activity.properties) }
        </pre>
    </>
}

export default View;