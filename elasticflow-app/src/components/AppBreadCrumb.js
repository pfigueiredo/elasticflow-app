import { Breadcrumb } from "@blueprintjs/core";
import { Breadcrumbs2 } from "@blueprintjs/popover2";
import { Link } from 'react-router-dom'
import * as React from "react";
 
// const BreadcrumbData = [
//     { href: "/users", icon: "folder-close", text: "Users" },
//     { href: "/users/janet", icon: "folder-close", text: "Janet" },
//     { icon: "document", text: "image.jpg" },
// ];
 
const renderCurrentBreadcrumb = ({ text, href, ...restProps }) => {
    // customize rendering of last breadcrumb

    if (!!href)
        return <Link to={href}><Breadcrumb {...restProps}>{text} </Breadcrumb></Link>;
    else
        return <Breadcrumb {...restProps}>{text} </Breadcrumb>;
};

const AppBreadCrumb = (props) => {

    const breadcrumbs = props.breadcrumbs ?? [];

    return (
        <Breadcrumbs2
            currentBreadcrumbRenderer={renderCurrentBreadcrumb}
            items={breadcrumbs}
            />
    );
};

export default AppBreadCrumb