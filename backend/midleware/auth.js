const jwt = require("jsonwebtoken");
const userDb = require("../schemas/userSchema"); // Import your user model
const sendRes = require("../plugins/sendRes");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return sendRes(res, false, "No token provided", null);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database using the ID from the token
        const user = await userDb.findById(decoded.id);

        if (!user) {
            return sendRes(res, false, "User not found", null);
        }

        // Attach the user object to req.user
        req.user = user;
        next();
    } catch (err) {
        return sendRes(res, false, "Invalid token", null);
    }
};