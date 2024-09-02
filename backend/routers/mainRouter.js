const express = require('express')
const Router = express.Router()

const{
    register,
    login,
    updateProfilePhotoUrl,
    updateProfileUsername,
    updateProfilePassword,
    getAllUsers,
    getUser,
    getConversation,
    getAllConversations,
    sendMessage,
    startConversation,
    likeMessage,
    deleteConversation
} = require("../controllers/mainController")

const {
    registerValidate,
    loginValidate,
    updateProfilePhotoUrlValidate,
    updateProfileUsernameValidate,
    updateProfilePasswordValidate
} = require("../midleware/validators")

const authMiddleware = require("../midleware/auth")

// Login, Register
Router.post("/register", registerValidate,  register)
Router.post("/login",  loginValidate, login)

// Profile
Router.post("/profile/updatePhotoUrl", authMiddleware, updateProfilePhotoUrlValidate, updateProfilePhotoUrl)
Router.post("/profile/updateUsername", authMiddleware, updateProfileUsernameValidate, updateProfileUsername)
Router.post("/profile/updatePassword", authMiddleware, updateProfilePasswordValidate, updateProfilePassword)

// Users
Router.post("/users/getAll", authMiddleware, getAllUsers)
Router.get("/user/:username", authMiddleware, getUser)

// Conversations, Chat
Router.get('/conversations', authMiddleware, getAllConversations);
Router.get('/conversation/:conversationId', authMiddleware, getConversation);
Router.post('/conversation/:conversationId/message', authMiddleware, sendMessage);
Router.post('/conversation/:conversationId/message/:messageId/like', authMiddleware, likeMessage);
Router.post('/conversation', authMiddleware, startConversation);
Router.delete('/conversation/:conversationId', authMiddleware, deleteConversation);

module.exports = Router