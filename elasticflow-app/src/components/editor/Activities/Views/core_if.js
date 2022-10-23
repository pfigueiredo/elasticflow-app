import React, { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useCustomEventListener } from 'react-custom-events'
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
        { label: "any (OR)",  value: "0", helperText: "of the following conditions are true" },
        { label: "all (AND)",  value: "1", helperText: "of the following conditions are true" },
    ];

    const compareOptions = [
        { label: "equal",            value: "0", helperText: "values are equal" },
        { label: "not equal",        value: "1", helperText: "values are not equal" },
        { label: "greater",          value: "2", helperText: "value is greater than" },
        { label: "greater or equal", value: "3", helperText: "value is greater or equal to" },
        { label: "smaller",          value: "4", helperText: "value is smaller than" },
        { label: "smaller or equal", value: "5", helperText: "value is smaller or equal to" },
        { label: "starts with",      value: "6", helperText: "string stars with" },
        { label: "ends with",        value: "7", helperText: "string stars with" },
        { label: "contains",         value: "8", helperText: "list or string contains" },
        { label: "is present in",    value: "9", helperText: "value is present in list or string" },
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

    const baseState = { ...activity?.properties, booleans: activity?.properties?.booleans ?? [] };

    const [properties, setProperties] = useState(baseState);
    const booleans = useMemo(() => properties.booleans, [properties]);
    const [selectedBooleanOptionsOption, setSelectedBooleanOptionsOption] = useState(booleanOptions[properties?.type ?? "0"]);

    function updateProperties(properties) {
        console.log(activity.properties);
        activity.properties = properties;
        console.log('set properties on activity');
        console.log(activity.properties);
    }
    
    function handleBooleanOptionChange(event) {
        const value = event.currentTarget.value ?? 0;
        const option = booleanOptions[value];
        setSelectedBooleanOptionsOption({...option});

        const mutated = {...properties, type: value };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function handleAddBoolean() {
        booleans.push({ key: nanoid(), valueTypeA: "0", valueTypeB: "0", compareOption: "0" });
        const mutated = {...properties, booleans: booleans ?? [] };
        setProperties(mutated);
        updateProperties(mutated);
    }

    function deleteBoolean(a, e) {
        const arr = booleans;
        const elem = arr.find(item => item.key === a.key);
        const index = arr.indexOf(elem)
        arr.splice (index, 1);
        const mutated = {...properties, booleans: booleans ?? [] }
        setProperties(mutated);
        updateProperties(mutated);
    }

    function setBoolenExp(boolean, event, property) {
        boolean[property] = event.currentTarget.value;
        const mutated = {...properties, booleans: booleans ?? [] };
        setProperties(mutated);
        updateProperties(mutated);
    }

    useCustomEventListener('editor:activityPropertiesChanged', data => {

    });

    function IfPrototype() {



        let expressions = booleans?.map((a, i) => {
            const valueTypeA = a.valueTypeA;
            const valueTypeB = a.valueTypeB;
            const valueA = a.valueA;
            const valueB = a.valueB;
            const compareOption = a.compareOption;
            const exp1 =  getValueExpression(valueA, valueTypeA);
            const exp2 =  getValueExpression(valueB, valueTypeB);
            const eq = getCompareExpression(compareOption)
            return StringFormat.call(eq, exp1, exp2);
        });

        return <pre>{"(" + expressions.join(`\n ${sEquals(selectedBooleanOptionsOption.value, 0) ? "or " : "and "}`) + ")"}</pre>
    }

    function getCompareExpression(type) {
        let itemExpression = null;
        switch (type?.toString()) {
            case "0": itemExpression = "{0} == {1}"; break;
            case "1": itemExpression = "{0} != {1}"; break;
            case "2": itemExpression = "{0} > {1}"; break;
            case "3": itemExpression = "{0} >= {1}"; break;
            case "4": itemExpression = "{0} < {1}"; break;
            case "5": itemExpression = "{0} <= {1}"; break;
            case "6": itemExpression = "startsWith({0},{1})"; break;
            case "7": itemExpression = "endsWith({0},{1})"; break;
            case "8": itemExpression = "contains({0},{1})"; break;
            case "9": itemExpression = "isPresentIn({0},{1})"; break;
            default: itemExpression = "..."; break;
        }
        return itemExpression
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

    function EntryName(index, key, booleanOption) {
        if (index > 0)
            return <h5 id={"L1" + key} style={{margin:2, marginTop:8}}>{sEquals(booleanOption, 0) ? "or" : "and"} {String.fromCharCode("A".charCodeAt(0) + index)}</h5>
        else
            return <h5 id={"L2" + key} style={{margin:2}}>{String.fromCharCode("A".charCodeAt(0) + index)}</h5>
    }

    const getBooleanOptions = () => {
        return booleanOptions.map(o => { return { label: o.label, value: o.value }})
    }

    return (<>
        <FormGroup 
            helperText={selectedBooleanOptionsOption.helperText}
            label="If:"
            labelFor="if-type"
            fill={true}>
            <HTMLSelect id="if-type"
                fill={true} 
                onChange={handleBooleanOptionChange}
                value={selectedBooleanOptionsOption.value}
                options={getBooleanOptions()}
            >
            </HTMLSelect>
        </FormGroup>
        {
            booleans?.map((a, i) => <>
                {EntryName(i, a.key, selectedBooleanOptionsOption.value)}
                <ControlGroup key={"A" + a.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
                    <HTMLSelect className={Classes.FIXED} options={valueTypeOptions} value={a.valueTypeA ?? 0} onChange={e => setBoolenExp(a, e, "valueTypeA")}/>
                    <InputGroup leftIcon="arrow-right" placeholder="Value" value={a.valueA ?? ""} onChange={e => setBoolenExp(a, e, "valueA")}/>
                </ControlGroup>    
                <ControlGroup key={"E" + a.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
                    <HTMLSelect className={Classes.FIXED} options={compareOptions} value={a.compareOption ?? 0} onChange={e => setBoolenExp(a, e, "compareOption")}/>
                    <Button className={Classes.FIXED} intent="danger" icon="delete" onClick={e => deleteBoolean(a, e)}></Button>
                </ControlGroup>  
                <ControlGroup key={"B" + a.key} fill={true} vertical={false} style={{marginTop:"10px"}}>
                    <HTMLSelect className={Classes.FIXED} options={valueTypeOptions} value={a.valueTypeB ?? 0} onChange={e => setBoolenExp(a, e, "valueTypeB")}/>
                    <InputGroup leftIcon="arrow-right" placeholder="Value" value={a.valueB ?? ""} onChange={e => setBoolenExp(a, e, "valueB")}/>
                </ControlGroup>
                </>
            )
        }
        <Button intent="primary" alignText="left" icon="add" style={{marginTop:"10px", marginBottom:"10px"}} onClick={handleAddBoolean}></Button>
        
        <h4>If example</h4>
        <IfPrototype></IfPrototype>
    </>)
    
}

export default View;