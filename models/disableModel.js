const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getNextSerialNo = require('../utils/serialNo');
const disableSchema = new Schema({
  serialNo: { type: Number, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    productIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
 submittionDate:String,
 registrationNo:String,
 childName:String,
 fatherName:String,
 status:{
    type: String,
    required: true,
    enum: ['married', 'unmarried']
 },
 spouse:String,
 cnicNo:{
    type: String,
    required: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'Please fill a valid CNIC number']
   },
 dateOfBirth:String,
 qulafication:String,
 typeOfDisability:String,
 nameOfDisability:String,
 causeOfDisability:String,
 TypeOfJob:String,
 sourceOfIncome:String,
 appliedFor:String,
 phoneNo:String,
 presentAddress:String,
 permanentAddress:String,
 
 
 applicantIsDeclearYesNo:{
    type: String,
    required: true
 },
 disabilityImpairment:{
    type: String,
    required: true
 },
 fitToWork:{
    type: String,
    required: true
 },
 typeOfAdvise:{
    type: String,
    required: true
 },
 referTo:{
    type: String,
    
 },
 recomendationOfBoard:{
    type: String,
 },
 recomendationOfBoard_1:{
    type: String,
 },
 recomendationOfBoard_2:{
    type: String,
 },
 signatureApplicant:{
    type: String,
    required: true
 },
 cnicFrontPic:{
    type: String,

 },
 cnicBackPic:{
    type: String,
 },
 
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

},{
    timestamps:true
});

disableSchema.pre('save', async function (next) {
    if (!this.serialNo) {
        this.serialNo = await getNextSerialNo('disable');
    }
    next();
});


module.exports = mongoose.model("Disable", disableSchema);
