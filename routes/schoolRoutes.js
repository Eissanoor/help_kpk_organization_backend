const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { upload } = require("../config/multerConfig.js");

router.post('/addnewschool', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'childThumbPrint', maxCount: 1 },
    { name: 'guardianSignature', maxCount: 1 },
    { name: 'applicationSignaturePerCnic', maxCount: 1 },
    { name: 'applicationSignatureCurrent', maxCount: 1 },
    { name: 'signatureFSW', maxCount: 1 },
    { name: 'signatureFS', maxCount: 1 },
    { name: 'signaturePD', maxCount: 1 },
    { name: 'signatureChairmanHelper', maxCount: 1 }
]), schoolController.addnewschool)
router.get("/getallschool",schoolController.getAllSchool )
module.exports = router;