const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const productSchema = new Schema({
 image: String,
 productName:String,
 productDescription:String,
  

},{
    timestamps:true
});




module.exports = mongoose.model("Product", productSchema);
