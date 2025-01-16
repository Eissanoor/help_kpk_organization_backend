const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { upload } = require("../config/multerConfig.js");
const apicache = require('apicache');
const cache = apicache.middleware;
router.post('/addnewschool', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'guardianSignature', maxCount: 1 },
    { name: 'cnicFrontPic', maxCount: 1 },
    { name: 'cnicBackPic', maxCount: 1 }
]), schoolController.addnewschool)
router.get("/getallschool", cache('60 minutes'), schoolController.getAllSchool )
router.put("/updateschoolproductids/:id", schoolController.updateProductIds)
module.exports = router;