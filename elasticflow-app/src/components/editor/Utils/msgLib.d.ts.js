let data = `

declare class Process {
    public get processId():string;
    public get variables():Store;
    public getMessages():Message[];
}

declare class Flow {
    public get flowId():string;
    public get variables():Store;
}

declare class Activity {
    public get activityId():string;
    public get flow():Flow;
    public get variables():Store;
    public getMessages():Message[];
}

declare class Message {
    public get msgId():string;
    public type:string;
    public payload:any;
    public get process():Process;
    public get flow():Flow;
    public get activity():Activity;
}

declare class Store {
    //adds a new variable named 'name' with a value of 'value'
    public setValue(name:string, value:any):void;
    //gets the value of the variable named 'name'. returns null if the variable is not defined  
    public getValue(name:string):any;
}

declare class Variable {
    public name:string;
    public value:any;
}

declare class Context {
    public continueWith(message:Message):void;
    public stop(logMessage:any):void;
    public log(logMessage:any):void;
}

declare var msg:Message;
declare var process:Process;
declare var flow:Flow;
declare var activity:Activity;
declare var context:Context;


`

export default data;
