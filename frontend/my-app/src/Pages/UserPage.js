import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import http from '../Plugins/http';
import mainStore from "../Store/MainStore";

const UserPage = () => {
    const { token } = mainStore();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [display, setDisplay] = useState("none");
    const [buttonDisplay, setButtonDisplay] = useState("block");
    const [error, setError] = useState("none");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await http.getAuth(`/user/${username}`, token);
                if (res.success) {
                    setUser(res.data);
                } else {
                    setError("Failed to fetch user data");
                }
            }catch (err) {
                setError("An error occurred");
            }
        };

        fetchUserData();
    }, [username, token]);


    function sendMessage(){
        setDisplay("block")
        setButtonDisplay("none")
    }
    const startConversation = async () => {
        try {
            const res = await http.postAuth(`/conversation`, { username, message: newMessage }, token);
            if (res.success) {
                navigate(`/chat/${res.data._id}`);
            } else {
                setError("Failed to start conversation");
            }
        } catch (err) {
            setError("An error occurred");
        }
    };

    return (
        <div>
            {user ? (
                <Card className="mt-5">
                    <div className="d-flex flex-lg-row p-5 flex-sm-column onMobile">
                        <div className="flex1 d-flex justify-content-center">
                            <img src={user.photoUrl} className="userPagePhoto"/>
                        </div>
                        <div className="flex1 d-flex flex-column gap-4">
                            <div className="d-flex flex-column align-items-center">
                                <h4>Username: {user.username}</h4>
                                <button className="profilePageButton" style={{display: buttonDisplay, marginTop: "25px"}} onClick={sendMessage}>Start conversation</button>
                            </div>
                            <div style={{display: display}}>
                                <Form.Group>
                                <Form.Label>Send a message</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={newMessage}
                                        placeholder="Enter your message"
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </Form.Group>
                                <button className="profilePageButton" onClick={startConversation}>Send</button>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default UserPage;