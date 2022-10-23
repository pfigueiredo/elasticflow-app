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

nodes["core:end"] = {
    isNode: true,
    icon: "n/stop.svg",
    name: "End",
    color: "#d27979",
    inputs: [ { address: "I1", type: "sync" } ],
    description: "flow endpoint, end current branch and returns any messages back if in sync mode",
    outputs: [ ],
    properties: { }
}

nodes["core:function"] = {
    isNode: true,
    icon: "n/fx.svg",
    name: "Function",
    description: "a user defined node/activity coded in javascript",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ],
    allowExtraPorts: true,
    properties: {
        functionCode: `//The default function only relays the current msg to the next activity\ncontext.continueWith(msg);`
    }
}

nodes["core:log"] = {
    isNode: true,
    icon: "n/log.svg",
    name: "Log Execution",
    description: "log values to the execution console",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ],
    properties: { }
}

nodes["core:catch"] = {
    isNode: true,
    color: "#d27979",
    icon: "n/catch.svg",
    name: "Catch Error",
    description: "catch an error thown in the current flow in the same process",
    inputs: [],
    outputs: [ { address: "O1", type: "sync" } ],
    properties: { }
}

nodes["core:assign"] = {
    isNode: true,
    icon: "n/assign.svg",
    name: "Assign",
    description: "assigns a variable(s) to values",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ { address: "O1", type: "sync" } ]
}

nodes["core:if"] = {
    isNode: true,
    icon: "n/if2.svg",
    name: "If and Else Switch",
    description: "switches the execution based on the evaluation of a boolean expression",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ 
        { name: "then", address: "O1", type: "sync" },
        { name: "else", address: "O2", type: "sync" } 
    ]
}

nodes["core:fork"] = {
    isNode: true,
    icon: "n/fork.svg",
    name: "Fork",
    description: "forks the execution into several paths",
    inputs: [ { address: "I1", type: "sync" } ],
    allowExtraPorts: true,
    outputs: [ 
        { name: "Path 1", address: "O1", type: "sync" },
        { name: "Path 2", address: "O2", type: "sync" } 
    ],
    properties: { }
}

nodes["core:foreach"] = {
    isNode: true,
    icon: "n/loop.svg",
    name: "For Each",
    description: "loop the execution for each element of a list",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ 
        { name: "Continue", address: "O1", type: "sync" },
        { name: "Loop", address: "O2", type: "sync", color:"yellow" } 
    ],
    properties: { }
}

nodes["core:continue"] = {
    isNode: true,
    icon: "n/continue.svg",
    name: "Continue",
    description: "forces the imediate trigger of the next iteraction in a loop",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [],
    properties: { }
}

nodes["core:break"] = {
    isNode: true,
    icon: "n/continue.svg",
    name: "Break",
    description: "breaks the current loop and continues",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [],
    properties: { }
}

nodes["core:loop"] = {
    isNode: true,
    icon: "n/loop.svg",
    name: "Loop",
    description: "loop the execution a number of times",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ 
        { name: "Continue", address: "O1", type: "sync" },
        { name: "Loop", address: "O2", type: "sync", color:"yellow" } 
    ],
    properties: { }
}


nodes["core:switch"] = {
    isNode: true,
    icon: "n/switch.svg",
    name: "Split/Switch",
    description: "switches the execution into several conditional paths",
    inputs: [ { address: "I1", type: "sync" } ],
    allowExtraPorts: true,
    outputs: [ 
        { name: "A", address: "O1", type: "sync" },
        { name: "B", address: "O2", type: "sync" },
        { name: "C", address: "O3", type: "sync" } 
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

nodes["core:external"] = {
    isNode: true,
    icon: "n/externalCall.svg",
    name: "External Activity",
    description: "stops and waits for an external action/activity",
    inputs: [ { address: "I1", type: "sync" } ],
    outputs: [ 
        { name: "Continue", address: "O1", type: "sync" }
    ],
    properties: { }
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
        // debugger;
        let prototype = nodes[node.type];
        node.allowExtraPorts = prototype.allowExtraPorts ?? false;
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