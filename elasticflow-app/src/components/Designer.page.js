import { useParams as useRouteParams } from 'react-router-dom';
//import { Helmet } from "react-helmet";
import { useState } from "react";
import { Editor } from "./editor/Editor";
 
export const DesignerPage = () => {

    console.log('designer page');

    const { id } = useRouteParams();
    const [ flowId ] = useState(id);

    return (
        <div id="designer">
            {/* <Helmet>
                <title>
                    Elastic Flows - Design Flow ({ flowId })
                </title>
            </Helmet> */}
            <Editor flowId={flowId}></Editor>
        </div>
    )

}