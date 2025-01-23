const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
},
productIds: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Product",
}],
 image: { type: String },
 childName: { type: String, required: true },
 fatherName: { type: String, required: true },
 fatherCnic: {
  type: String,
  required: true,
  match: [/^\d{5}-\d{7}-\d{1}$/, 'Please fill a valid CNIC number']
 },
 motherName: { type: String, required: true },
 motherCnic: {
    type: String,
    required: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'Please fill a valid CNIC number']
   },
 dataOfBirth: { type: String, required: true },
 totalAge: { type: String, required: true },
 bloodGroup: { type: String, required: true },
 position: {
  type: String,
  required: true,
  enum: ['orphan', 'poor', 'other']
 },
 childDisable: {
    type: String,
    required: true,
    enum: ['yes', 'no']
   },
 childDisableDesc: { type: String },
 previewsSchool: {
    type: String,
    required: true,
    enum: ['yes', 'no']
   },
 previewsSchoolDesc: { type: String },
 schoolAdmittedIn: { type: String, required: true },
 schoolclass: { type: String, required: true },
 DateOfAdmission: { type: String, required: true },
 guardianName: { type: String, required: true },
 guardianCnic: {
    type: String,
    required: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'Please fill a valid CNIC number']
   },
 relationWithChild: { type: String, required: true },
 relationContact: { type: String, required: true },
 guardianAddress: { type: String, required: true },

 
guardianSignature:{
  type: String,
  required: true

},
cnicFrontPic:{
  type: String,
  required: true
},
cnicBackPic:{
  type: String,
  required: true
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
}, {
    timestamps: true
});



module.exports =  mongoose.model("School", schoolSchema)
    