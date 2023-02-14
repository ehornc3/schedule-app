import React from 'react';
import CNavbar from "../CNavbar/CNavbar";

const accountPermissions = ["none", "user", "admin"]

export default function Users(props) {
    return(
        <div>
            <CNavbar app={props.app} title={"Account Control"}></CNavbar>
        </div>
    );
}