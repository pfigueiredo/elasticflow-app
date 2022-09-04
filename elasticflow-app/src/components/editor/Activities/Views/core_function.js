import React, { useState } from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { emitCustomEvent, useCustomEventListener } from 'react-custom-events'

function View({activity}) {

    const [code, setCode] = useState(activity.properties.functionCode ?? "");

    function editCode() {
        emitCustomEvent('editor:editActivityCode', { code: code, activity: activity });
    }

    useCustomEventListener('editor:activityCodeChanged', data => {
        setCode(activity?.properties?.functionCode ?? "");
    });

    return <>
        <ButtonGroup fill={true}>
            <Button intent="primary" alignText="left" icon="code" onClick={editCode}>Edit Function Code</Button>
        </ButtonGroup>
        <SyntaxHighlighter language="javascript" style={vs} customStyle={{flexGrow: 1}} >
            {code}
        </SyntaxHighlighter>
    </>
}

export default View;