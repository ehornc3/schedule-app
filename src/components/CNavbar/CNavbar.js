import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import PropTypes from "prop-types";


export default function CNavbar(props) {
    return(
        <Navbar bg={"primary"} expand={"lg"}>
            <Container>
                <Navbar.Brand href={"/dashboard"}>
                    <img
                        src="/icons/house_poly.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt={"Dashboard"}
                    />
                </Navbar.Brand>

                <Navbar.Brand>{props.title}</Navbar.Brand>
                <Navbar.Toggle aria-controls={"navbar"} />
                <Navbar.Collapse id={"navbar"}>
                    <Nav>
                        <Nav.Link href={"/users"}>Users</Nav.Link>
                        <Nav.Link href={"/shifts"}>Shifts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>


                <Navbar.Brand>{props.app.state.name}</Navbar.Brand>
                <Navbar.Brand
                    href={"/login"}
                    onClick={() => props.app.saveToken()}
                    alt={"Logout"}>
                    <img
                        src="/icons/key_poly.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt={"Logout"}
                    />
                </Navbar.Brand>
            </Container>
        </Navbar>
    )
}

CNavbar.propTypes = {
    title: PropTypes.string.isRequired,
}