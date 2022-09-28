import React, { useState } from 'react';
import { InputGroup, HTMLSelect, FormGroup } from '@blueprintjs/core';


function View({activity}) {

    const originOptions = [
        { label: "string",   value: "0", helperText:"defined value is a string"},
        { label: "number",   value: "1", helperText:"defined value is a number" },
        { label: "js expr.", value: "2", helperText:"defined value is a js expression" },
        { label: "jsonata",  value: "3", helperText:"defined value is a jsonata expression" },
        { label: "http get", value: "4", helperText:"defined value ia a url" },
        { label: "flow data", value: "5", helperText:"defined value is a key in flow.data" },
        { label: "activity data", value: "6", helperText:"defined value is a key in activity.data" },
        { label: "process data", value: "7", helperText:"defined value is a key in process.data" },
        { label: "payload", value: "8", helperText:"defined value is a property of payload" },
        { label: "msg", value: "9", helperText:"defined value is a property of msg" },
    ];

    const baseState = { ...activity?.properties };

    if (!baseState.origin) baseState.origin = "9";
    if (!baseState.type) baseState.type = "0";
    if (!baseState.expression) baseState.expression = "payload";
    
    const [properties, setProperties] = useState(baseState);
    const [selectedOrigin, setSelectedOrigin] = useState(originOptions[properties?.origin ?? "0"]);
    const [expression, setExpression] = useState(properties?.expression);

    function updateProperties(properties) {
        console.log(activity.properties);
        activity.properties = properties;
        console.log('set properties on activity');
        console.log(activity.properties);
    }

    function handleOriginChange(event) { 
        const value = event.currentTarget.value ?? 0;
        const option = originOptions[value];
        setSelectedOrigin({...option});

        const mutated = {...properties, origin: value };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function handleExpressionChange(event) { 
        const value = event.currentTarget.value;
        setExpression(value);

        const mutated = {...properties, expression: value };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function MessagePrototype() {

        const value = expression;
        let msgExpression = null;
        let itemExpression = null;

        switch (properties.origin.toString()) {
            case "0": itemExpression = '"' + value + '"'; break;
            case "1": itemExpression = "" + value + ""; break;
            case "2": itemExpression = "" + value + ""; break;
            case "3": itemExpression = 'await jsonAta("' + value + '")'; break;
            case "4": itemExpression = 'await httpGet("' + value + '")'; break;
            case "5": itemExpression = 'await flow.data.getValue("' + value + '")'; break;
            case "6": itemExpression = 'await activity.data.getValue("' + value + '")'; break;
            case "7": itemExpression = 'await process.data.getValue("' + value + '")'; break;
            case "8": itemExpression = 'msg.payload["' + value + '"]'; break;
            case "9": itemExpression = 'msg["' + value + '"]'; break;
            default: itemExpression = ""; break;
        }

        msgExpression = `context.response = ${itemExpression}`;

        return <pre>{msgExpression}</pre>
    }

    const getOriginOptions = () => {
        return originOptions.map(o => { return { label: o.label, value: o.value }})
    }

    return <>
        <FormGroup 
            helperText={selectedOrigin.helperText}
            label="Value is / Get From:"
            labelFor="selectOrigin"
            fill={true}>
            <HTMLSelect id="selectOrigin"
                fill={true} 
                onChange={handleOriginChange}
                value={selectedOrigin.value}
                options={getOriginOptions()}
            >
            </HTMLSelect>
        </FormGroup>

        <FormGroup 
            helperText="Define a value or expression to be sent to the caller as a response"
            label="Value / Expression:"
            labelFor="txtExpression"
            fill={true}>
            <InputGroup id="txtExpression" leftIcon="arrow-left" placeholder="Value Expression" value={expression} onChange={handleExpressionChange}/>
        </FormGroup>
        <MessagePrototype></MessagePrototype>
    </>

}

export default View;