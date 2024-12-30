const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const disableSchema = new Schema({
 submittionDate:String,
 registrationNo:String,
 name:String,
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
 
 signatureApplicant:{
    type: String,
    required: true
 },
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
 signatureChainMan:{
    type: String,

 },
 signatureDistricOfficer:{
    type: String,
 },
 signatureManager:{
    type: String,
 },
 signatureSpecialist:{
    type: String
 }

  

},{
    timestamps:true
});




module.exports = mongoose.model("Disable", disableSchema);
