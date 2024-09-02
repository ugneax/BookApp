import React, {useContext, useState} from 'react';
import MainStore from "../Store/MainStore";
import {Link, useNavigate} from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const Toolbar = () => {
    const { user, setUser, setToken  } = MainStore();
    const navigate=useNavigate()

    function logout(){
        setUser(null)
        setToken(null)
        navigate("/login")
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">BookChat</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {user && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
                        {user && <Nav.Link as={Link} to="/users">All Users</Nav.Link>}
                        {user && <Nav.Link as={Link} to="/conversations">Conversations</Nav.Link>}
                    </Nav>
                    <Nav>
                        {!user && (
                            <Button variant="outline-light" as={Link} to="/register" className="me-2">
                                Register
                            </Button>
                        )}
                        {user && (
                            <Button variant="outline-light" onClick={logout}>
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Toolbar;