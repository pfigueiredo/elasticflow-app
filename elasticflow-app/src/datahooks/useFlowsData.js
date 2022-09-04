
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const fetchFlows = () => {
    return axios.get('https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/flows');
}

const fetchFlowsById = ({ queryKey }) => {
    const flowId = queryKey[1];

    if (!!flowId) {
        return axios.get(`https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/flows?flowId=${flowId}`);
    } else {
        return new Promise((resolve, reject) => {
            resolve( { data: { Item: { flowId: null } } } );
        });
    }
}

const deleteFlow = (flowId) => {
    return axios.delete(`https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/flows?flowId=${flowId}`);
}

const mutateFlow = (flowData) => {
    if (!!flowData.flowId) {
        console.log("doing a put for a new object");
        return axios.put('https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/flows', flowData);
    } else {
        console.log("doing a post for an existing");
        return axios.post('https://qoc4auwwyi.execute-api.eu-west-1.amazonaws.com/default/flows', flowData);
    }
}

export const useFlowsData = () => {
    return useQuery('flows', fetchFlows );
};

export const useFlowData = (id) => {
    const flowId = (!!id) ? id : "";
    return useQuery(["flows", flowId], fetchFlowsById );
};

export const useFlowCache = (id) => {
    const flowId = (!!id) ? id : "";
    const queryClient = useQueryClient();
    return ((flowId, queryClient) => {
        return { 
            updateCache: function(flowData) {
                queryClient.cancelQueries(["flows", flowId]);
                var currentData = queryClient.getQueryData(["flows", flowId]);
                currentData.data.Item = { ...currentData.data.Item, ...flowData };
                queryClient.setQueryData(["flows", flowId], {...currentData});
            } 
        }
    })(flowId, queryClient);
}

export const useFlowMutation = (onSuccess, onError) => {
    const queryClient = useQueryClient();
    return useMutation(mutateFlow, {
        onSuccess: (data, variables, context) => {
            console.log('OnSuccess');
            console.log(data, variables);
            queryClient.invalidateQueries('flows');
            if (!!onSuccess && typeof onSuccess === 'function') {
                onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            if (!!onError && typeof onError === 'function') {
                onError(error, variables, context);
            }
        }
    })
}

export const useFlowDelete = (onSuccess, onError) => {
    return {
        deleteData: (id) => {
            var promise = deleteFlow(id);
            promise.then(onSuccess);
            promise.catch(onError);
        }
    }
}