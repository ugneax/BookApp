import React, {useState} from 'react';
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import http from "../Plugins/http";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {

    const usernameRef = useRef()
    const passwordRef = useRef()
    const passwordRepeatRef = useRef()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState()
    const [infoMessage, setInfoMessage] = useState("none")

    async function auth() {
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            passwordRepeat: passwordRepeatRef.current.value
        }

        const res = await http.post("/register", user)

        if(res.success){
            navigate("/login")
        }else {
            setErrorMessage(res.message)
        }
    }

    function displayInfo(message){
        setInfoMessage(message)
    }

    function navToLogIn(){
        navigate("/login")
    }

    return (
        <div className="chatRegistrationContainer">
            <div className="registrationTitle">
                <h4 className="chatTitle">Let's talk about</h4>
                <h3 className="chatName">BOOKS
                    <span>
                        <FontAwesomeIcon icon={faCircleInfo} onMouseEnter={() => displayInfo("block")}
                                         onMouseLeave={() => displayInfo("none")} className="infoIcon"/>
                    </span>
                </h3>
                <div style={{display: infoMessage}} className="informationToReader">
                    Chat app for all book lovers and readers!
                </div>
            </div>
            <input type="text" ref={usernameRef} placeholder="Your username"/>
            <input type="password" ref={passwordRef} placeholder="Password"/>
            <input type="password" ref={passwordRepeatRef} placeholder="Repeat password"/>
            <p>{errorMessage}</p>
            <button onClick={auth}>Register</button>
            <div>
                <h5 style={{color:"white"}}>Already a member?<span  className="alreadyMemberButton" onClick={navToLogIn}>Log in</span></h5>
            </div>
        </div>
    );
};

export default RegisterPage;