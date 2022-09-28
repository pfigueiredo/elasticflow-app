
import { useQuery } from 'react-query';
import axios from 'axios';

function getDatetimeValue(dt) {
    const d = new Date(dt);
    if (isNaN(d) || d == null) return 0;
    return d.getTime();
}

const fetchFlowsLogsById = async ({ queryKey }) => {
    const flowId = queryKey[1];
    const data = await axios.get(`https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/logs?flowId=${flowId}`);

    if (data?.data?.Items && data.data.Items.sort) {
        console.log("sorting logitems")
        data.data.Items.sort((a, b) => { //desc 
            return getDatetimeValue(b.start) - getDatetimeValue(a.start)
        })
    }


    return data;
}

export const useFlowLogData = (id) => {
    const flowId = (!!id) ? id : "";
    return useQuery(["logs", flowId], fetchFlowsLogsById );
};



