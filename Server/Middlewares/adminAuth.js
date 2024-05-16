const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../log/logger');

async function authorize(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const user = jwt.verify(token, process.env.SECRET_KEY);
            logger.info(`user: ${user.id}`);
            if (user.id && user.user_role == 3) {
                req.user = user;
                next();
            } else {
                res.status(401).json("Unauthorized");
            }
        } else {
            res.status(401).json("You need to log in first");
        }
    } catch (error) {
        res.status(400).json({error: "Error in admin authentication"});
    }
};

module.exports = {
    authorize,
};