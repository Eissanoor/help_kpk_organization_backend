var dotenv = require("dotenv");
const Disable = require('../models/disableModel');
const Member = require('../models/memberModel');
const School = require('../models/schoolModel');
const sendResponse = require('../utils/responseHandler');
const apicache = require('apicache');

const addnewdisable = async (req, res) => {
   
    const { 
        submittionDate, registrationNo, childName, fatherName, status, spouse, 
        cnicNo, dateOfBirth, qulafication, typeOfDisability, nameOfDisability, 
        causeOfDisability, TypeOfJob, sourceOfIncome, appliedFor, phoneNo, 
        presentAddress, permanentAddress, applicantIsDeclearYesNo, 
        disabilityImpairment, fitToWork, typeOfAdvise, referTo, 
        recomendationOfBoard, recomendationOfBoard_1, recomendationOfBoard_2, userId,
        productIds
    } = req.body;

    // Correctly handle multiple file uploads
    const signatureApplicant = req.files['signatureApplicant'] ? `uploads/${req.files['signatureApplicant'][0].filename}` : null;
    const cnicFrontPic = req.files['cnicFrontPic'] ? `uploads/${req.files['cnicFrontPic'][0].filename}` : null;
    const cnicBackPic = req.files['cnicBackPic'] ? `uploads/${req.files['cnicBackPic'][0].filename}` : null;
   
    const validationErrors = [];
    // New validation checks for all required fields
    if (!submittionDate) validationErrors.push('submittionDate is required');
    if (!registrationNo) validationErrors.push('registrationNo is required');
    if (!childName) validationErrors.push('childName is required');
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
        submittionDate, registrationNo, childName, fatherName, status, spouse, 
        cnicNo, dateOfBirth, qulafication, typeOfDisability, nameOfDisability, 
        causeOfDisability, TypeOfJob, sourceOfIncome, appliedFor, phoneNo, 
        presentAddress, permanentAddress, applicantIsDeclearYesNo, 
        disabilityImpairment, fitToWork, typeOfAdvise, referTo, 
        recomendationOfBoard, recomendationOfBoard_1, recomendationOfBoard_2, 
        signatureApplicant, cnicFrontPic, cnicBackPic, 
        productIds
      });
      apicache.clear("/disable/get-all-disable");
      await newProduct.save();
      sendResponse(res, 201, true, "Disable added successfully", newProduct);
    } catch (error) {
      sendResponse(res, 500, false, "Internal server error", {
        error: error.message,
      });
    }
  };
const getAlldisable = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Add pagination parameters
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    try {
        const disables = await Disable.find({ Alter: false })
            .populate('userId', 'username location')
            .skip(skip) // Skip the calculated number of documents
            .limit(parseInt(limit)); // Limit the number of documents returned

        const totalRecords = await Disable.countDocuments({ Alter: false }); // Get total count for pagination
        const totalPages = Math.ceil(totalRecords / limit); // Calculate total pages

        sendResponse(res, 200, true, 'All disable form', {
            disables,
            totalRecords, // Include total number of records
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const search = async (req, res) => {
    const { cnicNo } = req.body;

    if (!cnicNo || !/^\d{5}-\d{7}-\d{1}$/.test(cnicNo)) {
        return sendResponse(res, 400, false, 'CNIC is required and must be valid XXXXX-XXXXXXX-X');
    }

    try {
        const disableRecords = await Disable.find({ cnicNo }).populate('productIds' , 'productName').select('childName fatherName');
        const schoolRecords = await School.find({ $or: [{ fatherCnic: cnicNo }, { motherCnic: cnicNo }] }).populate('productIds' , 'productName').select('childName fatherName');
        const memberRecords = await Member.find({ cnicNo }).populate('productIds' , 'productName').select('childName fatherName');
        
        // New check for empty records
        if (disableRecords.length === 0 && schoolRecords.length === 0) {
            return sendResponse(res, 200, true, 'Still waiting for alert', []);
        }

        sendResponse(res, 200, true, 'Search results', {
            records: [...disableRecords, ...schoolRecords, ...memberRecords]
        });
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const updateProductIds = async (req, res) => {
    const { id } = req.params;
    const { productIds } = req.body;

    if (!id) {
        return sendResponse(res, 400, false, 'ID is required');
    }

    try {
        const updatedDisable = await Disable.findByIdAndUpdate(
            { _id: id },
            { $set: { Alter: true, productIds } },
            { new: true } // Return the updated document
        );

        if (!updatedDisable) {
            return sendResponse(res, 404, false, 'Disable record not found');
        }
        apicache.clear("/disable/get-all-disable");
        sendResponse(res, 200, true, 'Product IDs updated successfully', updatedDisable);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const getAllAlterDisable = async (req, res) => {
    try {
        const alters = await Disable.find({ Alter: true }).populate('userId', 'username location');
        sendResponse(res, 200, true, 'All alter disable forms', alters);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const deleteDisable = async (req, res) => {
    const { id } = req.params;
    try {
        await Disable.findByIdAndDelete(id);
        apicache.clear("/disable/get-all-disable");
        return sendResponse(res, 200, true,  'Disable deleted successfully');
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

const getAllAlterFormByUserId = async (req, res) => {
    const { userId } = req.params;
    const disables = await Disable.find({ userId, Alter: true, isDone: false }).populate('productIds' , 'productName');
    const members = await Member.find({ userId, Alter: true, isDone: false }).populate('productIds' , 'productName');
    const schools = await School.find({ userId, Alter: true, isDone: false }).populate('productIds' , 'productName');
    const allForms = [...disables, ...members, ...schools];
    return sendResponse(res, 200, true, 'All disables by user ID with Alter true and isDone false', allForms);
};

const DoneProduct = async (req, res) => {
    const { id, userId } = req.query;
    if (!req.files['isProof']) {
        return sendResponse(res, 400, false, 'Proof Image is required');
    }
    const isProof = `uploads/${req.files['isProof'][0].filename}`;
    const disable = await Disable.findOne({ _id: id, userId });
    const member = await Member.findOne({ _id: id, userId });
    const school = await School.findOne({ _id: id, userId });

    if (disable) {
        disable.isProof = isProof;
        await disable.save();
    } else if (member) {
        member.isProof = isProof;
        await member.save();
    } else if (school) {
        school.isProof = isProof;
        await school.save();
    }


    if (!id || !userId) {
        return sendResponse(res, 400, false, 'ID and User ID are required');
    }

    try {
        const disable = await Disable.findOne({ _id: id, userId });
        const member = await Member.findOne({ _id: id, userId });
        const school = await School.findOne({ _id: id, userId });

        if (!disable && !member && !school) {
            return sendResponse(res, 404, false, 'No record found');
        }

        if (disable) {
            await Disable.findByIdAndUpdate(id, { $set: { isDone: true } });
        } else if (member) {
            await Member.findByIdAndUpdate(id, { $set: { isDone: true } });
        } else if (school) {
            await School.findByIdAndUpdate(id, { $set: { isDone: true } });
        }

        sendResponse(res, 200, true, 'Product marked as done');
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

   



module.exports = {
    addnewdisable,
    getAlldisable,
    search,
    updateProductIds,
    getAllAlterDisable,
    deleteDisable,
    getAllAlterFormByUserId,
    DoneProduct
};