
import { useQuery } from 'react-query';
import axios from 'axios';


const fetchFlowsLogsById = ({ queryKey }) => {
    const flowId = queryKey[1];

    // if (!!flowId) {
        return axios.get(`https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/logs?flowId=${flowId}`);
    // } else {
    //     return new Promise((resolve, reject) => {
    //         resolve( { data: { Item: { flowId: null } } } );
    //     });
    // }
}

export const useFlowLogData = (id) => {
    const flowId = (!!id) ? id : "";
    return useQuery(["logs", flowId], fetchFlowsLogsById );
};



