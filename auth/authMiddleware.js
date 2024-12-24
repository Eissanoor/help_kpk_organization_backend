const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const sendResponse = require('../utils/responseHandler');
const authenticateAdmin = async (req, res, next) => {
   const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return sendResponse(res, 401, false, 'Authorization token is missing or invalid');
   }
    const token = authHeader.split(' ')[1];
    try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const admin = await Admin.findById(decoded.id);
        if (!admin) {
           return sendResponse(res, 404, false, 'Admin not found');
       }
        req.admin = admin; // Attach admin data to the request object
       next(); // Proceed to the next middleware or route handler
   } catch (error) {
       sendResponse(res, 401, false, 'Invalid or expired token', { error: error.message });
   }
};
module.exports = authenticateAdmin;