const express = require('express');
const router = express.Router();
const disableController = require('../controllers/disableController.js');
const { upload } = require("../config/multerConfig.js");

router.post("/add-new-disable", upload.fields([
    { name: 'signatureApplicant', maxCount: 1 },
    { name: 'cnicFrontPic', maxCount: 1 },
    { name: 'cnicBackPic', maxCount: 1 },
]), disableController.addnewdisable)
router.get("/get-all-disable", disableController.getAlldisable)
router.post("/search", disableController.search)
router.put("/updateproductids/:id", disableController.updateProductIds)

module.exports = router;