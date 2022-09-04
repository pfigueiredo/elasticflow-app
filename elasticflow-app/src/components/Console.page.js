import { Spinner } from '@blueprintjs/core';
import { useParams as useRouteParams } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { useFlowData } from '../datahooks/useFlowsData'
import { useState } from "react";
 
export const ConsolePage = () => {

    const { id } = useRouteParams();
    const [ flowId ] = useState((!id || id === "add") ? null : id);
    const { isLoading, data, isError, error } = useFlowData(flowId);

    if (isLoading)
        return <Spinner className="loading-spinner" size={100}></Spinner>

    if (isError)
        return <h2>{error.message}</h2>

    return (
        <div>
            <Helmet>
                <title>
                    Elastic Flows - Execution Console ({ flowId })
                </title>
            </Helmet>
            
            <pre>
                { JSON.stringify(data?.data?.Item, null, 2) }
            </pre>
        </div>
    )

}