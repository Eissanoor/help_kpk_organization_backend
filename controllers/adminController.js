var dotenv = require("dotenv");
const Admin = require('../models/adminModel');
const sendResponse = require('../utils/responseHandler');
dotenv.config({ path: "./config.env" });

const loginadmin = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email) {
      return sendResponse(res, 400, false, 'Email is required');
    }
  
    if (!password) {
      return sendResponse(res, 400, false, 'Password is required');
    }
  
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return sendResponse(res, 400, false, 'Invalid email or password');
      }
  
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return sendResponse(res, 400, false, 'Invalid email or password');
      }
  
      // Successful login
      sendResponse(res, 200, true, 'Admin logged in successfully');
    } catch (error) {
      sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
  };
  

  module.exports = {
    loginadmin
  };