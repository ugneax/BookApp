import React, { useRef, useState } from 'react';
import mainStore from "../Store/MainStore";
import http from "../Plugins/http";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

const ProfilePage = () => {
    const photoUrlRef = useRef();
    const usernameChangeRef = useRef();
    const newPasswordRef = useRef();
    const repeatNewPasswordRef = useRef();
    const oldPasswordRef = useRef();
    const { setUser, user, token } = mainStore();

    // State for success/error messages
    const [errorMessagePhotoUrl, setErrorMessagePhotoUrl] = useState("");
    const [successMessagePhotoUrl, setSuccessMessagePhotoUrl] = useState("");
    const [errorMessageUsername, setErrorMessageUsername] = useState("");
    const [successMessageUsername, setSuccessMessageUsername] = useState("");
    const [errorMessagePassword, setErrorMessagePassword] = useState("");
    const [successMessagePassword, setSuccessMessagePassword] = useState("");

    async function updatePhoto() {
        const data = {
            photoUrl: photoUrlRef.current.value,
            userId: user.id,
        };

        const res = await http.postAuth("/profile/updatePhotoUrl", data, token);

        if (res.success) {
            setUser({...user, photoUrl: data.photoUrl });
            setSuccessMessagePhotoUrl(res.message);
            setErrorMessagePhotoUrl("");
        } else {
            setErrorMessagePhotoUrl(res.message);
            setSuccessMessagePhotoUrl("");
        }
    }

    async function updateUsername() {
        const data = {
            username: usernameChangeRef.current.value,
            userId: user.id,
        };

        const res = await http.postAuth("/profile/updateUsername", data, token);

        if (res.success) {
            setUser({...user, username: data.username });
            setSuccessMessageUsername(res.message);
            setErrorMessageUsername("");
        } else {
            setErrorMessageUsername(res.message);
            setSuccessMessageUsername("");
        }
    }

    async function updatePassword() {
        const data = {
            newPassword: newPasswordRef.current.value,
            repeatPassword: repeatNewPasswordRef.current.value,
            oldPassword: oldPasswordRef.current.value,
            userId: user.id,
        };

        const res = await http.postAuth("/profile/updatePassword", data, token);

        if (res.success) {
            setSuccessMessagePassword(res.message);
            setErrorMessagePassword("");
        } else {
            setErrorMessagePassword(res.message);
            setSuccessMessagePassword("");
        }
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col md={6}>
                    {/* Update Profile Photo */}
                    <Card className="mb-4">
                        <Card.Header as="h5">Update Profile Photo</Card.Header>
                        <Card.Body>
                            <div className="text-center">
                                <img src={user.photoUrl} alt="Profile" className="img-fluid rounded-circle mb-3" width="150" />
                            </div>
                            <Form.Group controlId="photoUrl">
                                <Form.Label>Change your photo</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={user.photoUrl}
                                    ref={photoUrlRef}
                                />
                            </Form.Group>
                            {successMessagePhotoUrl && <Alert variant="success">{successMessagePhotoUrl}</Alert>}
                            {errorMessagePhotoUrl && <Alert variant="danger">{errorMessagePhotoUrl}</Alert>}
                            <button className="profilePageButton" onClick={updatePhoto}>Save Profile Photo</button>
                        </Card.Body>
                    </Card>

                    {/* Change Username */}
                    <Card className="mb-4">
                        <Card.Header as="h5">Change Username</Card.Header>
                        <Card.Body>
                            <Form.Group controlId="username">
                                <Form.Label>Change your username</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={user.username}
                                    ref={usernameChangeRef}
                                />
                            </Form.Group>
                            {successMessageUsername && <Alert variant="success">{successMessageUsername}</Alert>}
                            {errorMessageUsername && <Alert variant="danger">{errorMessageUsername}</Alert>}
                            <button className="profilePageButton" onClick={updateUsername}>Save New Username</button>
                        </Card.Body>
                    </Card>

                    {/* Change Password */}
                    <Card className="mb-4">
                        <Card.Header as="h5">Change Password</Card.Header>
                        <Card.Body>
                            <Form.Group controlId="newPassword">
                                <Form.Label>New password</Form.Label>
                                <Form.Control
                                    type="password"
                                    ref={newPasswordRef}
                                />
                            </Form.Group>
                            <Form.Group controlId="repeatNewPassword" className="mt-3">
                                <Form.Label>Repeat new password</Form.Label>
                                <Form.Control
                                    type="password"
                                    ref={repeatNewPasswordRef}
                                />
                            </Form.Group>
                            <Form.Group controlId="oldPassword" className="mt-3">
                                <Form.Label>Enter your old password</Form.Label>
                                <Form.Control
                                    type="password"
                                    ref={oldPasswordRef}
                                />
                            </Form.Group>
                            {successMessagePassword && <Alert variant="success">{successMessagePassword}</Alert>}
                            {errorMessagePassword && <Alert variant="danger">{errorMessagePassword}</Alert>}
                            <button className="profilePageButton" onClick={updatePassword}>Save New Password</button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
