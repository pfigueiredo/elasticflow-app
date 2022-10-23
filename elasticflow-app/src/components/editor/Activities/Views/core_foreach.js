import React, { useState, useCallback, useMemo } from 'react';
import ValuePicker from './components/ValuePicker'
import AssignPicker from './components/AssignPicker';

function View({activity}) {

    if (!activity?.properties) activity.properties = {};
    activity.properties.listOrigin = activity.properties.listOrigin ?? "8";
    activity.properties.listExpression = activity.properties.listExpression ?? "";
    activity.properties.elementVarDest = activity.properties.elementVarDest ?? "0";
    activity.properties.elementVar = activity.properties.elementVar ?? "element";

    const baseState = useMemo(() => activity.properties ?? {}, [activity.properties]);
    const [listOrigin, setListOrigin] = useState(baseState?.listOrigin ?? "0");
    const [listExpression, setListExpression] = useState(baseState?.listExpression ?? "");

    const [elementVarDest, setElementVarDest] = useState(baseState?.elementVarDest ?? "0");
    const [elementVar, setElementVar] = useState(baseState?.elementVar ?? "");

    const updateProperties = useCallback((properties) => {
        activity.properties = properties;
        console.log('set properties on activity');
        console.log(activity.properties);
    }, [activity])

    const handleExpressionChange = useCallback((value) => {
        setListExpression(value);
        updateProperties({...baseState, listExpression: value})
    }, [baseState, updateProperties, setListExpression]);

    const handleOriginChange = useCallback((value) => {
        setListOrigin(value);
        updateProperties({...baseState, listOrigin: value})
    }, [baseState, updateProperties, setListOrigin]);


    const handleAssignVariableChange = useCallback((value) => {
        setElementVar(value);
        updateProperties({...baseState, elementVar: value})
    }, [baseState, updateProperties, setElementVar]);

    const handleAssignOptionChange = useCallback((value) => {
        setElementVarDest(value);
        updateProperties({...baseState, elementVarDest: value})
    }, [baseState, updateProperties, setElementVarDest]);

    return (
        <>
            <ValuePicker label="For each element in (List/Array)" 
                onExpressionChange={handleExpressionChange}
                onOriginChange={handleOriginChange}
                origin={listOrigin}
                expression={listExpression}
                allowConstantOrigins={false}
                allowExpressionOrigins={true}
                allowMessageOrigins={true}
                allowStorageOrigins={true}
            ></ValuePicker>
            <AssignPicker label="Fill a variable"
                allowMessageDestinations={true}
                allowStorageDestinations={true}
                assignTo={elementVarDest}
                variable={elementVar}
                assignToVariable={true}
                onAssignOptionChange={handleAssignOptionChange}
                onVariableChange={handleAssignVariableChange}
            ></AssignPicker>
            {/* <pre>
                { JSON.stringify(baseState, null, 2) }
            </pre> */}
        </>
    )

}

export default View;