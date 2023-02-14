import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import PropTypes from "prop-types";


export default function CNavbar(props) {
    return(
        <Navbar bg={"primary"} expand={"lg"}>
            <Container>
                <Navbar.Brand href={"/dashboard"}><b>{props.title}</b></Navbar.Brand>
                <Navbar.Toggle aria-controls={"navbar"} />
                <Navbar.Collapse id={"navbar"}>
                    <Nav>
                        <Nav.Link href={"/users"}>Users</Nav.Link>
                        <Nav.Link href={"/shifts"}>Shifts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Brand>Signed in as: {props.app.state.name} - <a onClick={e => {props.app.saveToken()}}>Logout</a> </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

CNavbar.propTypes = {
    title: PropTypes.string.isRequired,
}