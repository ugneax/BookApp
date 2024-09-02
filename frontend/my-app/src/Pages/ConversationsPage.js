import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import http from '../Plugins/http';
import mainStore from "../Store/MainStore";

const ConversationsPage = () => {
    const { token } = mainStore();
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchConversationsData = async () => {
            const res = await http.getAuth(`/conversations`, token);
            if (res.success) {
                setConversations(res.data);
            } else {
                setError("Failed to fetch conversations");
            }
        };

        fetchConversationsData();
    }, [token]);

    const deleteConversation = async (conversationId) => {
        const res = await http.deleteAuth(`/conversation/${conversationId}`, token);
        if (res.success) {
            setConversations(conversations.filter(convo => convo._id !== conversationId));
        } else {
            setError(res.message);
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            {conversations.length > 0 ? (
                conversations.map((conversation) => (
                    <Card key={conversation._id} className="conversationContainer">
                        <Card.Body style={{height: "180px"}}>
                            <div className="d-flex onMobile">
                                <h5 style={{paddingInlineEnd: "7px"}}>Conversation between: </h5>
                                <Card.Title>
                                    {conversation.participants
                                        .map(participant => participant.username)
                                        .join(' & ')}
                                </Card.Title>
                            </div>
                            <Card.Text style={{height:"70px", overflow:"hidden" }}>
                                <span className="d-flex">
                                    Last message: {" "}
                                    {new Date(conversation.messages[conversation.messages.length - 1]?.timestamp).toLocaleDateString()}{" "}
                                    {new Date(conversation.messages[conversation.messages.length - 1]?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {conversation.messages[conversation.messages.length - 1]?.content}
                            </Card.Text>
                            <button className="conversationPageButton">
                                <Link to={`/chat/${conversation._id}`} className="text-decoration-none text-white">
                                    Go to Chat
                                </Link>
                            </button>
                            <button className="deleteConvoButton" onClick={() => deleteConversation(conversation._id)}>Delete Conversation</button>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>No conversations found.</p>
            )}
        </div>
    );
};

export default ConversationsPage;