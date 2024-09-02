import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Form from 'react-bootstrap/Form';
import http from '../Plugins/http';
import mainStore from "../Store/MainStore";
import SingleMessage from "../Components/SingleMessage";

const socket = io.connect('http://localhost:2000');

const ChatPage = () => {
    const { token,user } = mainStore();
    const { conversationId } = useParams();
    const [conversation, setConversation] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConversationData = async () => {
            const res = await http.getAuth(`/conversation/${conversationId}`, token);
            if (res.success) {
                setConversation(res.data);
            } else {
                setError("Failed to fetch conversation");
            }
        };

        fetchConversationData();

        socket.emit('joinConversation', conversationId);

        socket.on('receiveMessage', (message) => {
            setConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, message],
            }));
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [conversationId, token]);

    const sendMessage = async () => {
        const res = await http.postAuth(`/conversation/${conversationId}/message`, { message: newMessage }, token);
        if (res.success) {
            let timestamp = new Date().getTime()
            socket.emit('sendMessage', conversationId, { sender: user, content: newMessage, timestamp });
            setNewMessage("");
        } else {
            setError("Failed to send message");
        }
    };


    if (error) return <div>{error}</div>;

    return (
        <div>
            {conversation ? (
                <div className="chatContainer">
                    <div className="mt-5">
                        {conversation.messages.map(msg => (
                            <SingleMessage key={msg._id} message={msg} conversationId={conversationId} />
                        ))}
                    </div>
                    <Form.Group className="mt-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="profilePageButton" onClick={sendMessage}>Send</button>
                    </Form.Group>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ChatPage;