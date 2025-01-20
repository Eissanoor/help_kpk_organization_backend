const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const apicache = require('apicache');
const cache = apicache.middleware;
router.get("/get-all-location",  locationController.getAllLocations)
router.get("/get-by-id/:id", locationController.getLocationById)
router.post("/add-new-location", locationController.addnewloaction)
router.put("/update-location/:id", locationController.updateLocation)
router.delete("/delete-location/:id", locationController.deleteLocation)

module.exports = router;