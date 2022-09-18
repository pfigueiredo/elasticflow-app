import { Spinner, Tree, TreeNode } from '@blueprintjs/core';
import { useParams as useRouteParams } from 'react-router-dom';
// import { Helmet } from "react-helmet";
import { useFlowData } from '../datahooks/useFlowsData'
import { useFlowLogData } from '../datahooks/useFlowLogData'
import { useState } from "react";
 
import './Console.page.css';

export const ConsolePage = () => {

    const { id } = useRouteParams();
    const [ flowId ] = useState((!id || id === "add") ? null : id);

    const { isLoading, data, isError, error } = useFlowLogData(flowId);

    if (isLoading)
        return <Spinner className="loading-spinner" size={100}></Spinner>

    if (isError)
        return <h2>{error.message}</h2>

    const splitExecutionId = function(executionId) {
        const tokens = executionId.split('/');
        return { processId: tokens[0], executionId: tokens[1] }
    }

    const formatDate = function (isoDate) {
        const d = new Date(isoDate);
        if (isNaN(d)) return "";
        else return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    }

    const formatTime = function (isoDate) {
        const d = new Date(isoDate);
        if (isNaN(d)) return "";
        else return `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}:${pad(d.getSeconds(),2)}.${pad(d.getMilliseconds(),3)}`
    }

    const pad = function (num, size) {
        var s = "000000000" + num;
        return s.substr(s.length-size);
    }

    const buildLogItem = function(logItem) {
        const className = `log-item-${logItem.level}`;

        if (logItem.type === "o") {
            return <div className={className}><span className='log-time'>{formatTime(logItem.time)}</span><br/>{
                JSON.stringify(JSON.parse(logItem.message), null, 2)
            }</div>
        } else
            return <div className={className}><span className='log-time'>{formatTime(logItem.time)}</span> {logItem.message}</div>
    }

    return (
        <div>
            {/* <Helmet>
                <title>
                    Elastic Flows - Execution Console ({ flowId })
                </title>
            </Helmet> */}

            <pre>
                { 
                    data.data.Items.map(item => {
                        const { processId, executionId } = splitExecutionId(item.executionId);
                        const items = item.items;
                        return <div className='process-group'>
                            <div className='log-group-header'>Process: {processId} Execution: {executionId} start: {formatDate(item.start)}</div>
                            {items.map(logItem => {
                                return buildLogItem(logItem)
                            })}
                        </div>;
                    })
                }
            </pre>
        </div>
    )

}