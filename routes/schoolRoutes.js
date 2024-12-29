const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { upload } = require("../config/multerConfig.js");

router.post('/addnewschool', upload.single("image"), schoolController.addnewschool)

module.exports = router;