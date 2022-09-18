import FlowAddress from "./FlowAddress";
import nodes from "../Activities/Nodes";

class FlowViewModel {
    constructor(data) {

        console.log('building flow view model');

        this.keySeed = 1;
        this.flowId = data.flowId;
        this.icon = data.icon;
        this.color = data.color;
        this.address = data.address ?? "";
        this.name = data.name ?? "unnamed flow";
        this.description = data.description ?? "";
        this.activities = (data.activities) ?
            data.activities.map(a => new ActivityViewModel(a, this))
            : [];

        this.entryPoints = [];
        this.updateWires();
    }

    prepareEntryPoints() {
        this.entryPoints = this.activities.filter(a => a.type === 'core:start').map(
            a => { 
                return {
                    address: a.address,
                    entryPoint: a.properties?.entryPoint,
                    method: a.properties?.method,
                    type: a.properties?.type
                }
            }
        );
    }

    getDataForSerialization() {
        return {
            flowId: this.flowId,
            name: this.name,
            icon: this.icon,
            color: this.color,
            address: this.address,
            description: this.description,
            activities: this.activities.map(a => a.getDataForSerialization()),
            entryPoints: this.entryPoints ?? []
        }
    }

    getActivityAt(x, y) {
        for (let i = 0; i < this.activities.length; i++) {
            let activity = this.activities[i];
            let position = activity.position;
            let height = 30; //todo this will be diferent
            let width = 180;
            let x1 = position.x;
            let y1 = position.y;
            let x2 = position.x + width;
            let y2 = position.y + height;

            if (x > x1 && x < x2 && y > y1 && y < y2)
                return activity;
        }
        return null;
    }

    createActivity(type, position) {
        if (!!nodes[type]) {
            let node = nodes[type];
            var data = {
                name: node.name ?? "unnamed activity",
                type: type ?? "unknown",
                position: position,
                color: node.color ?? null,
                outputs: node.outputs ?? [],
                inputs: node.inputs ?? []

            };
            let activity = new ActivityViewModel(data, this);
            this.activities.push(activity);
            return activity;
        }
        return null;
    }

    updateWires() {
        this.activities.forEach(activity => {
            activity.outputs.forEach(o => {
                o.wires.forEach(w => {
                    w.destination = this.getActivity(w.destinationAddress) ?? activity;
                })
            });
        });
    }

    getActivity(address) {
        for (var i = 0; i < this.activities.length; i++)
            if (FlowAddress.SameActivity(this.activities[i].address, address))
                return this.activities[i];
        return null;
    }
};

class ActivityViewModel {
    constructor(data, flow) { 

        this.flow = flow;
        this.key = (++flow.keySeed);
        this.address = data.address ?? "A" + flow.keySeed;
        this.name = data.name ?? "unnamed activity";
        this.type = data.type ?? "unknown";
        this.color = data.color ?? null;
        this.comment = data.comment ?? null;
        this.properties = data.properties ?? {}
        this.hasErrorOutput = data.hasErrorOutput ?? false;
        this.yieldExecution = data.yieldExecution ?? false;
        this.position = {
            x: data.position?.x ?? 100,
            y: data.position?.y ?? 100
        }

        this.outputs = (data.outputs)
             ? data.outputs.map((o, i, arr) => new IOViewModel(o, i, arr, this, "O"))
             : [];

        //actually we only support one input per node.
        this.inputs = (data.inputs) 
            ? data.inputs.map((o, i, arr) => new IOViewModel(o, i, arr, this, "I"))
            : [];
    }

    getDataForSerialization() {
        return {
            address: this.address,
            name: this.name,
            type: this.type,
            color: this.color,
            comment: this.comment,
            showComment: this.showComment,
            commentPosition: this.commentPosition,
            properties: this.properties,
            hasErrorOutput: this.hasErrorOutput,
            yieldExecution: this.yieldExecution,
            position: this.position,
            inputs: this.inputs.map(io => io.getDataForSerialization()),
            outputs: this.outputs.map(io => io.getDataForSerialization())
        }
    }

    connect(wire) {
        if (!!this.inputs && this.inputs.length > 0) {
            let io = this.inputs[0];
            io.connect(wire);
        }
    }

};

class IOViewModel {
    constructor(data, index, allPorts, activity, type) {
        this.key = ++activity.flow.keySeed;
        this.activity = activity;
        this.name = data.name ?? "";
        this.address = data.address ?? type + index;
        this.type = data.type ?? "sync";
        this.index = index;
        this.color = data.color ?? null;
        this.isErrorOutput = data.isErrorOutput ?? false;
        this.posY = (allPorts.length < 2) ? 10 : 4 + (12 * index);
        this.wires = (data.connections && type === 'O')
            ? data.connections.map(c => new WireViewModel(c, this))
            : [];
    }

    getDataForSerialization() {
        return {
            address: this.address,
            name: this.name,
            type: this.type,
            color: this.color,
            isErrorOutput: this.isErrorOutput,
            connections: this.wires.map(w => w.destinationAddress)
        }
    }

    updateWiresAndProperties() {
        this.wires.forEach(w => {
            w.name = this.name;
            w.posY = this.posY;
            w.type = this.type;
        });
    }

    destroyWire(wire) {
        const index = this.wires.indexOf(wire);
        if (index > -1) this.wires.splice(index, 1);
    }

    connect(wire) {
        wire.destination = this.activity;
        const fullAddress = FlowAddress.buildAddress(null, this.activity.address, this.address)
        wire.destinationAddress = fullAddress;
    }

    createWire(status) {
        let wire = new WireViewModel(null, this);
        if (!!status) wire.status = {...status};
        this.wires.push(wire);
        return wire;
    }
}

// function buildFullAddressFromModels(flow, activity, io) {

//     flow = flow ?? activity?.flow ?? io?.activity.flow;
//     activity = activity ?? io?.activity;

//     let flowAddress = flow?.address;
//     let activityAddress = activity?.address;
//     let ioAddress = io?.address;

//     let flowAddressPart = null;
//     let activityAddressPart = null;
//     let ioAddressPart = null;

//     if (flowAddress) {
//         flowAddressPart = FlowAddress.getAddressParts(flowAddress)?.flow;
//     }

//     if (activityAddress)
//         activityAddressPart = FlowAddress.getAddressParts(activityAddress)?.activity;

//     if (ioAddress)
//         ioAddressPart = FlowAddress.getAddressParts(ioAddress)?.io;

//     return FlowAddress.buildAddress(flowAddressPart, activityAddressPart, ioAddressPart);

// }

class WireViewModel {
    constructor(destAddress, io) {
        console.log(`create wire from ${io.address}:${io.activity.address} to ${destAddress}`);
        this.key = ++io.activity.flow.keySeed;
        this.address = "W" + this.key;
        this.io = io;
        this.posY = io.posY;
        this.name = io.name ?? "";
        this.source = io.activity;
        this.destination = null;
        this.sourceAddress = io.address;
        this.destinationAddress = destAddress;
    }

    destroyWire() {
        this.io?.destroyWire(this);
    }
}


export default FlowViewModel;