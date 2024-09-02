require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const mainRouter = require("./routers/mainRouter")
const mongoose = require("mongoose")
const { Server } = require("socket.io");

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log("Successfully connected to database")
    }).catch(err => {
    console.log("Error message: "+err)
})

app.use(cors())
app.use(express.json())
app.use("/", mainRouter)
app.listen(2001)

const io = new Server({
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    socket.on('joinConversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('sendMessage', (conversationId, message) => {
        io.to(conversationId).emit('receiveMessage', message);
    });

});

io.listen(2000);