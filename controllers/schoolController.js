var dotenv = require("dotenv");
const  School  = require('../models/schoolModel');
const sendResponse = require('../utils/responseHandler');

const addnewschool = async (req, res) => {
    const { 
        userId,
        childName,
        fatherName,
        fatherCnic,
        motherName,
        motherCnic,
        dataOfBirth,
        totalAge,
        bloodGroup,
        position,
        childDisable,
        childDisableDesc,
        previewsSchool,
        previewsSchoolDesc,
        schoolAdmittedIn,
        schoolclass,
        DateOfAdmission,
        guardianName,
        guardianCnic,
        relationWithChild,
        relationContact,
        guardianAddress,
        productIds,
       
    } = req.body;
   
    const image = req.files['image'] ? `uploads/${req.files['image'][0].filename}` : null;
    const childThumbPrint = req.files['childThumbPrint'] ? `uploads/${req.files['childThumbPrint'][0].filename}` : null;
    const guardianSignature = req.files['guardianSignature'] ? `uploads/${req.files['guardianSignature'][0].filename}` : null;
    const applicationSignaturePerCnic = req.files['applicationSignaturePerCnic'] ? `uploads/${req.files['applicationSignaturePerCnic'][0].filename}` : null;
    const applicationSignatureCurrent = req.files['applicationSignatureCurrent'] ? `uploads/${req.files['applicationSignatureCurrent'][0].filename}` : null;
    const signatureFSW = req.files['signatureFSW'] ? `uploads/${req.files['signatureFSW'][0].filename}` : null;
    const signatureFS = req.files['signatureFS'] ? `uploads/${req.files['signatureFS'][0].filename}` : null;
    const signaturePD = req.files['signaturePD'] ? `uploads/${req.files['signaturePD'][0].filename}` : null;
    const signatureChairmanHelper = req.files['signatureChairmanHelper'] ? `uploads/${req.files['signatureChairmanHelper'][0].filename}` : null;
    // Collect validation errors one by one
    const validationErrors = [];
    if (!image) validationErrors.push('Image is required');
    if (!childThumbPrint) validationErrors.push('Child thumb print is required');
    if (!guardianSignature) validationErrors.push('Guardian signature is required');
    if (!applicationSignaturePerCnic) validationErrors.push('Application signature per CNIC is required');
    if (!applicationSignatureCurrent) validationErrors.push('Application signature current is required');
    if (!userId) validationErrors.push('userId is required');
    if (!childName) validationErrors.push('Child name is required');
    if (!fatherName) validationErrors.push('Father name is required');
    if (!fatherCnic || !/^\d{5}-\d{7}-\d{1}$/.test(fatherCnic)) validationErrors.push('Father CNIC is required and must be valid');
    if (!motherName) validationErrors.push('Mother name is required');
    if (!motherCnic || !/^\d{5}-\d{7}-\d{1}$/.test(motherCnic)) validationErrors.push('Mother CNIC is required and must be valid');
    if (!dataOfBirth) validationErrors.push('Date of birth is required');
    if (!totalAge) validationErrors.push('Total age is required');
    if (!bloodGroup) validationErrors.push('Blood group is required');
    if (!position || !['orphan', 'poor', 'other'].includes(position)) validationErrors.push('Position is required and must be one of: orphan, poor, other');
    if (!childDisable || !['yes', 'no'].includes(childDisable)) validationErrors.push('Child disable is required and must be one of: yes, no');
    if (childDisable === 'yes' && !childDisableDesc) validationErrors.push('Child disable description is required when childDisable is yes');
    if (!previewsSchool || !['yes', 'no'].includes(previewsSchool)) validationErrors.push('Previews school is required and must be one of: yes, no');
    if (previewsSchool === 'yes' && !previewsSchoolDesc) validationErrors.push('Previews school description is required when previewsSchool is yes');
    if (!schoolAdmittedIn) validationErrors.push('School admitted in is required');
    if (!schoolclass) validationErrors.push('School class is required');
    if (!DateOfAdmission) validationErrors.push('Date of admission is required');
    if (!guardianName) validationErrors.push('Guardian name is required');
    if (!guardianCnic || !/^\d{5}-\d{7}-\d{1}$/.test(guardianCnic)) validationErrors.push('Guardian CNIC is required and must be valid');
    if (!relationWithChild) validationErrors.push('Relation with child is required');
    if (!relationContact) validationErrors.push('Relation contact is required');
    if (!guardianAddress) validationErrors.push('Guardian address is required');
  
   

    // If there are validation errors, return the first one
    if (validationErrors.length > 0) {
        return sendResponse(res, 400, false, validationErrors[0]);
    }

    try {
        const newSchool = new School({ 
            userId,
            image,
            childName,
            fatherName,
            fatherCnic,
            motherName,
            motherCnic,
            dataOfBirth,
            totalAge,
            bloodGroup,
            position,
            childDisable,
            childDisableDesc,
            previewsSchool,
            previewsSchoolDesc,
            schoolAdmittedIn,
            schoolclass,
            DateOfAdmission,
            guardianName,
            guardianCnic,
            relationWithChild,
            relationContact,
            guardianAddress,
            productIds,
            childThumbPrint,
            guardianSignature,
            applicationSignaturePerCnic,
            applicationSignatureCurrent,
            signatureFSW,
            signatureFS,
            signaturePD,
            signatureChairmanHelper
        });
        await newSchool.save();

        sendResponse(res, 201, true, 'School created successfully');
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const getAllSchool = async (req, res) => {
    try {
        const schools = await School.find().populate('userId', 'username location');
        sendResponse(res, 200, true, 'All school form', schools);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

module.exports = {
    addnewschool,
    getAllSchool
};