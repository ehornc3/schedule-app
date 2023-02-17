import React, {useState} from 'react';
import "./Login.css"
import {Button, Form, Alert, Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"

async function loginUser(credentials) {
    return fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

async function signupUser(details) {
    return fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(details)
    })
        .then(data => data.json())
}

export default function Login(props) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [isTargetSignup, setTargetSignup] = useState(false)
    //const [warning, setWarning] = useState()

    const handleSubmit = async e => {
        e.preventDefault()
        let res
        if (isTargetSignup) {
            res = await signupUser({
                email,
                password,
                name
            })
        } else {
            res = await loginUser({
                email,
                password
            })
        }
        if (res.status === "success") {
            await props.app.saveToken(res.token)
            localStorage.setItem("name", res.name)
            props.app.setState({"name": res.name})
        }
        else {
            return <Alert variant={"danger"}>{res.description}</Alert>
        }
    }
    return ( // Log in
        <div className="login-wrapper">
            <h1>{isTargetSignup ? "Sign up" : "Log In"}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
                </Form.Group>

                {isTargetSignup && <>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="name" onChange={e => setName(e.target.value)} placeholder="First Name" />
                    </Form.Group>
                </>}

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">{isTargetSignup ? "Sign Up" : "Log In"}</Button>
            </Form>
            <br />
            { isTargetSignup ?
                <Nav.Link onClick={() => setTargetSignup(!isTargetSignup)}>Already have an account? <u>Log in here.</u></Nav.Link> :
                <Nav.Link onClick={() => setTargetSignup(!isTargetSignup)}>No account? <u>Signup here.</u></Nav.Link>
            }
        </div>
    )
}