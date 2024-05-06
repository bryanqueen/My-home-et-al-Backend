const ProductCategory = require('../models/ProductCategory');

const productCategoryController = {
    createProductCategory: async (req, res) => {
        try {
            const {name} = req.body;

            const newProductCategory = new ProductCategory({
                name
            });
            await newProductCategory.save();
            res.json({message: 'New product category created successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    editProductCategory: async (req, res) => {
        try {
            const productCategoryId = req.params.id;

            const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
                productCategoryId,
                {name},
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