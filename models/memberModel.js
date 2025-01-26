const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},
productIds: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
}],
 childName: String,
 cnicNo: String,
 relation: {
    type: String,
    required: true,
    enum: ['father', 'husband', 'other']
   },
   guardianName: String,
   relationCnic: String,
   dateOfBirth: String,
   gender: {type: String, enum: ['male', 'female']},
   maritalStatus: {type: String, enum: ['single', 'married', 'divorced', 'widow']},
   nationality: String,
   tehsil: String,
   district: String,
   religion: {type: String, enum: ['muslim', 'non-muslim']},
   bloodGroup: {type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']},
   qualification: String,
   profession: String,
   currentAddress: String,
   permanentAddress: String,
   contactNumber: String,
   contactNumber2: String,
   TypeOfAccommodation: {type: String, enum: ['rented', 'owned', 'living with other']},
   noOfDependents: Number,
   noOfChildren: Number,
   noOfChildrenMale: Number,
   noOfChildrenFemale: Number,
   noOfChildrenInSchool: Number,
   nameOfSchoolChildren: [{
        name: String,
        class: String,
        age: String,
        SchoolName: String
    }],
    disability: {type: String, enum: ['yes', 'no']},
   disabilityDescription: String,
   addictiveDrugs: {type: String, enum: ['yes', 'no']},
   addictiveDrugsDescription: String,
   anyDisability: {type: String, enum: ['yes', 'no']},
   anyDisabilityDescription: String,
   politicalAffiliation: {type: String, enum: ['yes', 'no']},
   politicalAffiliationDescription: String,
   NGO: {type: String, enum: ['yes', 'no']},
   NGODescription: String,
   cnicFrontPic: String,
   cnicBackPic: String,
   Alter: {
    type: Boolean,
    default: false
},
isDone: {
    type: Boolean,
    default: false
},
isProof: {
    type: String,
    default: false
},
}, {
    timestamps: true
});



module.exports =  mongoose.model("Member", memberSchema)
    