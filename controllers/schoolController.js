var dotenv = require("dotenv");
const  School  = require('../models/schoolModel');
const sendResponse = require('../utils/responseHandler');
const apicache = require('apicache');
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
    const cnicFrontPic = req.files['cnicFrontPic'] ? `uploads/${req.files['cnicFrontPic'][0].filename}` : null;
    const cnicBackPic = req.files['cnicBackPic'] ? `uploads/${req.files['cnicBackPic'][0].filename}` : null;
    const guardianSignature = req.files['guardianSignature'] ? `uploads/${req.files['guardianSignature'][0].filename}` : null;
    
    // Collect validation errors one by one
    const validationErrors = [];
    if (!image) validationErrors.push('Image is required');
    if (!guardianSignature) validationErrors.push('Guardian signature is required');
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
    if (!cnicFrontPic) validationErrors.push('CNIC front picture is required');
    if (!cnicBackPic) validationErrors.push('CNIC back picture is required');
   

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
            guardianSignature,
            cnicFrontPic,
            cnicBackPic,
        });
        await newSchool.save();
        apicache.clear("/school/getallschool");
        sendResponse(res, 201, true, 'School created successfully');
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const getAllSchool = async (req, res) => {
    try {
        const schools = await School.find({Alter:false}).populate('userId', 'username location');
        sendResponse(res, 200, true, 'All school form', schools);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const updateProductIds = async (req, res) => {
        const { id } = req.params;
        const { productIds } = req.body;

    // Validate input
    if (!id) return sendResponse(res, 400, false, 'id is required');
    if (!productIds) return sendResponse(res, 400, false, 'Product IDs are required');

    try {
        const updatedSchool = await School.findByIdAndUpdate(
            { _id: id },
            { productIds },
            { Alter: true },
            { new: true } // Return the updated document
        );

        if (!updatedSchool) {
            return sendResponse(res, 404, false, 'School not found');
        }
        apicache.clear("/school/getallschool");
        sendResponse(res, 200, true, 'Product IDs updated successfully', updatedSchool);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

module.exports = {
    addnewschool,
    getAllSchool,
    updateProductIds
};