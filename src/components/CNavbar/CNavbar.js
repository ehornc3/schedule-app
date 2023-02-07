import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import PropTypes from "prop-types";
export default function CNavbar({title}) {
    return(
        <Navbar bg={"primary"} expand={"lg"}>
            <Container>
                <Navbar.Brand href={"/dashboard"}><b>{title}</b></Navbar.Brand>
                <Navbar.Toggle aria-controls={"navbar"} />
                <Navbar.Collapse id={"navbar"}>
                    <Nav>
                        <Nav.Link href={"/users"}>Users</Nav.Link>
                        <Nav.Link href={"/shifts"}>Shifts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

CNavbar.propTypes = {
    title: PropTypes.string.isRequired
}