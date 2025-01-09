const  Member  = require('../models/memberModel');
const sendResponse = require('../utils/responseHandler');

const addNewMember = async (req, res) => {
    try {
        const {
            userId,
            childName,
            cnicNo,
            relation,
            relationCnic,
            dateOfBirth,
            gender,
            maritalStatus,
            nationality,
            tehsil,
            district,
            religion,
            bloodGroup,
            qualification,
            profession,
            currentAddress,
            permanentAddress,
            contactNumber,
            contactNumber2,
            TypeOfAccommodation,
            noOfDependents,
            noOfChildren,
            noOfChildrenMale,
            noOfChildrenFemale,
            noOfChildrenInSchool,
            nameOfSchoolChildren,
            addictiveDrugs,
            addictiveDrugsDescription,
            anyDisability,
            anyDisabilityDescription,
            politicalAffiliation,
            politicalAffiliationDescription,
            NGO,
            NGODescription,
        } = req.body;

        const validationErrors = [];
        if (!userId) validationErrors.push('userId is required');
        if (!childName) validationErrors.push('Child name is required');
        if (!cnicNo || !/^\d{5}-\d{7}-\d{1}$/.test(cnicNo)) validationErrors.push('CNIC is required and must be valid');
        if (!relation || !['father', 'husband', 'other'].includes(relation)) validationErrors.push('Relation is required and must be one of: father, husband, other');
        if (!relationCnic || !/^\d{5}-\d{7}-\d{1}$/.test(relationCnic)) validationErrors.push('Relation CNIC is required and must be valid');
        if (!dateOfBirth) validationErrors.push('Date of birth is required');
        if (!gender || !['male', 'female'].includes(gender)) validationErrors.push('Gender is required and must be one of: male, female');
        if (!maritalStatus || !['single', 'married', 'divorced', 'widowed'].includes(maritalStatus)) validationErrors.push('Marital status is required and must be one of: single, married, divorced, widowed');
        if (!nationality) validationErrors.push('Nationality is required');
        if (!tehsil) validationErrors.push('Tehsil is required');
        if (!district) validationErrors.push('District is required');
        if (!religion || !['muslim', 'non-muslim'].includes(religion)) validationErrors.push('Religion is required and must be one of: muslim, non-muslim');
        if (!bloodGroup || !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(bloodGroup)) validationErrors.push('Blood group is required and must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-');
        if (!qualification) validationErrors.push('Qualification is required');
        if (!profession) validationErrors.push('Profession is required');
        if (!currentAddress) validationErrors.push('Current address is required');
        if (!permanentAddress) validationErrors.push('Permanent address is required');
        if (!contactNumber) validationErrors.push('Contact number is required');
        if (!contactNumber2) validationErrors.push('Contact number 2 is required');
        if (!TypeOfAccommodation || !['rented', 'owned', 'living with other'].includes(TypeOfAccommodation)) validationErrors.push('Type of accommodation is required and must be one of: rented, owned, living with other');
        if (!noOfDependents || isNaN(noOfDependents)) validationErrors.push('No of dependents is required and must be a number');
        if (!noOfChildren || isNaN(noOfChildren)) validationErrors.push('No of children is required and must be a number');
        if (!noOfChildrenMale || isNaN(noOfChildrenMale)) validationErrors.push('No of children male is required and must be a number');
        if (!noOfChildrenFemale || isNaN(noOfChildrenFemale)) validationErrors.push('No of children female is required and must be a number');
        if (!noOfChildrenInSchool || isNaN(noOfChildrenInSchool)) validationErrors.push('No of children in school is required and must be a number');
        if (!nameOfSchoolChildren) validationErrors.push('Name of school children is required');
        if (!addictiveDrugs || !['yes', 'no'].includes(addictiveDrugs)) validationErrors.push('Addictive drugs is required and must be one of: yes, no');
        if (addictiveDrugs === 'yes' && !addictiveDrugsDescription) validationErrors.push('Addictive drugs description is required when addictiveDrugs is yes');
        if (!anyDisability || !['yes', 'no'].includes(anyDisability)) validationErrors.push('Any disability is required and must be one of: yes, no');
        if (anyDisability === 'yes' && !anyDisabilityDescription) validationErrors.push('Any disability description is required when anyDisability is yes');
        if (!politicalAffiliation || !['yes', 'no'].includes(politicalAffiliation)) validationErrors.push('Political affiliation is required and must be one of: yes, no');
        if (politicalAffiliation === 'yes' && !politicalAffiliationDescription) validationErrors.push('Political affiliation description is required when politicalAffiliation is yes');
        if (!NGO || !['yes', 'no'].includes(NGO)) validationErrors.push('NGO is required and must be one of: yes, no');
        if (NGO === 'yes' && !NGODescription) validationErrors.push('NGO description is required when NGO is yes');
        // If there are validation errors, return the first one
        if (validationErrors.length > 0) {
            return sendResponse(res, 400, false, validationErrors[0]);
        }

        const member = new Member({
            userId,
            childName,
            cnicNo,
            relation,
            relationCnic,
            dateOfBirth,
            gender,
            maritalStatus,
            nationality,
            tehsil,
            district,
            religion,
            bloodGroup,
            qualification,
            profession,
            currentAddress,
            permanentAddress,
            contactNumber,
            contactNumber2,
            TypeOfAccommodation,
            noOfDependents,
            noOfChildren,
            noOfChildrenMale,
            noOfChildrenFemale,
            noOfChildrenInSchool,
            nameOfSchoolChildren,
            addictiveDrugs,
            addictiveDrugsDescription,
            anyDisability,
            anyDisabilityDescription,
            politicalAffiliation,
            politicalAffiliationDescription,
            NGO,
            NGODescription,
        });

        await member.save();
        return sendResponse(res, 200, true, 'Member added successfully', member);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, 'An error occurred while adding the member', error);
    }
}   
const getMember = async (req, res) => { 
    try {
        const {userId} = req.body;  
        const member = await Member.find({userId});
        return sendResponse(res, 200, true, 'Member fetched successfully', member);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, 'An error occurred while fetching the member', error);
    }
}
module.exports = {
    addNewMember,
    getMember
}

