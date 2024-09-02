import React, {useState} from 'react';
import http from '../Plugins/http';
import mainStore from "../Store/MainStore";

const SingleMessage = ({ message, conversationId }) => {
    const { token,user } = mainStore();

    const toggleLike = async () => {
        await http.postAuth(`/conversation/${conversationId}/message/${message._id}/like`, {}, token);
    };

    return (
        <div style={{marginBottom: '10px'}} >
            <div className="d-flex gap-3">
                <div>
                    <img className="photoInMessages" src={message.sender.photoUrl}/>
                </div>
                <div className="d-flex flex-column" style={{width:"100%"}}>
                    <div className="d-flex justify-content-between">
                        <strong>{message.sender.username}</strong>
                        <span>
                            {new Date(message.timestamp).toLocaleDateString()}{" "}
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </span>
                    </div>
                    <div>
                        <p style={{textWrap:"balance", wordBreak:"break-all"}}>{message.content}</p>
                        {message.likeReaction?.length > 0 && (
                            <p className="likedBy">Liked by: {message.likeReaction.map((user) => user.username).join(', ')}</p>
                        )}
                        {message.sender._id !== user.id && message.sender.id !== user.id && (
                            <button onClick={toggleLike} style={{border:"none", backgroundColor:"transparent"}}>
                                {message.likeReaction?.some((liker) => liker._id === user.id) ? '👎' : '👍'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleMessage;