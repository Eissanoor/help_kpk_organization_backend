var dotenv = require("dotenv");
const Location = require("../models/locationModel");
const sendResponse = require("../utils/responseHandler");

const addnewloaction = async (req, res) => {
  const { locationName } = req.body;

  if (!locationName) {
    return sendResponse(res, 400, false, "location name is required");
  }

  try {
    const newProduct = new Location({
      locationName,
    });

    await newProduct.save();
    sendResponse(res, 201, true, "location added successfully", newProduct);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", {
      error: error.message,
    });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    sendResponse(res, 200, true, "Locations retrieved successfully", locations);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", {
      error: error.message,
    });
  }
};

const getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id);
    if (!location) {
      return sendResponse(res, 404, false, "Location not found");
    }
    sendResponse(res, 200, true, "Location retrieved successfully", location);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", {
      error: error.message,
    });
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { locationName } = req.body;

  if (!locationName) {
    return sendResponse(res, 400, false, "Location name is required");
  }

  try {
    const updatedLocation = await Location.findByIdAndUpdate(id, { locationName }, { new: true });
    if (!updatedLocation) {
      return sendResponse(res, 404, false, "Location not found");
    }
    sendResponse(res, 200, true, "Location updated successfully", updatedLocation);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", {
      error: error.message,
    });
  }
};

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedLocation = await Location.findByIdAndDelete(id);
    if (!deletedLocation) {
      return sendResponse(res, 404, false, "Location not found");
    }
    sendResponse(res, 200, true, "Location deleted successfully", deletedLocation);
  } catch (error) {
    sendResponse(res, 500, false, "Internal server error", {
      error: error.message,
    });
  }
};

module.exports = {
  addnewloaction,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};
