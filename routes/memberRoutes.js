const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { upload } = require("../config/multerConfig.js");
    
router.post('/addnewmember', upload.fields([
    { name: 'cnicFrontPic', maxCount: 1 },
    { name: 'cnicBackPic', maxCount: 1 }
]), memberController.addNewMember);
router.get('/getmember', memberController.getMember);
router.put('/updatememberproductids/:id', memberController.updateMemberProductIds);

module.exports = router;