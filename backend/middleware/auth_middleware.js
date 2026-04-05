const { compare } = require('bcrypt');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(verified)console.log("v")
        req.user = verified; 
        console.log('verified')
        next();
    }
    catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
}

module.exports = authenticateToken;