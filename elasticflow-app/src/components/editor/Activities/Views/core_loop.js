import React, { useState, useCallback, useMemo } from 'react';
import ValuePicker from './components/ValuePicker'
import AssignPicker from './components/AssignPicker';

function View({activity}) {

    if (!activity?.properties) activity.properties = {};
    
    activity.properties.iteratorVarDest = activity.properties.iteratorVarDest ?? "0";
    activity.properties.iteratorVar = activity.properties.iteratorVar ?? "index";

    activity.properties.limitOrigin = activity.properties.limitOrigin ?? "1";
    activity.properties.limitExpression = activity.properties.limitExpression ?? "";

    activity.properties.stepOrigin = activity.properties.stepOrigin ?? "1";
    activity.properties.stepExpression = activity.properties.stepExpression ?? "1";


    const baseState = useMemo(() => activity.properties ?? {}, [activity.properties]);

    const [iteratorVarDest, setIteratorVarDest] = useState(baseState.iteratorVarDest);
    const [iteratorVar, setIteratorVar] = useState(baseState.iteratorVar);

    const [limitOrigin, setLimitOrigin] = useState(baseState.limitOrigin);
    const [limitExpression, setLimitExpression] = useState(baseState.limitExpression);

    const [stepOrigin, setStepOrigin] = useState(baseState.stepOrigin);
    const [stepExpression, setStepExpression] = useState(baseState.stepExpression);

    const updateProperties = useCallback((properties) => {
        activity.properties = properties;
        console.log('set properties on activity');
        console.log(activity.properties);
    }, [activity])

    const handleIteratorVarDestChange = useCallback((value) => {
        setIteratorVarDest(value);
        updateProperties({...baseState, iteratorVarDest: value})
    }, [baseState, updateProperties, setIteratorVarDest]);

    const handleIteratorVarChange = useCallback((value) => {
        setIteratorVar(value);
        updateProperties({...baseState, iteratorVar: value})
    }, [baseState, updateProperties, setIteratorVar]);

    const handleLimitExpressionChange = useCallback((value) => {
        setLimitExpression(value);
        updateProperties({...baseState, limitExpression: value})
    }, [baseState, updateProperties, setLimitExpression]);

    const handleLimitOriginChange = useCallback((value) => {
        setLimitOrigin(value);
        updateProperties({...baseState, limitOrigin: value})
    }, [baseState, updateProperties, setLimitOrigin]);

    const handleStepExpressionChange = useCallback((value) => {
        setStepExpression(value);
        updateProperties({...baseState, stepExpression: value})
    }, [baseState, updateProperties, setStepExpression]);

    const handleStepOriginChange = useCallback((value) => {
        setStepOrigin(value);
        updateProperties({...baseState, stepOrigin: value})
    }, [baseState, updateProperties, setStepOrigin]);

    return (
        <>
            <AssignPicker label="For (iterator loop variable)"
                allowMessageDestinations={true}
                assignTo={iteratorVarDest}
                variable={iteratorVar}
                assignToVariable={true}
                onAssignOptionChange={handleIteratorVarDestChange}
                onVariableChange={handleIteratorVarChange}
            ></AssignPicker>
            <ValuePicker label="To (limit expression)" 
                onExpressionChange={handleLimitExpressionChange}
                onOriginChange={handleLimitOriginChange}
                origin={limitOrigin}
                expression={limitExpression}
                allowConstantOrigins={true}
                allowExpressionOrigins={true}
                allowMessageOrigins={true}
                allowStorageOrigins={true}
            ></ValuePicker>
            <ValuePicker label="Step (increment amount)" 
                onExpressionChange={handleStepExpressionChange}
                onOriginChange={handleStepOriginChange}
                origin={stepOrigin}
                expression={stepExpression}
                allowConstantOrigins={true}
                allowExpressionOrigins={true}
                allowMessageOrigins={true}
                allowStorageOrigins={true}
            ></ValuePicker>
            
            <pre>
                { JSON.stringify(baseState, null, 2) }
            </pre>
        </>
    )

}

export default View;