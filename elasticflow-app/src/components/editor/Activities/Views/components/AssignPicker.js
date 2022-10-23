import React, { useState, useCallback } from "react";
import { HTMLSelect, FormGroup, InputGroup, ControlGroup, Classes } from '@blueprintjs/core';

const assignOptions = [
    { label: "payload",  value: "0", helperText: "assigns values to 'msg.payload[item]'" },
    { label: "msg",      value: "1", helperText: "assigns values to 'msg[item]'" },
    { label: "process",  value: "2", helperText: "assigns values to 'process.variables' using 'setValue(item, value)'" },
    { label: "flow",     value: "3", helperText: "assigns values to 'flow.variables' using 'setValue(item, value)'" },
    { label: "activity", value: "4", helperText: "assigns values to 'activity.variables' using 'setValue(item, value)'" }
];

const VariableInput = (props) => {
    return (props.assignToVariable) ?
        <InputGroup id="txtVariable" leftIcon="dot" placeholder="Variable" value={props.variable} onChange={props.onChange}/>
        : <></>;
}

function AssignPicker(props) {

    const allowAllDestinations =            !!(props?.allowAll ?? false);
    const allowMessageDestinations =       !!(props?.allowMessageDestinations ?? allowAllDestinations);
    const allowStorageDestinations =        !!(props?.allowStorageDestinations ?? allowAllDestinations);
    const assignToVariable =           props?.assignToVariable ?? false;
    const label = props?.label ?? "Assign value to";

    const [selectedOption, setSelectedOption] = useState(assignOptions[props?.assignTo ?? "0"]);
    const [variable, setVariable] = useState(props?.variable);

    const handleVariableChange = useCallback((event) => {
        const value = event.currentTarget.value;
        setVariable(value);
        props?.onVariableChange?.apply(null, [value, event])
    }, [props?.onVariableChange]);

    const handleAssignOptionsChange = useCallback((event) => {
        const value = event.currentTarget.value ?? 0;
        const filteredOptions = assignOptions.filter(o => o.value === value);
        if (filteredOptions.length > 0) {
            const option = filteredOptions[0];
            setSelectedOption({...option});
            props?.onAssignOptionChange?.apply(null, [option.value, event])
        }
    }, [props?.onAssignOptionChange]);

    const isOriginAllowed = useCallback((origin) => {
        switch (origin.value) {
            case "0":
            case "1": return allowMessageDestinations;
            case "2": 
            case "3": 
            case "4": return allowStorageDestinations;
            default: return false;
        }
    }, [allowMessageDestinations, allowStorageDestinations]);

    const getAssignOptions = useCallback(() => {
        const filtered = assignOptions.filter(o => isOriginAllowed(o));
        return filtered.map(o => { return { label: o.label, value: o.value }})
    }, [isOriginAllowed]);

    return (
        <FormGroup 
            helperText={selectedOption.helperText}
            label={label}
            labelFor="selectAssign"
            fill={true}>
                <ControlGroup fill={true} vertical={false}>
                <HTMLSelect id="selectAssign" style={{width: "180px"}} 
                    className={Classes.FIXED}
                    onChange={handleAssignOptionsChange}
                    value={selectedOption.value}
                    options={getAssignOptions()}
                >
                </HTMLSelect>
                <VariableInput
                    assignToVariable={assignToVariable}
                    variable={variable}
                    onChange={handleVariableChange}
                ></VariableInput>
            </ControlGroup>
        </FormGroup>
    )

}

export default AssignPicker;