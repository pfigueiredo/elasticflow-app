import React, { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { ControlGroup, Button, InputGroup, HTMLSelect, FormGroup, Classes } from '@blueprintjs/core';
import { sEquals } from './utils';

function StringFormat() {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if the related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function (match, index) {
      // check if the argument is present
      return typeof args[index] == 'undefined' ? match : args[index];
    });
  };

function View({activity}) {

    console.log("-------------------------");
    console.log(activity.properties)

    const booleanOptions = [
        { label: "first (XOR)",  value: "0", helperText: "follow the path of the first valid option" },
        { label: "all (OR)",     value: "1", helperText: "follow all paths of all the valid options" },
    ];

    const value2TypeOptions = [
        { label: "string",   value: "0" },
        { label: "number",   value: "1" }
    ];
    
    const valueTypeOptions = [
        { label: "string",   value: "0" },
        { label: "number",   value: "1" },
        { label: "js expr.", value: "2" },
        { label: "jsonata",  value: "3" },
        { label: "http get", value: "4" },
        { label: "flow data", value: "5" },
        { label: "activity data", value: "6" },
        { label: "process data", value: "7" },
        { label: "payload", value: "8" },
        { label: "msg", value: "9" }
    ];

    const baseState = { ...activity?.properties, values: activity?.properties?.values ?? [] };

    

    const [properties, setProperties] = useState(baseState);
    const values = useMemo(() => properties.values, [properties]);
    const [selectedBooleanOption, setSelectedBooleanOption] = useState(booleanOptions[properties?.type ?? "0"]);
    const [selectedValueTypeOption, setSelectedValueTypeOption] = useState(valueTypeOptions[properties?.origin ?? "0"]);
    const [expression, setExpression] = useState(properties?.expression ?? "");

    console.log(properties);

    function updateProperties(properties) {
        console.log(activity.properties);
        activity.properties = properties;
        console.log('set properties on activity');
        console.log(activity.properties);
    }
    
    function handleExpressionChange(event) {
        const value = event.currentTarget.value;
        const mutated = { ...properties, expression: value };
        setExpression(value);
        setProperties(mutated);
        updateProperties(mutated);
    }

    function handleBooleanOptionChange(event) {
        const value = event.currentTarget.value ?? 0;
        const option = booleanOptions[value];
        setSelectedBooleanOption({...option});

        const mutated = {...properties, type: value };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function handleValueTypeOptionChange(event) {
        const value = event.currentTarget.value ?? 0;
        const option = valueTypeOptions[value];
        setSelectedValueTypeOption({...option});

        const mutated = {...properties, origin: value };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function handleAddValue() {
        values.push({ key: nanoid(), valueType: "0" });
        const mutated = {...properties, values: values ?? [] };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function deleteValue(a, e) {
        const arr = values;
        const elem = arr.find(item => item.key === a.key);
        const index = arr.indexOf(elem)
        arr.splice (index, 1);
        const mutated = {...properties, values: values ?? [] }
        setProperties(mutated);
        updateProperties(mutated);
    }

    function setBoolenExp(boolean, event, property) {
        boolean[property] = event.currentTarget.value;
        const mutated = {...properties, values: values ?? [] };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function IfPrototype() {

        const type = properties.type;
        const valueExpression =  getValueExpression(properties.expression, properties.origin);
        let switchExpression = `const value = ${valueExpression}\n`;

        let expressions = values?.map((a, i) => {
            const valueType = a.valueType;
            const value = a.value;
            const exp = getValue2Expression(value, valueType, type, i);
            return exp;
        });

        switchExpression += "swicth (value) {\n";
        switchExpression += expressions.join("\n");
        switchExpression += "\n}\n";

        return <pre>{switchExpression}</pre>
    }

    function getValue2Expression(value, valueType, booleanType, i) {
        const doBreak = booleanType == "0";
        let expression = null;
        switch (valueType) {
            case "0": expression = '"' + value + '"'; break;
            case "1": expression = "" + value + ""; break;
            default: expression = '"' + value + '"'; break;
        }
        return `\tcase ${expression}: context.continueWith(msg, ${i}); ${((doBreak) ? "break;" : "")}`;
    }

    function getValueExpression(value, valueType) {
        let itemExpression = null;
        switch (valueType?.toString()) {
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
            default: itemExpression = valueType?.toString();
        }
        return itemExpression;
    }

    const getValueTypeOptions = () => {
        return valueTypeOptions.map(o => { return { label: o.label, value: o.value }})
    }

    const getBooleanOptions = () => {
        return booleanOptions.map(o => { return { label: o.label, value: o.value }})
    }

    return (<>
        <FormGroup 
            helperText={selectedBooleanOption?.helperText}
            label="Switch:"
            labelFor="switch-type"
            fill={true}>
            <HTMLSelect id="switch-type"
                fill={true} 
                onChange={handleBooleanOptionChange}
                value={selectedBooleanOption?.value}
                options={getBooleanOptions()}
            >
            </HTMLSelect>
        </FormGroup>
        <FormGroup 
            helperText={selectedValueTypeOption?.helperText}
            label="Origin"
            labelFor="select-origin"
            fill={true}>
                <ControlGroup>
                    <HTMLSelect id="select-origin"
                        onChange={handleValueTypeOptionChange}
                        value={selectedValueTypeOption?.value}
                        options={getValueTypeOptions()}
                    >
                    </HTMLSelect>
                    <InputGroup fill={true} leftIcon="arrow-right" placeholder="Value" value={expression ?? ""} onChange={e => handleExpressionChange(e)}/>
            </ControlGroup>
        </FormGroup>
        <h5 style={{margin:2}}>Compare Options</h5>
        {
            values?.map((a, i) => <>
                <ControlGroup key={"A" + a.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
                    <HTMLSelect className={Classes.FIXED} options={value2TypeOptions} value={a.valueType ?? 0} onChange={e => setBoolenExp(a, e, "valueType")}/>
                    <InputGroup leftIcon="arrow-left" placeholder="Value" value={a.value ?? ""} onChange={e => setBoolenExp(a, e, "value")}/>
                    <Button className={Classes.FIXED} intent="danger" icon="delete" onClick={e => deleteValue(a, e)}></Button>
                </ControlGroup>    
                </>
            )
        }
        <Button intent="primary" alignText="left" icon="add" style={{marginTop:"10px", marginBottom:"10px"}} onClick={handleAddValue}></Button>
        
        <h4>Switch example</h4>
        <IfPrototype></IfPrototype>
    </>)
    
}

export default View;