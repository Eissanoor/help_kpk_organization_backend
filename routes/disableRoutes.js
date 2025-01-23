const express = require('express');
const router = express.Router();
const disableController = require('../controllers/disableController.js');
const { upload } = require("../config/multerConfig.js");
const apicache = require('apicache');
const cache = apicache.middleware;
router.post("/add-new-disable", upload.fields([
    { name: 'signatureApplicant', maxCount: 1 },
    { name: 'cnicFrontPic', maxCount: 1 },
    { name: 'cnicBackPic', maxCount: 1 },
]), disableController.addnewdisable)
router.get("/get-all-disable",  disableController.getAlldisable)
router.get("/get-all-alter-disable",  disableController.getAllAlterDisable)
router.post("/search", disableController.search)
router.put("/updateproductids/:id", disableController.updateProductIds)
router.delete("/delete-disable/:id", disableController.deleteDisable)
router.get("/get-all-alter-form-by-user-id/:userId", disableController.getAllAlterFormByUserId)
router.put("/done-product", upload.fields([
    { name: 'isProof', maxCount: 1 }
]), disableController.DoneProduct)
module.exports = router;