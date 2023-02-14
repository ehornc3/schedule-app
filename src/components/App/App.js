import React from "react";
import './App.css';
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Shifts from "../Shifts/Shifts"
import Users from "../Users/Users"

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.state = {
            token: this.retrieveToken(),
            tokenExpiration: this.retrieveTokenExpiration(),
            name: localStorage.getItem("name")
        }
        this.retrieveToken = this.retrieveToken.bind(this)
        this.retrieveTokenExpiration = this.retrieveTokenExpiration.bind(this)
        this.saveToken = this.saveToken.bind(this)
        this.renewToken = this.renewToken.bind(this)

        if (this.state.tokenExpiration && Date.now() + 15 * 60 * 1000 > this.state.tokenExpiration && Date.now() < this.state.tokenExpiration) {
            this.renewToken();
        }
    }

    retrieveToken() {
        const tokenString = localStorage.getItem("token")
        const userToken = JSON.parse(tokenString)
        const tokenExpirationString = localStorage.getItem("tokenExpiration")
        if (tokenExpirationString) {
            let expiration = JSON.parse(tokenExpirationString)
            if (Date.now() > expiration) {
                this.saveToken();
            }
        }
        return userToken
    }
    retrieveTokenExpiration() {
        const expString = localStorage.getItem("tokenExpiration")
        return JSON.parse(expString)
    }

    saveToken(userToken) {
        if (!userToken) {
            this.setState({token: undefined})
            localStorage.removeItem("token")
            localStorage.removeItem("tokenExpiration")
        } else {
            let expiration = Date.now() + 30 * 60 * 1000
            localStorage.setItem("token", JSON.stringify(userToken))
            localStorage.setItem("tokenExpiration", JSON.stringify(expiration))
            this.setState({token: userToken})
        }
    }
    // After page is loaded, fetch a new token.
    async renewToken() {
        let renewedToken = await fetch("http://localhost:8080/api/auth/renew", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({token: this.state.token})
        }).then(data => data.json())
        console.log(renewedToken)
        let expiration = Date.now() + 30 * 60 * 1000
        localStorage.setItem("token", JSON.stringify(renewedToken.token))
        localStorage.setItem("tokenExpiration", JSON.stringify(expiration))
        this.state.token = renewedToken.token
        this.state.tokenExpiration = expiration
    }

    render() {
        if (!this.state.token) {
            return <Login app={this}></Login>
        }
        return (
            <div className="wrapper">
                <BrowserRouter>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard app={this}/>}/>
                        <Route path="/shifts" element={<Shifts app={this}/>}/>
                        <Route path="/users" element={<Users app={this}/>}/>

                        <Route path="*" element={<Navigate to="/dashboard"/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;
