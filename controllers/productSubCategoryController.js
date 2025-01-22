const productSubCategoryModel = require('../models/ProductSubCategory');
const productCategory = require('../models/ProductCategory');
const cloudinary = require("../config/cloudinary");
const fs = require("fs");


const createProductSubCategory = async (req, res) => {
    try {
        const { name, category, products} = req.body;

        // Check if a subcategory with the same name already exists
        const existingSubCategory = await productSubCategoryModel.findOne({ name });
        if (existingSubCategory) {
            return res.status(400).json({
                message: `Subcategory with name ${name} already exists`,
            });
        }

        let subCategoryImage = null;

        // Handle file upload to Cloudinary
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, 
                    {folder: 'productSubCategories'} 
                );

                subCategoryImage = result.secure_url
                fs.unlinkSync(req.file.path);
            } catch (error) {
                console.error('Cloudinary upload error:', error.message);
                return res.status(500).json({ error: 'Failed to upload picture' });
            }
        }

        const data = {
            name,
            subCategoryImage,
            category,
            products: [],
            createdBy: req.admin.email,
            createdOn: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        };

        // console.log(subCategoryImage)

        // Create and save the new subcategory
        const subCategory = new productSubCategoryModel(data);
        const newSubCategory = await subCategory.save();

        const productsCategory = await productCategory.findById(category).populate('subCategory')
        .populate('products')

        if(productsCategory) {
            // const subCategoryId = data._id
            // productsCategory.subCategory.push(data);
            productsCategory.subCategory.push(newSubCategory._id);
            // console.log(newSubCategory._id)
            await productsCategory.save();

        // Debug: Check category products
    const categoryProducts = productsCategory.products.map(product => product._id);
    // console.log(categoryProducts);
    newSubCategory.products = categoryProducts;
    await newSubCategory.save();
        }
        res.status(200).json({
            message: 'Successfully created a new subcategory',
            subCategory: newSubCategory,
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({
            error: error.message,
            message: 'Server error',
        });
    }
};


const getProductSubCategory = async (req, res) => {
    try {

        const subCategories = await productSubCategoryModel.find()

        if(!subCategories) {
            return res.status(400).json({
                message: 'there are no available sub-categories'
            })
        } else {
            return res.status(200).json({
                message: "all sub_categories",
                data: subCategories
            })
        }
    } catch (error) {
        console.error('server errror:', error.message);
        res.status(500).json({
            error: error.message,
            message: "unable to fetch sub-categories"
        })
    }
}


const getOneSubCategory = async (req, res) => {
    try {

        const subCategoryId = req.params.id;  // get the subCategory id
        const subCategory = await productSubCategoryModel.findById(subCategoryId)   // then check through the database

        if (!subCategory) {
            return res.status(400).json({
                message: `subCategory not available`
            })
        } else {
            res.status(200).json({
                message: `subcategory ${subCategory.name} found`,
                data: subCategory
            })
        }
    } catch (error) {
        console.error('server error:' , error.message)
        res.status(500).json({
            message: `unable to fetch ${subCategory}`
        })
    }
}


const updateSubCategory = async (req, res) => {
    try {

        const subCategoryId = req.params.id;  // get the id of the category to update
        const { name } = req.body;  
        const subCategory = await productSubCategoryModel.findById(subCategoryId)  
        
        // check if the subcategory exists
        if (!subCategory ) {  
            return res.status(404).json({
                message: `selected category not available`
            })
        }
        
        // check if theres a subcategory with chosen name already
        const checkSubCategory = await productSubCategoryModel.findOne({ name }); 
        if (checkSubCategory) {
            return res.status(400).json({
                message: `category with ${name} already exists`
            })
        }

        const updateData = {
            name: subCategory.name,
            subCategoryImage: subCategory.subCategoryImage 
        }

        let newImage = null

        if (req.file) {

            try {
                // check if theres an existing image
                if (updateData.subCategoryImage) {

                // if an image was provided, delete the previous image, by extracting the publicId
                const public_id = updateData.subCategoryImage.split('/').slice(7).join('/').split('.')[0];

                const deleteImage = await cloudinary.uploader.destroy(public_id);  // then delete the image
                // console.log(public_id)  // log the public id
                // console.log(deleteImage) // log to know if the image available on the server was deleted
                } 

                // upload the new image
                const result = await cloudinary.uploader.upload(req.file.path, 
                    { folder: "productSubCategories"}
                )
                newImage = result.secure_url
                fs.unlinkSync(req.file.path)  // remove the image from the local storage
               
            } catch (error) {
                console.error("cloudinary upload error: ", error.message)
               return res.status(400).json({message: "unable to upload updated photo"
                })
            }
        }
        
        const Data = {
            name: name || updateData.name,
            subCategoryImage: newImage || updateData.subCategoryImage,
            updatedBy: req.admin.email,
            updatedOn: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
        }

        // console.log(Data.subCategoryImage)

        const updatedSubCategory = await productSubCategoryModel.findByIdAndUpdate(
            subCategoryId, 
            Data, 
            {new: true})

            res.status(200).json({
            message: 'successfully updated product category',
            data: updatedSubCategory
        })
    } catch(error) {
        console.error("error updating category :", error.message)
        res.status(500).json({
            message: "internal error"
        })
    }
}

const deleteSubCategory = async (req, res) => {
    try {

        const subCategoryId = req.params.id;  // get the id to delete

        const subCategory = await productSubCategoryModel.findById(subCategoryId) // check if it's available

        if(!subCategory) {
            return res.status(404).json({
                message: "trying to delete an invalid category"
            })
        } 

        // check if theres an image for the subcategory 
        if (subCategory.subCategoryImage) {
            try {
                // extract the public id, so the image will be deleted from cloudinary
                const public_id = subCategory.subCategoryImage.split('/').slice(7).join('/').split('.')[0];

                const deleteImage = await cloudinary.uploader.destroy(public_id);  // then delete the image
                // console.log(public_id)  // log the public id
                // console.log(deleteImage) // log to know if the image available on the server was deleted
                
            } catch (error) {
                console.error("error deleting image :", error.message)
                res.status(400).json({
                    message: "image was not deleted, try again"
                })
            }
        }

        await productSubCategoryModel.findByIdAndDelete(subCategoryId); // delete the sub category
        return res.status(200).json({
            message: `successfully deleted sub category ${subCategory.name}`
        })
    } catch (error) {
        console.error("error deleting category :", error.message)
        res.status(500).json({
            message: "internal error"
        })
    }
}


module.exports = { 
    createProductSubCategory, 
    getProductSubCategory, 
    getOneSubCategory,
    updateSubCategory,
    deleteSubCategory
}