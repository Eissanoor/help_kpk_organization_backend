const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { upload } = require("../config/multerConfig.js");
const apicache = require('apicache');
const cache = apicache.middleware;
router.post('/addnewmember', upload.fields([
    { name: 'cnicFrontPic', maxCount: 1 },
    { name: 'cnicBackPic', maxCount: 1 }
]), memberController.addNewMember);
router.get('/getmember', memberController.getMember);
router.put('/updatememberproductids/:id', memberController.updateMemberProductIds);
router.get('/get-all-alter-member', memberController.getAllAlterMember);
router.delete("/delete-member/:id", memberController.deleteMember)
module.exports = router;