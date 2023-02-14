import React from 'react';
import CNavbar from "../CNavbar/CNavbar";

export default function Shifts(props) {
    return(
        <div>
            <CNavbar app={props.app} title={"Shifts"} />
        </div>
    );
}