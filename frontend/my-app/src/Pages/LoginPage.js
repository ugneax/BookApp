import React, {useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import mainStore from "../Store/MainStore";
import http from "../Plugins/http";


const LoginPage = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()
    const {setUser, setToken} = mainStore()
    const [errorMessage, setErrorMessage] = useState()

    async function auth() {
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value
        }

        const res = await http.post("/login", user)

        if(res.success) {
            setUser(res.data.user)
            setToken(res.data.token)
            navigate('/profile')
        }else {
            setErrorMessage(res.message)
        }
    }

    return (
        <div className="loginContainer">
            <div className="transparentContainer">
                <h2>Welcome back!</h2>
                <input type="text" ref={usernameRef} placeholder="username"/>
                <input type="password" ref={passwordRef} placeholder="password"/>
                <p style={{padding:"10px", fontWeight:"700"}}>{errorMessage}</p>
                <button onClick={auth}>Login</button>
            </div>
        </div>
    );
};

export default LoginPage;