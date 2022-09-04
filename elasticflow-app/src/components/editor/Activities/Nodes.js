let nodes = {};

nodes["core:start"] = {
    isNode: true,
    icon: "n/triggerIn.svg",
    name: "Start",
    inputs: [],
    description: "starts a flow from an external trigger",
    outputs: [ { address: "O1", type: "sync" } ],
    properties: { }
}

nodes["core:function"] = {
    isNode: true,
    icon: "n/fx.svg",
    name: "Function",
    description: "a user defined node/activity coded in javascript",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ],
    properties: {
        functionCode: `//The default function only relays the current msg to the next activity\ncontext.continueWith(msg);`
    }
}

nodes["core:assign"] = {
    isNode: true,
    icon: "n/assign.svg",
    name: "Assign",
    description: "assigns a variable(s) to values",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:switch"] = {
    isNode: true,
    icon: "n/if.svg",
    name: "Split/Switch",
    description: "switches the execution into several conditional paths",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ 
        { name: "true", address: "O1", type: "sync" },
        { name: "false", address: "O2", type: "sync" } 
    ]
}

nodes["core:join"] = {
    isNode: true,
    icon: "n/andJoin.svg",
    name: "Join",
    description: "joins executions from several inputs and continues",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:glue"] = {
    isNode: true,
    icon: "n/glue.svg",
    name: "Glue",
    description: "joins a set of messages into a single 'array' message",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:call"] = {
    isNode: true,
    icon: "n/call.svg",
    name: "Call",
    description: "calls a subflow and continues after the subflow execussion",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:slice"] = {
    isNode: true,
    icon: "n/slice.svg",
    name: "Slice",
    description: "splis an array message into several messages",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:transform"] = {
    isNode: true,
    icon: "n/transform.svg",
    name: "Transform",
    description: "performs a transformation on a message payload",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:trigger"] = {
    isNode: true,
    icon: "n/triggerOut.svg",
    name: "Trigger",
    description: "triggers the execussion of a new flow and continues",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["http:call"] = {
    isNode: true,
    icon: "n/call.svg",
    name: "Http call",
    description: "does an external http rest call",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes.fillInDefautls = function(node) {
    if (node?.type) {
        let prototype = nodes[node.type];
        if (!node.properties) node.properties = {};
        if (prototype.properties) {
            for (var key in prototype.properties) {
                if (!node.properties[key])
                    node.properties[key] = prototype.properties[key];
            }
        }
    }
}

export default nodes;