const express = require('express');
const router = express.Router();
const productController = require('../controllers/productContoller.js');
const apicache = require('apicache');
const cache = apicache.middleware;
const { upload } = require("../config/multerConfig.js");
router.post("/addnewproduct",upload.single("image"),productController.addProduct )
router.get("/getallproduct", cache('60 minutes'), productController.getAllProduct)
router.get("/productgetbyid/:id", productController.productGetById)
router.put("/updateproduct/:id",upload.single("image"), productController.updateProduct)
router.delete("/productdelete/:id", productController.deleteProduct)
module.exports = router;