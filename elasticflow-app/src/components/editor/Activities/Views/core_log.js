import React, { useState } from 'react';
import { InputGroup, HTMLSelect, FormGroup } from '@blueprintjs/core';

function View({activity}) {

    console.log("-------------------------");
    console.log(activity.properties)
    
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

    const logLevels = [
        { label: "note", value: "0", helperText:"defined a 'note' entry in the flow log" },
        { label: "debug", value: "1", helperText:"defined a 'debug' entry in the flow log" },
        { label: "log", value: "2", helperText:"defined a 'log' entry in the flow log" },
        { label: "info",  value: "3", helperText:"defined an 'info' entry in the flow log" },
        { label: "warn", value: "4", helperText:"defined a 'warn' entry in the flow log" },
        { label: "error", value: "5", helperText:"defined an 'error' entry in the flow log" }
    ];

    const baseState = { ...activity?.properties };

    if (!baseState.origin) baseState.origin = "0";
    if (!baseState.level) baseState.origin = "2";

    const [properties, setProperties] = useState(baseState);
    const [selectedOrigin, setSelectedOrigin] = useState(originOptions[properties?.origin ?? "0"]);
    const [selectedLevel, setSelectedLevel] = useState(originOptions[properties?.level ?? "0"]);
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

    function handleLevelChange(event) {
        const value = event.currentTarget.value ?? 0;
        const option = originOptions[value];
        setSelectedLevel({...option});

        const mutated = {...properties, level: value };
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

    function MakeMessagePrototype() {

        const value = expression;
        let msgExpression = null;
        let itemExpression = null;
        let fnExpression = null

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

        switch (properties.level?.toString()) {
            case "0": fnExpression = "note"; break;
            case "1": fnExpression = "debug"; break;
            case "2": fnExpression = "log"; break;
            case "3": fnExpression = "info"; break;
            case "4": fnExpression = "warn"; break;
            case "5": fnExpression = "error"; break;
            default: fnExpression = "log"; break;
        }

        msgExpression = `context.console.${fnExpression}(${itemExpression})`;

        return <pre>{msgExpression}</pre>
    }

    const getOriginOptions = () => {
        return originOptions.map(o => { return { label: o.label, value: o.value }})
    }

    const getLevelOptions = () => {
        return logLevels.map(o => { return { label: o.label, value: o.value }})
    }

    return (<>
        <FormGroup 
            helperText={selectedLevel.helperText}
            label="Log Level:"
            labelFor="selectLogLevel"
            fill={true}>
            <HTMLSelect id="selectLogLevel"
                fill={true} 
                onChange={handleLevelChange}
                value={selectedLevel.value}
                options={getLevelOptions()}
            >
            </HTMLSelect>
        </FormGroup>
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
            helperText="define a value or expression to be logged"
            label="Value / Expression:"
            labelFor="txtExpression"
            fill={true}>
            <InputGroup id="txtExpression" leftIcon="arrow-left" placeholder="Value Expression" value={expression} onChange={handleExpressionChange}/>
        </FormGroup>

        <h4>Log expression example</h4>
        <MakeMessagePrototype></MakeMessagePrototype>
    </>)
    
}

export default View;