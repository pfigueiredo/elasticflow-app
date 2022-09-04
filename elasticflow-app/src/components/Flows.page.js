import { useFlowsData } from "../datahooks/useFlowsData";
import { Card, Elevation, Icon, Spinner } from "@blueprintjs/core";
import { useNavigate, generatePath } from 'react-router-dom';
import { Helmet } from "react-helmet";
import AppBreadCrumb from "./AppBreadCrumb";
import { BackgroundLogo } from "./common/BackgroundLogo";
import './Flows.page.css';


const breadcrumbs = [
    { href: "/", icon: "home", text: "Home" },
    { href: "/flows", icon: "folder-close", text: "Flows" }
];
 
export const FlowsPage = () => {

    const { isLoading, data, isError, error } = useFlowsData();
    const navigate = useNavigate();

    if (isLoading)
        return <Spinner className="loading-spinner" size={100}></Spinner>

    if (isError)
        return <h2>{error.message}</h2>

    const navigateToFlow = function (flowId) {
        const path = generatePath('/flow/:id', {id: flowId});
        navigate(path);
    }

    const addNewFlow = function() {
        const path = generatePath('/flow/:id', {id: "add"});
        navigate(path);
    }

    return <>
        <div className="app-page">
            <Helmet>
                <title>
                    Elastic Flows - Flows List
                </title>
            </Helmet>
            <BackgroundLogo/>
            <AppBreadCrumb breadcrumbs={breadcrumbs}></AppBreadCrumb>
            <div className="flows-box">
            {
                data?.data?.Items?.map(flow => {
                    return (
                        <Card className="flow-card" key={flow.flowId} interactive={true} elevation={Elevation.TWO} onClick={() => navigateToFlow(flow.flowId)}>
                            <Icon className="flow-card-image" icon={flow.icon} size={42} color={flow.color} />
                            <h5 style={{margin:"10px 0px 5px 0px"}}>{flow.name}</h5>
                            <p style={{marginBottom: "2px"}}>{flow.description}</p>
                        </Card>
                    )
                })
            }
            <Card className="flow-card flow-card-add" interactive={true} elevation={Elevation.TWO} onClick={addNewFlow}>
                <Icon className="flow-card-image-add" icon="add" size={100} color="gray"/>
            </Card>
            </div>
        </div>
    </>
}