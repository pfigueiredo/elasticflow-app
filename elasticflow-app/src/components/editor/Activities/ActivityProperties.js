import React, { lazy, useEffect, useState } from 'react';
import nodes from './Nodes';
import { FormGroup, ControlGroup, Classes, InputGroup, Tab, Tabs, TextArea, Button } from '@blueprintjs/core';
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
    const allowExtraPorts = activity?.allowExtraPorts;

    const [views, setViews] = useState([]);
    const [name, setName] = useState(activity?.name ?? "");
    const [comment, setComment] = useState(activity?.comment ?? "");
    const [color, setColor] = useState(activity?.color ?? defaultColor);
    const [io, setIo] = useState({ outputs: activity?.outputs ?? []});

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

    function handleDeleteActivity(e) {
        const dialogProps = {
            icon: "confirm",
            title: "Delete activity node?",
            message: "This action will delete the current activity node. Confirm?",
            cancelButtonName: "No",
            confirmButtonName: "Confirm"
        }
        emitCustomEvent('editor:confirm', {
            dialogProps: dialogProps,
            callback: () => {
                emitCustomEvent('activity:unselect', {});
                emitCustomEvent('activity:delete', { activity: activity });
            }
        });
    }

    function handleRemoveOutput(io) {
        if (activity) {
            activity.removeOutputPort(io);
            setIo({ outputs: activity?.outputs ?? []});
            emitCustomEvent('editor:refresh', {});
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
            emitCustomEvent('activity:move', { address: activity.address });
        }
    }

    function handleAddOutput(e) {
        if (!!activity) {
            activity.createOutputPort();
            setIo({ outputs: activity?.outputs ?? []});
            emitCustomEvent('activity:change', {
                address: activity.address,
                activity: activity
            });
            emitCustomEvent('activity:move', { address: activity.address });
        }
    }

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
                <ControlGroup fill={true} vertical={false}>
                    <InputGroup
                        leftIcon="bookmark"
                        onChange={onNameChange}
                        placeholder="Activity name..."
                        value={name}
                    />
                    <Button className={Classes.FIXED} intent="danger" icon="delete" onClick={handleDeleteActivity}></Button>
                </ControlGroup>
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
            <h4>Output Definition</h4>
            {io.outputs.map(output => <ActivityOutput output={output} allowExtraPorts={allowExtraPorts} onRemove={handleRemoveOutput}></ActivityOutput>)}
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

    const RenderDebug = () => {
        return <></>;
    }

    if (!activity) {
        return <span>No object selected</span>
    } else return <>
        <Tabs>
            <Tab id="p" title="Properties" panel={RenderProperties()}/>
            <Tab id="o" title="Outputs" panel={RenderOutputProperties()}/>
            <Tab id="a" title="Appearance" panel={RenderAppearance()}/>
            <Tab id="d" title="Debug" panel={RenderDebug()}/>
        </Tabs>
    </>
}

export default ActivityProperties;