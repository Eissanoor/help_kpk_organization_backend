const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { upload } = require("../config/multerConfig.js");

router.post('/addnewschool', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'guardianSignature', maxCount: 1 },
    { name: 'cnicFrontPic', maxCount: 1 },
    { name: 'cnicBackPic', maxCount: 1 }
]), schoolController.addnewschool)
router.get("/getallschool",schoolController.getAllSchool )
router.put("/updateschoolproductids/:id", schoolController.updateProductIds)
module.exports = router;