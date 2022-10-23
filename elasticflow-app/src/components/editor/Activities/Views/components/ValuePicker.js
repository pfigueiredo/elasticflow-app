
import React, { useState, useCallback } from 'react';
import { InputGroup, HTMLSelect, FormGroup, ControlGroup, Classes } from '@blueprintjs/core';

const originOptions = [
    { label: "string",   value: "0", helperText:"expression value is a string"},
    { label: "number",   value: "1", helperText:"expression value is a number" },
    { label: "js expr.", value: "2", helperText:"expression value is a js expression" },
    { label: "jsonata",  value: "3", helperText:"expression value is a jsonata expression" },
    { label: "http get", value: "4", helperText:"expression value ia a url" },
    { label: "flow data", value: "5", helperText:"expression value is a key in flow.data" },
    { label: "activity data", value: "6", helperText:"expression value is a key in activity.data" },
    { label: "process data", value: "7", helperText:"expression value is a key in process.data" },
    { label: "payload", value: "8", helperText:"expression value is a property of payload" },
    { label: "msg", value: "9", helperText:"expression value is a property of msg" },
];

const VariableInput = (props) => {
    return (props.assignToVariable) ?
        <InputGroup id="txtVariable" leftIcon="dot" placeholder="Variable" value={props.variable} onChange={props.onChange}/>
        : <></>;
}

function ValuePicker(props) {

    const allowAllOrigins =            !!(props?.allowAll ?? false);
    const allowConstantOrigins =       !!(props?.allowConstantOrigins ?? allowAllOrigins);
    const allowExpressionOrigins =     !!(props?.allowExpressionOrigins ?? allowAllOrigins);
    const allowHttpOrigins =           !!(props?.allowHttpOrigins ?? allowAllOrigins);
    const allowTransformationOrigins = !!(props?.allowTransformationOrigins ?? allowAllOrigins);
    const allowStorageOrigins =        !!(props?.allowStorageOrigins ?? allowAllOrigins);
    const allowMessageOrigins =        !!(props?.allowMessageOrigins ?? allowAllOrigins);
    const assignToVariable =           props?.assignToVariable ?? false;
    const label = props?.label ?? "From [Origin] get [Expression]";

    const [selectedOrigin, setSelectedOrigin] = useState(originOptions[props?.origin ?? "0"]);
    const [expression, setExpression] = useState(props?.expression);
    const [variable, setVariable] = useState(props?.variable);

    const handleVariableChange = useCallback((event) => {
        const value = event.currentTarget.value;
        setVariable(value);
        props?.onVariableChange?.apply(null, [value, event])
    }, [props?.onVariableChange]);

    const handleExpressionChange = useCallback((event) => {
        const value = event.currentTarget.value;
        setExpression(value);
        props?.onExpressionChange?.apply(null, [value, event])
    }, [props?.onExpressionChange]);

    const handleOriginChange = useCallback((event) => {
        const value = event.currentTarget.value ?? 0;
        const filteredOptions = originOptions.filter(o => o.value === value);
        if (filteredOptions.length > 0) {
            const option = filteredOptions[0];
            setSelectedOrigin({...option});
            props?.onOriginChange?.apply(null, [option.value, event])
        }
    }, [props?.onOriginChange]);

    const isOriginAllowed = useCallback((origin) => {
        switch (origin.value) {
            case "0":
            case "1": return allowConstantOrigins;
            case "2": return allowExpressionOrigins;
            case "3": return allowTransformationOrigins;
            case "4": return allowHttpOrigins;
            case "5": 
            case "6": 
            case "7": return allowStorageOrigins;
            case "8": 
            case "9": return allowMessageOrigins; 
            default: return false;
        }
    }, [allowConstantOrigins, allowExpressionOrigins, 
        allowTransformationOrigins, allowHttpOrigins, 
        allowStorageOrigins, allowMessageOrigins]
    );

    const getOriginOptions = useCallback(() => {
        const filtered = originOptions.filter(o => isOriginAllowed(o));
        return filtered.map(o => { return { label: o.label, value: o.value }})
    }, [isOriginAllowed]);

    return (
        <>
            <FormGroup 
                helperText={selectedOrigin.helperText}
                label={label}
                labelFor="selectOrigin"
                fill={true}
            >
                <ControlGroup fill={true} vertical={false}>
                    <VariableInput
                        assignToVariable={assignToVariable}
                        variable={variable}
                        onChange={handleVariableChange}
                    ></VariableInput>
                    <HTMLSelect id="selectOrigin" style={{width: "180px"}} 
                        className={Classes.FIXED}
                        onChange={handleOriginChange}
                        value={selectedOrigin.value}
                        options={getOriginOptions()}
                    >
                    </HTMLSelect>
                    <InputGroup id="txtExpression" leftIcon="arrow-left" placeholder="Value Expression" value={expression} onChange={handleExpressionChange}/>
                </ControlGroup>
            </FormGroup>
        </>
    )
}

export default ValuePicker;