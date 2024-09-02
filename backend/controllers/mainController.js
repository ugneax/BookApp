const resSend = require("../plugins/sendRes")
const userDb = require("../schemas/userSchema")
const conversationDb = require("../schemas/conversationSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports = {
    register: async (req, res) => {
        const {username, password: password} = req.body

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new userDb({
            username,
            password: passwordHash,
            photoUrl: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
        })

        await newUser.save()

        return resSend(res, true, null, null)
    },
    login: async(req, res) => {
        const data = {
            id: req.user._id,
            username: req.user.username
        }

        const token = jwt.sign(data, process.env.JWT_SECRET)

        data.photoUrl = req.user.photoUrl;

        return resSend(res, true, null, {token, user: data})
    },
    updateProfilePhotoUrl: async(req, res) => {
        const {photoUrl, userId} = req.body

        const user = await userDb.findOne({_id: userId});

        user.photoUrl = photoUrl

        await user.save();

        return resSend(res, true, "Photo URL was changed", {user})
    },
    updateProfileUsername: async(req, res) => {
        const {username, userId} = req.body

        const user = await userDb.findOne({_id: userId});

        user.username = username

        await user.save();

        return resSend(res, true, "Username was successfully updated", {user})
    },
    updateProfilePassword: async(req, res) => {
        const {newPassword, userId} = req.body

        const user = await userDb.findOne({_id: userId});
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(newPassword, salt)

        await user.save();

        return resSend(res, true, "Password was changed", null)
    },
    getAllUsers: async (req, res) => {
        const users = await userDb.find({});
        return resSend(res, true, "Users fetched successfully", { users });
    },
    getUser: async(req, res) => {
        const username = req.params.username
        const user = await userDb.findOne({username: username});

        if (!user) {
            return resSend(res, false, "User not found", null)
        }

        return resSend(res, true, "User was found", user)
    },
    getConversation: async (req, res) => {
        const { conversationId } = req.params;
        const conversation = await conversationDb.findById(conversationId)
            .populate('participants', 'username photoUrl')
            .populate('messages.likeReaction', 'username')
            .populate('messages.sender', 'username photoUrl');

        if (!conversation) {
            return resSend(res, false, "Conversation not found", null);
        }

        return resSend(res, true, "Conversation fetched successfully", conversation);
    },
    sendMessage: async (req, res) => {
        const { conversationId } = req.params;
        const { message } = req.body;
        const userId = req.user._id;

        const conversation = await conversationDb.findById(conversationId);
        if (!conversation) {
            return resSend(res, false, "Conversation not found", null);
        }

        conversation.messages.push({
            sender: userId,
            content: message,
        });

        await conversation.save();

        return resSend(res, true, "Message sent successfully", conversation);
    },
    startConversation: async (req, res) => {
        const { username, message } = req.body;

        const recipient = await userDb.findOne({ username });

        if (!recipient) {
            return resSend(res, false, "Recipient not found", null);
        }

        const newConversation = new conversationDb({
            participants: [req.user._id, recipient._id],
            messages: [
                {
                    sender: req.user._id,
                    content: message,
                    timestamp: new Date(),
                },
            ],
        });

        await newConversation.save();

        return resSend(res, true, "Conversation started", { _id: newConversation._id });
    },
    getAllConversations: async (req, res) => {
        const userId = req.user._id;

        const conversations = await conversationDb.find({ participants: userId })
            .populate('participants', 'username photoUrl')
            .sort({ updatedAt: -1 }); // Sort by the most recent conversation

        if (!conversations.length) {
            return resSend(res, false, "No conversations found", null);
        }

        return resSend(res, true, "Conversations fetched successfully", conversations);
    },
    likeMessage: async (req, res) => {
        const { conversationId, messageId } = req.params;
        const userId = req.user._id;
        const conversation = await conversationDb.findById(conversationId);
        const message = conversation.messages.id(messageId);
        const likeIndex = message.likeReaction.findIndex(
            (user) => user._id.equals(userId)
        );

        if (likeIndex > -1) {
            message.likeReaction.splice(likeIndex, 1);
        } else {
            message.likeReaction.push(req.user);
        }

        await conversation.save();
        return resSend(res, true, "Message like status updated", message);
    }, deleteConversation: async (req, res) => {
        const {conversationId} = req.params;
        const conversation = await conversationDb.findById(conversationId);
         if(!conversation){
             return res.send({success: true, message: "Conversation not found"});
         }
        await conversationDb.findByIdAndDelete(conversationId);

        res.send({success: true, message: "Conversation deleted successfully"});
    }
}