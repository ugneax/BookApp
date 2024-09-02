import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const SingleUserCard = ({ user }) => {
    return (
        <Card className="mb-3 userCard">
            <div className="d-flex justify-content-center p-4">
                <img className="singleUserCardImage" src={user.photoUrl} alt={user.username}/>
            </div>
            <Card.Body>
                <Card.Title>{user.username}</Card.Title>
                <button className="profilePageButton">
                    <Link to={`/user/${user.username}`} className="text-decoration-none text-white">
                        View User
                    </Link>
                </button>
            </Card.Body>
        </Card>
    );
};

export default SingleUserCard;