const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');

const productController = {
    createSingleProduct: async (req, res) => {
        try {
            const {
                productTitle,
                price,
                category,
                description,
                image,
                inventory
            } = req.body;

            const product = new Product({
                productTitle,
                price,
                category,
                description,
                image,
                inventory
            });

            await product.save();
            res.json({message: 'Product Created Successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    bulkCreateProduct: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    viewProductsByCategory: async (req, res) => {
        try {
            const categoryId = req.params.id;
            const category = await ProductCategory.findById(categoryId);

            if (!category) {
                return res.status(404).json({error: 'Category not found'})
            }
            const products = await Product.find({category: categoryId});

            if (products.length === 0) {
                return res.status(404).json({error: 'No products found'})
            }
            res.json(products);
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getSingleProductDetails: async (req, res) => {
        try {
            const productId = req.params.id;

            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({message: 'Product not found'})
            }
            res.json(product)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    searchForProduct: async (req, res) => {
        //These function will be used for searching products
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    fetchNewProducts: async (req, res) => {
        //These are products added to the database within the timeframe of 48hrs, after 48hrs, the product can no longer be tagged a new product
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    // addProductReview: async (req, res) => {
    //     try {
            
    //     } catch (error) {
    //         return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
    //     }
    // },
    editProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {
                    productTitle,
                    price,
                    category,
                    description,
                    image,
                    inventory
                },
                {new: true}
            );
            if (!updatedProduct) {
                return res.status(404).json({error: 'Product not found'})
            }
            res.json({message: 'Product updated successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            const deletedProduct = await Product.findByIdAndDelete(productId);

            if (!deletedProduct) {
                return res.status(404).json({error: 'Product not found'});
            };
            res.json({message: 'Deletion completed'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
}
module.exports = productController;