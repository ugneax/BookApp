import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../Plugins/http';
import mainStore from "../Store/MainStore";
import SingleUserCard from "../Components/SingleUserCard";

const UsersPage = () => {
    const { token, user } = mainStore();
    const [allUsers, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const data = {};
            const res = await http.postAuth("/users/getAll", data, token);

            if (res.success) {
                setUsers(res.data.users);
            }
        };

        fetchUsers();
    }, [token]);

    return (
        <div className="mt-5 d-flex flex-wrap gap-3 align-content-center justify-content-center flex-column mainUsersContainer">
            <h3>Chat's users:</h3>
            <div className="usersContainer">
                {allUsers.map((userItem, index) => (
                    userItem.username !== user.username ? (
                        <SingleUserCard user={userItem} key={index} />
                    ) : null
                ))}
            </div>
        </div>
    );
};

export default UsersPage;