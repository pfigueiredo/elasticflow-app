import React, { lazy, useEffect, useState } from 'react';
import nodes from './Nodes';
import { FormGroup, InputGroup, Tab, Tabs, Switch, TextArea, Button } from '@blueprintjs/core';
import { SliderPicker } from 'react-color';
import { emitCustomEvent } from 'react-custom-events';
import ActivityOutput from './ActivityOutput';
import './ActivityProperties.css'

const defaultColor = "#79a7d2";

const importView = viewName =>
  lazy(() =>
    import(`./Views/${viewName}`).catch((err) => {
        console.log(err)
        return import(`./Views/NullView.default`)
    })
  );

function ActivityProperties({activity}) {

    nodes.fillInDefautls(activity);

    const [views, setViews] = useState([]);
    const [name, setName] = useState(activity?.name ?? "");
    const [comment, setComment] = useState(activity?.comment ?? "");
    const [color, setColor] = useState(activity?.color ?? defaultColor);
    const [allowExtraPorts, setAllowExtraPorts] = useState(activity?.allowExtraPorts);
    const [hasErrorOutput, setHasErrorOutput] = useState(activity?.hasErrorOutput ?? false);
    const [yieldExecution, setYieldExecution] = useState(activity?.yieldExecution ?? false);
    const [io] = useState({ outputs: activity?.outputs ?? []});

    const verticalFlexContainerStyle = {
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignContent: "stretch",
        alignItems: "stretch"
    };

    const flexGrow1 = {
        flexGrow: 1
    }

    function onColorChange(color) {
        if (!!activity) {
            activity.color = color;
            setColor(color);
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
        }
    }

    function onNameChange(e) {
        if (!!activity) {
            let name = e.target.value;
            activity.name = name;
            setName(name);
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
        }
    }

    function handleAddOutput(e) {}

    function handleChangeComment(e) {
        if (!!activity) {
            let value = e.target.value;
            activity.comment = value;
            setComment(value);
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
        }
    }

    function handleChangeHasErrorOutput(e) {
        if (!!activity) {
            let value = e.currentTarget.checked;
            activity.hasErrorOutput = value;
            setHasErrorOutput(value);
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
        }
    }

    function handleChangeYieldExecution(e) {
        if (!!activity) {
            let value = e.currentTarget.checked;
            activity.yieldExecution = value;
            setYieldExecution(value);
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
        }
    }

    useEffect(() => {
        async function loadViews() {
            let viewName = (activity?.type ?? "null").replace(":", "_");
            console.log('loading view: ' + viewName);
            const View = await importView(viewName);
            return <View key={activity?.key ?? "null"} activity={activity} />;
        }
        loadViews().then((val) => {setViews([val])});
    }, [activity]);
    
    const RenderProperties = () => {
        return <div style={{...verticalFlexContainerStyle, ...flexGrow1}}>
            <FormGroup
                label="Name / Tag"
                helperText="Name to assign to the current selected activity"
                fill={true}
            >
                <InputGroup
                    leftIcon="bookmark"
                    onChange={onNameChange}
                    placeholder="Activity name..."
                    value={name}
                />
            </FormGroup>
            <React.Suspense fallback='Loading property views...'>
                {views}      
            </React.Suspense>
        </div>
    }

    const AddOutputButton = () => {
        if (allowExtraPorts) {
            return <Button 
                intent="primary" fill={true} alignText="left" icon="add" style={{marginTop:"10px", marginBottom:"10px"}} onClick={handleAddOutput}></Button>
            
        } else
            return <></>
    }

    const RenderOutputProperties = () => {
        return <>
            <FormGroup 
                helperText="Does this activity have an adicional output for catching errors?"
                fill={true}>
                <Switch checked={hasErrorOutput} label="Error Output" onChange={e => handleChangeHasErrorOutput(e)} />
            </FormGroup>
            <FormGroup 
                helperText="After executing the activity save all the process messages and continue asynchronously?"
                fill={true}>
                <Switch checked={yieldExecution} label="Yield Execution" onChange={e => handleChangeYieldExecution(e)} />
            </FormGroup>
            <h4>Output Definition</h4>
            {io.outputs.map(output => <ActivityOutput output={output}></ActivityOutput>)}
            <AddOutputButton/>
        </>
    }

    const RenderAppearance = () => {
        return <>
            <FormGroup
                helperText="Provide some description of the actions that this activity performs"
                label="Description / Comment"
                labelFor="txt-comment"
            >
                <TextArea 
                    id="txt-comment" 
                    fill={true}
                    value={comment}
                    onChange={e => handleChangeComment(e)}
                ></TextArea>
            </FormGroup>
            <FormGroup
                helperText="The activity base color helps to group activities by color"
                label="customize the base color of this activity "
                labelFor="icon-color-picker"
            >
                <div style={{margin: "10px 0px"}}>
                    <SliderPicker id='icon-color-picker' 
                        color={color} 
                        onChange={(color) => { onColorChange(color.hex ?? defaultColor) }}
                    ></SliderPicker>
                </div>
            </FormGroup>
        </>
    }


    if (!activity) {
        return <span>No object selected</span>
    } else return <>
        <Tabs>
            <Tab id="p" title="Properties" panel={RenderProperties()}/>
            <Tab id="o" title="Outputs" panel={RenderOutputProperties()}/>
            <Tab id="a" title="Appearance" panel={RenderAppearance()}/>
        </Tabs>
    </>
}

export default ActivityProperties;