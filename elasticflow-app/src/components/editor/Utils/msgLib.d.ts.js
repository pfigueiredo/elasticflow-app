let data = `

declare class Process {
    public get processId():string;
    public get data():Store;
    public getMessages():Message[];
}

declare class Flow {
    public get flowId():string;
    public get data():Store;
}

declare class Activity {
    public get activityId():string;
    public get flow():Flow;
    public get data:Store;
    public getMessages():Message[];
}

declare class Message {
    public get msgId():string;
    public type:string;
    public payload:any;
}

declare class Store {
    //adds a new variable named 'name' with a value of 'value'
    public async setValue(name:string, value:any):Promise;
    //gets the value of the variable named 'name'. returns null if the variable is not defined  
    public async getValue(name:string):Promise<any>;
}

declare class Engine {
    public get statistics:any;
}

declare class Context {
    public continueWith(message:Message):void;
    public stop(logMessage:any):void;
    public log(logMessage:any):void;

    public get process:Process;
    public get flow:Flow;
    public get activity:Activity;
    public get engine:Engine;
}

declare var msg:Message;
declare var process:Process;
declare var flow:Flow;
declare var activity:Activity;
declare var context:Context;


`

export default data;
