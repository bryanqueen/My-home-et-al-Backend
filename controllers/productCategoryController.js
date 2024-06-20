const ProductCategory = require('../models/ProductCategory');
const cloudinary = require('cloudinary').v2

const productCategoryController = {
    createProductCategory: async (req, res) => {
        try {
            const {name} = req.body;

            //Check if a category already exist with the same name
            const existingProductCategory = await ProductCategory.findOne({ name });

            if(existingProductCategory){
                return res.status(400).json({error: 'A product category with this name already exixts'})
            }
            //Upload Category Image to Cloudinary
            const uploadPromise = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: 'product_catgeory_images'
                });
            });

            const imageResult = await Promise.all(uploadPromise);
            const imageUrl = imageResult.map(result => result.secure_url)
            
            //If the category doesn't already exist, create a new one
            const newProductCategory = new ProductCategory({ 
                name,
                product_category_image: imageUrl
             });
            await newProductCategory.save();

            res.json({message: 'Product category successfully created'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    
    editProductCategory: async (req, res) => {
        try {
            const productCategoryId = req.params.id;
            const {name} = req.body;

            const existingProductCategory = await ProductCategory.findOne({name});

            if(existingProductCategory && existingProductCategory._id.toString() !== productCategoryId){
                return res.status(400).json({error: 'A product category with this name already exists.'})
            }

            //Upload Category Image to Cloudinary
            const uploadPromise = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: 'product_category_images'
                });
            });

            const imageResult = await promises.all(uploadPromise);
            const imageUrl = imageResult.map(result => result.secure_url)

            const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
                productCategoryId,
                { 
                    name,
                    product_category_image: imageUrl
                },
                {new: true}
            );
            if (!updatedProductCategory) {
                return res.status(404).json({error: 'Product Category not found'})
            }
            res.json({message: 'Product category updated'})
        } catch (error) {
            res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    deleteProductCategory: async (req, res) => {
        try {
            const productCategoryId = req.params.id;

            const deletedProductCategory = await ProductCategory.findByIdAndDelete(productCategoryId);

            if(!deletedProductCategory){
                return res.status(404).json({error: 'Product Category not found'})
            }
            res.json({message: 'Product Category deleted'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
}
module.exports = productCategoryController;