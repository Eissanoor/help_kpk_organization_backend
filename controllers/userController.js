var dotenv = require("dotenv");

const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const   sendResponse  = require('../utils/responseHandler');
dotenv.config({ path: "./config.env" });


const addUser = async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    locationId,
    phonenumber  
    
  } = req.body;
  // Validate basic required fields
  if (!username) {
    return sendResponse(res, 400, false, 'Username is required');
  }
  if (!email) {
    return sendResponse(res, 400, false, 'Email is required');
  }
  if (!password) {
    return sendResponse(res, 400, false, 'Password is required');
  }
  if (!phonenumber) {
    return sendResponse(res, 400, false, 'Phone number is required');
  }
  if (!locationId) {
    return sendResponse(res, 400, false, 'location is required');
  }
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, false, 'Email already exists');
    }
    // Create new user object
    const newUser = new User({
      username,
      email,
      password,
      status: 1,
      locationId,
      phonenumber
    });

    // Save the user to the database
    await newUser.save();
    return sendResponse(res, 200, true, 'User has been added successfully', newUser);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return sendResponse(res, 400, false, 'Email is required');
  }

  if (!password) {
    return sendResponse(res, 400, false, 'Password is required');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, false, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 400, false, 'Invalid email or password');
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return sendResponse(res, 200, true, 'User logged in successfully', { token });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("locationId", "locationName");
    return sendResponse(res, 200, true,"All Users", users);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
      const user = await User.findById(id);

      if (!user) {
          return sendResponse(res, 404, false, 'User not found');
      }

      return sendResponse(res, 200, true,"get by User", user);
  } catch (error) {
      return sendResponse(res, 500, false, error.message);
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user to get their image path before deletion
    const user = await User.findById(id);
    
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Construct the path for the user's image
    if (user.image) {
      const imagePath = path.join(__dirname, '..', user.image); // Adjust the path as necessary
      // Delete the user's image from the local directory
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting user's image:", err);
        } else {
          console.log("User's image deleted:", imagePath);
        }
      });
    }

    // Proceed to delete the user
    await User.findByIdAndDelete(id);

    return sendResponse(res, 200, true, { message: 'User deleted successfully' });
  } catch (error) {
      return sendResponse(res, 500, false, error.message);
  }
};
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    if (user.password !== currentPassword) {
      return sendResponse(res, 400, false, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return sendResponse(res, 200, true, { message: 'Password changed successfully' });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};





// Export functions at the bottom
module.exports = {
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  changePassword,
  loginUser
};
