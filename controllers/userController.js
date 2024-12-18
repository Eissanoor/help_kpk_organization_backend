var dotenv = require("dotenv");
const passport = require('passport');
const session = require('express-session');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
dotenv.config({ path: "./config.env" });


const frontendbaseURL = "https://pakardi.com"
const addUser = async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    dateOfBirth, 
    aboutMe, 
    phone, 
    address,  
    id_cardNo, // Remove default placeholder
    taxNo,
  } = req.body;

  const isGemstone = req.body.isGemstone || false;

  const imagePath = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
  const pictureBusinessCertificate = req.files?.pictureBusinessCertificate 
    ? `/uploads/${req.files.pictureBusinessCertificate[0].filename}` 
    : null;

    const frontImage = req.files?.frontImage 
    ? `/uploads/${req.files.frontImage[0].filename}` 
    : null;

    const backImage = req.files?.backImage 
    ? `/uploads/${req.files.backImage[0].filename}` 
    : null;

  // Validate basic required fields
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // If isGemstone is true, validate the additional fields
  if (isGemstone) {
    if (!id_cardNo) {
      return res.status(400).json({ error: 'ID card number is required for gemstone users' });
    }
    if (!taxNo) {
      return res.status(400).json({ error: 'Tax number is required for gemstone users' });
    }
    if (!pictureBusinessCertificate) {
      return res.status(400).json({ error: 'Business certificate image is required for gemstone users' });
    }
    if (!frontImage) {
      return res.status(400).json({ error: 'frontImage image is required for gemstone users' });
    }
    if (!backImage) {
      return res.status(400).json({ error: 'backImage image is required for gemstone users' });
    }
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user object
    const newUser = new User({
      username,
      email,
      image: imagePath,
      password,
      dateOfBirth,
      aboutMe,
      status: 1,
      phone,
      address,
   
      isGemstone,
      id_cardNo: isGemstone ? id_cardNo : null,
      taxNo: isGemstone ? taxNo : null,
      pictureBusinessCertificate: isGemstone ? pictureBusinessCertificate : null,
      frontImage: isGemstone ? frontImage : null,
      backImage: isGemstone ? backImage : null
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      username, 
      email, 
      password, 
      dateOfBirth, 
      aboutMe, 
      status, 
      phone, 
      address, 
      isGemstone, 
      id_cardNo, 
      taxNo 
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imagePath = user.image;
    let pictureBusinessCertificatePath = user.pictureBusinessCertificate;
    let frontImagePath = user.frontImage;
    let backImagePath = user.backImage;

    // Handle new image uploads
    if (req.files) {
      // Handle profile image
      if (req.files["image"] && req.files["image"][0]) {
        if (user.image) {
          const oldImagePath = path.join(__dirname, '..', user.image);
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
        imagePath = `/uploads/${req.files["image"][0].filename}`;
      }

      // Handle business certificate image
      if (req.files["pictureBusinessCertificate"] && req.files["pictureBusinessCertificate"][0]) {
        if (user.pictureBusinessCertificate) {
          const oldCertificatePath = path.join(__dirname, '..', user.pictureBusinessCertificate);
          fs.unlink(oldCertificatePath, (err) => {
            if (err) console.error("Error deleting old business certificate:", err);
          });
        }
        pictureBusinessCertificatePath = `/uploads/${req.files["pictureBusinessCertificate"][0].filename}`;
      }

      // Handle front image
      if (req.files["frontImage"] && req.files["frontImage"][0]) {
        if (user.frontImage) {
          const oldFrontImagePath = path.join(__dirname, '..', user.frontImage);
          fs.unlink(oldFrontImagePath, (err) => {
            if (err) console.error("Error deleting old front image:", err);
          });
        }
        frontImagePath = `/uploads/${req.files["frontImage"][0].filename}`;
      }

      // Handle back image
      if (req.files["backImage"] && req.files["backImage"][0]) {
        if (user.backImage) {
          const oldBackImagePath = path.join(__dirname, '..', user.backImage);
          fs.unlink(oldBackImagePath, (err) => {
            if (err) console.error("Error deleting old back image:", err);
          });
        }
        backImagePath = `/uploads/${req.files["backImage"][0].filename}`;
      }
    }

    // If isGemstone is true, validate gemstone-related fields
    if (isGemstone) {
      if (!id_cardNo) {
        return res.status(400).json({ error: 'ID card number is required for gemstone users' });
      }
      if (!taxNo) {
        return res.status(400).json({ error: 'Tax number is required for gemstone users' });
      }
      if (!pictureBusinessCertificatePath) {
        return res.status(400).json({ error: 'Business certificate image is required for gemstone users' });
      }
      if (!frontImagePath) {
        return res.status(400).json({ error: 'Front image is required for gemstone users' });
      }
      if (!backImagePath) {
        return res.status(400).json({ error: 'Back image is required for gemstone users' });
      }
    }

    // Update user fields
    user.username = username || user.username;
    user.email = email || user.email;
    
    // Hash password if updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.aboutMe = aboutMe || user.aboutMe;
    user.status = status || user.status;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    user.image = imagePath;
    user.isGemstone = isGemstone !== undefined ? isGemstone : user.isGemstone;
    user.id_cardNo = isGemstone ? id_cardNo : null;
    user.taxNo = isGemstone ? taxNo : null;
    user.pictureBusinessCertificate = isGemstone ? pictureBusinessCertificatePath : null;
    user.frontImage = isGemstone ? frontImagePath : null;
    user.backImage = isGemstone ? backImagePath : null;

    // Save updated user
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);

  }catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
      const users = await User.find();
      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user to get their image path before deletion
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginWithGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'login' })(req, res, next);
};


const signupWithGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: 'signup' })(req, res, next);
};

const googleCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    if (!user) {
      const status = req.query.state === 'login' ? 0 : 1;

      // Redirect based on the status value
      if (status === 0) {
        return res.redirect('https://pakardi.com/SinUpForm');
      } else if (status === 1) {
        return res.redirect('https://pakardi.com/LoginForm');
      }

      const redirectUrl = req.query.state === 'login' ? '/signup' : '/login';
      return res.redirect(`${process.env.CLIENT_URL}${redirectUrl}?status=${status}`);
    }

    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      // Generate JWT token with userId included
      const payload = { id: user._id, email: user.email }; // Include userId in the payload
      console.log(payload, "------------------");

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Redirect to client-side dashboard with token in query params
      res.redirect(`${frontendbaseURL}?token=${token}&userId=${user._id}`);
    });
  })(req, res, next);
};





// Export functions at the bottom
module.exports = {
  updateUser,
  addUser,
  getUsers,
  getUserById,
  deleteUser,
  changePassword,
  loginWithGoogle,
  signupWithGoogle,
  googleCallback,
  loginUser
};
