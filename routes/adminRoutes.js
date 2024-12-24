const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateAdmin = require('../auth/authMiddleware');
router.post('/adminlogin', adminController.loginadmin);
router.post('/addnewadmin', adminController.addnewadmin)
router.get("/getadmindata", authenticateAdmin,adminController.getadmindata)
module.exports = router;