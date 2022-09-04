import React, { lazy, useEffect, useState } from 'react';
import nodes from './Nodes';
import { FormGroup, InputGroup, Tab, Tabs, Switch } from '@blueprintjs/core';
import { Tooltip2 } from "@blueprintjs/popover2";
import { emitCustomEvent } from 'react-custom-events';
import ActivityOutput from './ActivityOutput';
import './ActivityProperties.css'

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
    const [hasErrorOutput, setHasErrorOutput] = useState(activity?.hasErrorOutput ?? false);
    const [commitOnOutput, setCommitOnOutput] = useState(activity?.commitOnOutput ?? false);
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

    function handleChangeHasErrorOutput(e) {
        if (!!activity) {
            let value = e.currentTarget.checked;
            activity.hasErrorOutput = value;
            setHasErrorOutput(value);
        }
    }

    function handleChangeCommitOnOutput(e) {
        if (!!activity) {
            let value = e.currentTarget.checked;
            activity.commitOnOutput = value;
            setCommitOnOutput(value);
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

    const RenderOutputProperties = () => {
        return <>
            <FormGroup 
                helperText="Does this activity have an adicional output for catching errors?"
                fill={true}>
                <Switch checked={activity.hasErrorOutput} label="Error Output" onChange={e => handleChangeHasErrorOutput(e)} />
            </FormGroup>
            <FormGroup 
                helperText="Commit process on output?"
                fill={true}>
                <Switch checked={activity.commitOnOutput} label="Do Commit" onChange={e => handleChangeCommitOnOutput(e)} />
            </FormGroup>
            <h4>Output Definition</h4>
            {io.outputs.map(output => <ActivityOutput output={output}></ActivityOutput>)}
        </>
    }


    if (!activity) {
        return <span>No object selected</span>
    } else return <>
        <Tabs>
            <Tab id="p" title="Properties" panel={RenderProperties()}/>
            <Tab id="o" title="Outputs" panel={RenderOutputProperties()}/>
        </Tabs>
    </>
}

export default ActivityProperties;