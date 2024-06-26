const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: "Forbidden" });
        }

        // Attach decoded user information to req.user
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
