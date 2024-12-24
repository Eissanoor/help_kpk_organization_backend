var dotenv = require("dotenv");
const Admin = require('../models/adminModel');
const sendResponse = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');

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
  
      // Generate auth token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

      // Successful login with token
      sendResponse(res, 200, true, 'Admin logged in successfully', { token });
    } catch (error) {
      sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
  };
  
const addnewadmin = async (req, res) => {
    const { email, password,username } = req.body;

    if (!email) {
        return sendResponse(res, 400, false, 'Email is required');
    }

    if (!password) {
        return sendResponse(res, 400, false, 'Password is required');
    }
    if (!username) {
      return sendResponse(res, 400, false, 'username is required');
  }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return sendResponse(res, 400, false, 'Admin with this email already exists');
        }

        const newAdmin = new Admin({ email, password,username });
        await newAdmin.save();

        sendResponse(res, 201, true, 'Admin created successfully');
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const getadmindata = async (req, res) => {
    // At this point, req.admin is already populated by the middleware
    sendResponse(res, 200, true, 'Admin data retrieved successfully', { admin: req.admin });
};

module.exports = {
    loginadmin,
    addnewadmin,
    getadmindata
};