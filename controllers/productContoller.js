var dotenv = require("dotenv");
const Product = require('../models/productModel');
const sendResponse = require('../utils/responseHandler');
const apicache = require('apicache');

dotenv.config({ path: "./config.env" });


const addProduct = async (req, res) => {
    const { productName, productDescription } = req.body;
   

    const image = req.file ? `uploads/${req.file.filename}` : null;
   

    if (!productName) {
        return sendResponse(res, 400, false, 'Product name is required');
    }

    if (!productDescription) {
        return sendResponse(res, 400, false, 'Product description is required');
    }


    try {
        const newProduct = new Product({
            productName,
            productDescription,
            image
        });

        await newProduct.save();
        apicache.clear("/product/getallproduct");
        sendResponse(res, 201, true, 'Product added successfully', newProduct);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const productGetById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return sendResponse(res, 404, false, 'Product not found');
        }
        sendResponse(res, 200, true, 'Product retrieved successfully', product);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find();
        sendResponse(res, 200, true, 'Products retrieved successfully', products);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription } = req.body;
    const newImage = req.file ? `uploads/${req.file.filename}` : null;

    try {
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return sendResponse(res, 404, false, 'Product not found');
        }

        // If a new image is uploaded, delete the old one
        if (newImage) {
            const oldImage = existingProduct.image;
            if (oldImage) {
                const fs = require('fs');
                fs.unlink(oldImage, (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    }
                });
            }
        }

        // Update the product with the new data, keeping the old image if no new image is provided
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            productName,
            productDescription,
            image: newImage || existingProduct.image // Use existing image if newImage is null
        }, { new: true });
        apicache.clear("/product/getallproduct");
        sendResponse(res, 200, true, 'Product updated successfully', updatedProduct);
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return sendResponse(res, 404, false, 'Product not found');
        }

        // Delete the associated image file if it exists
        const oldImage = deletedProduct.image;
        if (oldImage) {
            const fs = require('fs');
            fs.unlink(oldImage, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                }
            });
        }

        apicache.clear("/product/getallproduct");
        sendResponse(res, 200, true, 'Product deleted successfully');
    } catch (error) {
        sendResponse(res, 500, false, 'Internal server error', { error: error.message });
    }
};

module.exports = {
    addProduct,
    productGetById,
    getAllProduct,
    updateProduct,
    deleteProduct
};