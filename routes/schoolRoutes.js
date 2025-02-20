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
router.get("/getallschool", cache("2 minutes"), schoolController.getAllSchool )
router.put("/updateschoolproductids/:id", schoolController.updateProductIds)
router.get("/get-all-alter-school", cache("2 minutes"), schoolController.getAllAlterSchool)
router.delete("/delete-school/:id", schoolController.deleteSchool)
module.exports = router;