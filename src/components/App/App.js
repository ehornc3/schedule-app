import React, {useState} from "react";
import './App.css';
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import useToken from "./useToken";
import Shifts from "../Shifts/Shifts"

function App() {
    const { token, setToken, destroyToken } = useToken()

    if (!token) {
        console.log("No token found. Returning login screen.")
        return <Login setToken={setToken}></Login>
    }
    console.log('token found' + token)
    return (
        <div className="wrapper">
            <h1>Application</h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/shifts" element={<Shifts />} />

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
