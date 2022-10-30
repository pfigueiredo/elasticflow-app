import React from 'react';

function View({activity}) {

    return (<>
        <div>An external activity doesn't have any configurable properties</div>
        <div>Its has <b>2 outputs</b> ('Continue' and 'Stop'), one for the continuation of the flow and another to execute 'post pause' actions (Yellow).</div>
        <div>It also provides <b>2 endpoints</b> (GET and POST) for getting data for the external activity (GET) and to continue (POST)</div>
    </>)

}

export default View;