const ProductCategory = require('../models/ProductCategory');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

const productCategoryController = {
    createProductCategory: async (req, res) => {
        try {
            const { name } = req.body;
    
            // Check if a category already exists with the same name
            const existingProductCategory = await ProductCategory.findOne({ name });
            if (existingProductCategory) {
                return res.status(400).json({ error: 'A product category with this name already exists' });
            }
    
            let imageUrl = null;
    
            // Check if a file was uploaded
            if (req.file) {
                try {
                    // Upload the single image to Cloudinary
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: 'product_category_images'
                    });
                    imageUrl = result.secure_url;
                } catch (uploadError) {
                    console.error('Error uploading image to Cloudinary:', uploadError);
                    return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
                }
            }
    
            // If the category doesn't already exist, create a new one
            const newProductCategory = new ProductCategory({ 
                name,
                product_category_image: imageUrl
            });
            await newProductCategory.save();
    
            res.json({ message: 'Product category successfully created' });
        } catch (error) {
            console.error('Error creating category:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    getProductCategories: async (req, res) => {
        try {
            const productCategories = await ProductCategory.find();

            if(!productCategories){
                return res.status(404).json({error: 'No Product Category found'})
            }
            res.json(productCategories)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getTopProductCategories: async (req, res) => {
        try {
            const topCategories = await ProductCategory.aggregate([
                // Unwind the products array to create a document for each product
                { $unwind: "$products" },
                
                // Group by _id (category id) and count the number of products
                { 
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        product_category_image: { $first: "$product_category_image"},
                        productCount: { $sum: 1 }
                    }
                },
                
                // Sort by product count in descending order
                { $sort: { productCount: -1 } },
                
                // Limit to top 10 categories
                { $limit: 10 }
            ]);
    
            res.json(topCategories);
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    
    editProductCategory: async (req, res) => {
        try {
            const productCategoryId = req.params.id; // This is correct for your existing route
            const { name } = req.body;
            
            // First, get the existing category
            const existingCategory = await ProductCategory.findById(productCategoryId);
            if (!existingCategory) {
                return res.status(404).json({ error: 'Product Category not found' });
            }
    
            // Check if the new name conflicts with other categories
            const nameConflict = await ProductCategory.findOne({ name });
            if (nameConflict && nameConflict._id.toString() !== productCategoryId) {
                return res.status(400).json({ error: 'A product category with this name already exists.' });
            }
    
            // Prepare update object starting with existing data
            const updateData = {
                name: name || existingCategory.name,
                product_category_image: existingCategory.product_category_image // Keep existing image by default
            };
    
            // Only update image if a new file was uploaded
            if (req.file) {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path, {
                        folder: 'product_category_images'
                    });
                    updateData.product_category_image = result.secure_url;
                } catch (uploadError) {
                    console.error('Error uploading image to Cloudinary:', uploadError);
                    return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
                }
            }
    
            // Update the category with the prepared data
            const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
                productCategoryId,
                updateData,
                { new: true }
            );
    
            res.json({
                message: 'Product category updated successfully',
                category: updatedProductCategory
            });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ error: 'Oops! An error occurred, please refresh' });
        }
    },
    deleteProductCategory: async (req, res) => {
        try {
            const productCategoryId = req.params.id;

            //Find the ProductCategory to get the products appended to it
            const productCategory = await ProductCategory.findById(productCategoryId);

            //Get the list of products associated with this category
            const productIds = productCategory.products;

            //Loop through the product and delete it alongside it's inventory
            for (const productId of productIds) {
                const product = await Product.findById(productId)

                if(product){

                    //Find Product Inventory and delete
                    await Inventory.findByIdAndDelete(product.inventory);

                    //Then delete the Product itself
                    await Product.findByIdAndDelete(productId)
                }
                
            }

            //Delete the Product Category itself
            await ProductCategory.findByIdAndDelete(productCategoryId)

            res.json({message: 'Product Category and all associated products and inventories deleted'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
}
module.exports = productCategoryController;