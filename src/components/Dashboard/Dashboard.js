import React from 'react';
import CNavbar from "../CNavbar/CNavbar";

export default function Dashboard(props) {
    return(
        <div>
            <CNavbar app={props.app} title={"Dashboard"} />
            <h2>Dashboard</h2>
        </div>
    );
}