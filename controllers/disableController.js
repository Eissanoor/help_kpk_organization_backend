var dotenv = require("dotenv");
const Disable = require('../models/disableModel');
const sendResponse = require('../utils/responseHandler');

const addnewdisable = async (req, res) => {
    const { 
        submittionDate, registrationNo, name, fatherName, status, spouse, 
        cnicNo, dateOfBirth, qulafication, typeOfDisability, nameOfDisability, 
        causeOfDisability, TypeOfJob, sourceOfIncome, appliedFor, phoneNo, 
        presentAddress, permanentAddress, applicantIsDeclearYesNo, 
        disabilityImpairment, fitToWork, typeOfAdvise, referTo, 
        recomendationOfBoard, recomendationOfBoard_1, recomendationOfBoard_2, userId,
        productIds
    } = req.body;

    // Correctly handle multiple file uploads
    const signatureApplicant = req.files['signatureApplicant'] ? `uploads/${req.files['signatureApplicant'][0].filename}` : null;
    const signatureChainMan = req.files['signatureChainMan'] ? `uploads/${req.files['signatureChainMan'][0].filename}` : null;
    const signatureDistricOfficer = req.files['signatureDistricOfficer'] ? `uploads/${req.files['signatureDistricOfficer'][0].filename}` : null;
    const signatureManager = req.files['signatureManager'] ? `uploads/${req.files['signatureManager'][0].filename}` : null;
    const signatureSpecialist = req.files['signatureSpecialist'] ? `uploads/${req.files['signatureSpecialist'][0].filename}` : null;

    const validationErrors = [];
    // New validation checks for all required fields
    if (!submittionDate) validationErrors.push('submittionDate is required');
    if (!registrationNo) validationErrors.push('registrationNo is required');
    if (!name) validationErrors.push('name is required');
    if (!fatherName) validationErrors.push('fatherName is required');
    if (status === 'married' && !spouse) validationErrors.push('spouse is required when status is married');
    if (!status || !['married', 'unmarried'].includes(status)) validationErrors.push('status is required and must be one of: married, unmarried');
    if (!cnicNo || !/^\d{5}-\d{7}-\d{1}$/.test(cnicNo)) validationErrors.push('CNIC is required and must be valid XXXXX-XXXXXXX-X');
    if (!dateOfBirth) validationErrors.push('dateOfBirth is required');
    if (!qulafication) validationErrors.push('qualification is required');
    if (!typeOfDisability) validationErrors.push('typeOfDisability is required');
    if (!nameOfDisability) validationErrors.push('nameOfDisability is required');
    if (!causeOfDisability) validationErrors.push('causeOfDisability is required');
    if (!TypeOfJob) validationErrors.push('TypeOfJob is required');
    if (!sourceOfIncome) validationErrors.push('sourceOfIncome is required');
    if (!appliedFor) validationErrors.push('appliedFor is required');
    if (!phoneNo) validationErrors.push('phoneNo is required');
    if (!presentAddress) validationErrors.push('presentAddress is required');
    if (!permanentAddress) validationErrors.push('permanentAddress is required');
    if (applicantIsDeclearYesNo === undefined) validationErrors.push('applicantIsDeclearYesNo is required');
    if (!disabilityImpairment) validationErrors.push('disability Impairment is required');
    if (fitToWork === undefined) validationErrors.push('fitToWork is required');
    if (!typeOfAdvise) validationErrors.push('typeOfAdvise is required');
    if (!referTo) validationErrors.push('referTo is required');
    if (!recomendationOfBoard) validationErrors.push('recomendationOfBoard is required');
    if (!userId) validationErrors.push('userId is required');
    
   
    if (!signatureApplicant) validationErrors.push('signature Applicant is required');

    // Check for validation errors
    if (validationErrors.length > 0) {
        return sendResponse(res, 400, false, validationErrors[0]);
    }

    
    
    try {
      const newProduct = new Disable({
        userId,
        submittionDate, registrationNo, name, fatherName, status, spouse, 
        cnicNo, dateOfBirth, qulafication, typeOfDisability, nameOfDisability, 
        causeOfDisability, TypeOfJob, sourceOfIncome, appliedFor, phoneNo, 
        presentAddress, permanentAddress, applicantIsDeclearYesNo, 
        disabilityImpairment, fitToWork, typeOfAdvise, referTo, 
        recomendationOfBoard, recomendationOfBoard_1, recomendationOfBoard_2, 
        signatureApplicant, signatureChainMan, signatureDistricOfficer, 
        signatureManager, signatureSpecialist,
        productIds
      });
  
      await newProduct.save();
      sendResponse(res, 201, true, "Disable added successfully", newProduct);
    } catch (error) {
      sendResponse(res, 500, false, "Internal server error", {
        error: error.message,
      });
    }
  };
  const getAlldisable = async (req, res) => {
    try {
        const disables = await Disable.find().populate('userId', 'username location');
        sendResponse(res, 200, true, 'All disable form', disables);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};
module.exports = {
    addnewdisable,
    getAlldisable
    
};