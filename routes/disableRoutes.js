const express = require('express');
const router = express.Router();
const disableController = require('../controllers/disableController.js');
const { upload } = require("../config/multerConfig.js");

router.post("/add-new-disable", upload.fields([
    { name: 'signatureApplicant', maxCount: 1 },
    { name: 'signatureChainMan', maxCount: 1 },
    { name: 'signatureDistricOfficer', maxCount: 1 },
    { name: 'signatureManager', maxCount: 1 },
    { name: 'signatureSpecialist', maxCount: 1 }
]), disableController.addnewdisable)
router.get("/get-all-disable", disableController.getAlldisable)


module.exports = router;