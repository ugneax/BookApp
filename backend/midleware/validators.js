const resSend = require("../plugins/sendRes")
const userDb = require("../schemas/userSchema")
const bcrypt = require("bcrypt")
const validator = require('validator');

module.exports = {
    registerValidate: async (req, res, next) => {
        const {username, password, passwordRepeat} = req.body

        if(!username)
            return resSend(res, false, "Enter username!", null)

        const userExists = await userDb.findOne({username})

        if (userExists) {
            return resSend(res, false, "User name already registered", null)
        }

        if(!password)
            return resSend(res, false, "Enter password!", null)

        if(!passwordRepeat)
            return resSend(res, false, "Repeat password!", null)

        if (username.length > 20 || username.length < 4)
            return resSend(res, false, "Username should be more than 4 and less then 20 characters long", null)

        if (password.length > 20 || password.length < 4)
            return resSend(res, false, "Password should be more than 4 and less then 20 characters long", null)

        const hasUppercase = /[A-Z]/.test(password)
        const hasSpecialChar = /[!@#$%^&*_+]/.test(password)

        if (!hasUppercase) {
            return resSend(res, false, "Password must include at least one uppercase letter.", null)
        }

        if (!hasSpecialChar) {
            return resSend(res, false, "Password must include at least one special character (!@#$%^&*_+).", null)
        }

        if(password !== passwordRepeat) {
            return resSend(res, false, "Passwords should match", null)
        }

        next()
    },loginValidate: async (req, res, next) => {
        const {username, password} = req.body

        if(!username)
            return resSend(res, false, "Enter username!", null)

        if(!password)
            return resSend(res, false, "Enter password!", null)

        const user = await userDb.findOne({username})

        if (!user) {
            return resSend(res, false, "Entered bad username or password", null)
        }

        const isPasswordCompare = await bcrypt.compare(password, user.password)

        if (!isPasswordCompare) {
            return resSend(res, false, "Entered bad username or password", null)
        }

        req.user = user

        next()
    },
    updateProfilePhotoUrlValidate: async (req, res, next) => {
        const {photoUrl} = req.body

        if (!photoUrl || !validator.isURL(photoUrl)) {
            return resSend(res, false, "Please provide correct image URL", null)
        }

        next()
    },
    updateProfileUsernameValidate: async (req, res, next) => {
        const { username, userId } = req.body;

        if (!username) {
            return resSend(res, false, "Enter username!", null);
        }

        const user = await userDb.findOne({ _id: userId });

        if (!user) {
            return resSend(res, false, "User not found", null);
        }

        if (username === user.username) {
            return resSend(res, false, "New username is the same as the current one", null);
        }

        if (username.length > 20 || username.length < 4) {
            return resSend(res, false, "Username should be more than 4 and less than 20 characters long", null);
        }

        const userExists = await userDb.findOne({ username });
        if (userExists && userExists._id.toString() !== userId) {
            return resSend(res, false, "Username already exists", null);
        }

        next();
    },
    updateProfilePasswordValidate: async (req, res, next) => {
        const { newPassword, repeatPassword, oldPassword, userId } = req.body;

        if (!oldPassword) {
            return resSend(res, false, "Please provide the old password", null);
        }

        if (!newPassword) {
            return resSend(res, false, "Please provide a new password", null);
        }

        if (!repeatPassword) {
            return resSend(res, false, "Please repeat the new password", null);
        }

        const user = await userDb.findOne({ _id: userId });

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if (!isOldPasswordCorrect) {
            return resSend(res, false, "Old password is incorrect", null);
        }

        if (newPassword !== repeatPassword) {
            return resSend(res, false, "New passwords do not match", null);
        }

        if (newPassword.length > 20 || newPassword.length < 4) {
            return resSend(res, false, "New password should be more than 4 and less than 20 characters long", null);
        }

        const hasUppercase = /[A-Z]/.test(newPassword);
        if (!hasUppercase) {
            return resSend(res, false, "New password must include at least one uppercase letter.", null);
        }

        const hasSpecialChar = /[!@#$%^&*_+]/.test(newPassword);
        if (!hasSpecialChar) {
            return resSend(res, false, "New password must include at least one special character (!@#$%^&*_+).", null);
        }

        next();
    }
}