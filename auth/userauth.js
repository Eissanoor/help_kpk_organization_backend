const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendResponse = require('../utils/responseHandler');
const authenticateUser = async (req, res, next) => {
   const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return sendResponse(res, 401, false, 'Authorization token is missing or invalid');
   }
    const token = authHeader.split(' ')[1];
    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const user = await User.findById(decoded.id);
        if (!user) {
           return sendResponse(res, 404, false, 'user not found');
       }
        req.user = user; // Attach user data to the request object
       next(); // Proceed to the next middleware or route handler
   } catch (error) {
       sendResponse(res, 401, false, 'Invalid or expired token', { error: error.message });
   }
};
module.exports = authenticateUser;