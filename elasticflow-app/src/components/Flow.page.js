import { FormGroup, InputGroup, Button, ButtonGroup, Spinner } from "@blueprintjs/core";
import { useNavigate, generatePath, useParams as useRouteParams } from 'react-router-dom';
import { CompactPicker } from 'react-color';
import { Helmet } from "react-helmet";
import { useFlowData, useFlowMutation, useFlowCache, useFlowDelete } from '../datahooks/useFlowsData'
import AppBreadCrumb from "./AppBreadCrumb";
import { BackgroundLogo } from "./common/BackgroundLogo";
import { IconSelect } from "./common/iconSelect";
import { useState } from "react";
 
export const FlowPage = () => {

    const { id } = useRouteParams();
    const [ flowId ] = useState((!id || id === "add") ? null : id);

    

    const navigate = useNavigate();
    const { isLoading, data, isError, error } = useFlowData(flowId);
    const { updateCache: updateFlowCache } = useFlowCache(flowId);
    const { mutate: mutateFlow } = useFlowMutation((data, variables, context) => {
        console.log('recived data after mutation');
        console.log(data);
        const path = generatePath('/flows');
        navigate(path);
    });

    const { deleteData } = useFlowDelete(() => {
        const path = generatePath('/flows');
        navigate(path);
    });

    const updateCache = (name, value) => {
        const obj = {};
        obj[name] = value;
        updateFlowCache(obj);
    }

    const saveChanges = (event) => {
        const currentObject = data?.data?.Item ?? {};
        mutateFlow({...currentObject});
    }

    const goBack = (event) => {
        const path = generatePath('/flows');
        navigate(path);
    }

    const deleteFlow = (event) => {
        const currentObject = data?.data?.Item ?? {};
        deleteData(currentObject.flowId);
    }

    const designFlow = (event) => {
        const currentObject = data?.data?.Item ?? {};
        const path = generatePath('/designer/:id', { id: currentObject.flowId });
        navigate(path);
    }

    const flowConsole = (event) => {
        const currentObject = data?.data?.Item ?? {};
        const path = generatePath('/console/:id', { id: currentObject.flowId });
        navigate(path);
    }

    if (isLoading)
        return <Spinner className="loading-spinner" size={100}></Spinner>

    if (isError)
        return <h2>{error.message}</h2>

    const breadcrumbs = [
        { href: "/", icon: "home", text: "Home" },
        { href: "/flows", icon: "folder-close", text: "Flows" },
        { icon: "folder-open", text: flowId }
    ];

    return <>
        <div className="app-page">

            {/* <Helmet>
                <title>
                    Elastic Flows - Edit Flow ({ flowId })
                </title>
            </Helmet> */}

            <BackgroundLogo/>

            <AppBreadCrumb breadcrumbs={breadcrumbs}></AppBreadCrumb>
            <div className="app-page-form">

            <FormGroup
                helperText="A short and simple name to identitfy this flow"
                label="Flow Name"
                labelFor="txt-name"
                labelInfo="(required)"
            >
                <InputGroup id="txt-name" placeholder="enter flow name" 
                    value={data?.data?.Item?.name} 
                    onChange={(event) => { updateCache("name", event.target.value) }}/>
            </FormGroup>
            <FormGroup
                helperText="A more comprehensive description about the functionality of this flow"
                label="Description"
                labelFor="txt-description"
                labelInfo="(required)"
            >
                <InputGroup id="txt-description" placeholder="description" 
                    value={data?.data?.Item?.description} 
                    onChange={(event) => { updateCache("description", event.target.value) }}/>
            </FormGroup>

            <FormGroup
                helperText="A icon and color that gives an general ideia about the flow"
                label="Icon / Color"
                labelFor="icon-select"
                labelInfo="(required)"
            >
                <IconSelect 
                    id='icon-select'
                    icon={data?.data?.Item?.icon} 
                    color={data?.data?.Item?.color}
                    onChange={(icon) => { updateCache("icon", icon) }}
                />
                <div style={{margin: "10px 0px"}}>
                    <CompactPicker id='icon-color-picker'
                        color={data?.data?.Item?.color} 
                        onChange={(color) => { updateCache("color", color.hex ?? "black") }}
                    ></CompactPicker>
                </div>
            </FormGroup>

            <ButtonGroup>
                <Button icon="arrow-left" onClick={goBack}>Go Back</Button>
                <Button icon="delete" onClick={deleteFlow} intent="danger">Delete Flow</Button>
                <Button icon="floppy-disk" onClick={saveChanges} intent="success">Save Changes</Button>
            </ButtonGroup>
            
            <ButtonGroup style={{marginLeft: "20px"}}>
                <Button icon="draw" onClick={designFlow} intent="primary">Flow Designer</Button>
                <Button icon="console" onClick={flowConsole}>Execution Console</Button>
            </ButtonGroup>

            {/* <pre>
                {JSON.stringify(data?.data?.Item, null, 2)}
            </pre>  */}

            </div>
        </div>
    </>
}