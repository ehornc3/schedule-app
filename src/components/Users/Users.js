import React from 'react';
import CNavbar from "../CNavbar/CNavbar";
import {Table} from "react-bootstrap";

const accountPermissions = ["none", "user", "admin"]

export default class Users extends React.Component {
    constructor(props) {
        super(props)
        this.state = {data: {}}
    }

    componentDidMount() {
        fetch("http://localhost:8080/api/users/" + this.props.app.state.token, {
            method: "GET"
        })
            .then(data => data.json())
            .then(d => this.setState({data: d}))
    }

    render() {
        return(
            <div>
                <CNavbar app={this.props.app} title={"Account Control"}></CNavbar>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>E-mail</th>
                            <th>Name</th>
                            <th>Permission</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.rows && this.state.data.rows.map(item => (
                            <tr key={item.email}>
                                <td>{item.email}</td>
                                <td>{item.name}</td>
                                <td>{item.permission}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
}