const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const locationSchema = new Schema({
 locationName:String,
},{
    timestamps:true
});




module.exports = mongoose.model("Location", locationSchema);
