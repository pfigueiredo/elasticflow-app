import { Dialog, Button, Classes, InputGroup, Card, Elevation } from "@blueprintjs/core"
import { emitCustomEvent, useCustomEventListener } from "react-custom-events";
import nodes from "./Activities/Nodes";
import { useState, useCallback, useMemo } from "react";
import './AddActivity.dialog.css';

function createNodeList(nodes) {
    return Object.keys(nodes).map(key => {
        return { type: key, ...nodes[key] }    
    }).filter(n => n.isNode);
}

function filterNodeList(availableNodes, searchQuery) {
    return availableNodes.filter(
        n => n.type?.indexOf(searchQuery) >= 0 
            || n.name?.indexOf(searchQuery) >= 0
            || n.description?.indexOf(searchQuery) >= 0
    ).slice(0, 10);
}

export const AddActivityDialog = (props) => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [callbackInfo, setCallbackInfo] = useState({ callback: null, position: null });
    const handleButtonClick = useCallback(() => setIsOpen(!isOpen), [isOpen]);
    const handleClose = useCallback(() => setIsOpen(false), []);
    const availableNodeList = useMemo(() => { return createNodeList(nodes); }, []);
    const filteredNodeList = useMemo(() => { return filterNodeList(availableNodeList, searchQuery)}, [availableNodeList, searchQuery]);

    useCustomEventListener('editor:openAddActivityDialog', data => {
        console.log("open add activity dialog");
        console.log(data);
        setIsOpen(true);
        setCallbackInfo({ callback: data.callback, position: data.position });
    });

    const search = (event) => {
        const value = event.target.value;
        console.log("search: " + value);
        setSearchQuery(value);
    }

    const handleAddActivity = (activityType) => {
        emitCustomEvent('menu:addActivity', {
            type: activityType,
            callback: callbackInfo.callback,
            position: callbackInfo.position
        });
        setIsOpen(false);
    }

    const RenderNodes = () => {
        return (
            <div className="activity-search-list">
                { filteredNodeList.map(
                    n => <Card interactive={true} elevation={Elevation.ONE} className="activity-search-card" 
                        onClick={() => handleAddActivity(n.type)}>
                        <img width={50} src={`/icons/${n.icon}`} alt=""></img>
                        {n.name} ({n.type})
                    </Card>
                )}
            </div>
        )
    }

    return (
        <Dialog icon="add" title="Add Activity" {...props} isOpen={isOpen} onClose={handleClose}>
            <div className={Classes.DIALOG_BODY}>
                <InputGroup icon="search" type="search" placeholder="Search Avalivable Node Types" dir="auto" value={searchQuery} onChange={search}/>
                <RenderNodes></RenderNodes>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={handleButtonClick}>Cancel</Button>
                    <Button icon="add" intent="success" onClick={handleButtonClick}>Add Activity</Button>
                </div>
            </div>
        </Dialog>
    )
}