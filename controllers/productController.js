const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Inventory = require('../models/Inventory');

const productController = {
    createSingleProduct: async (req, res) => {
        try {
            const {
                productTitle,
                price,
                category,
                description,
                images,
                inventory
            } = req.body;

            //Create a new inventory document
            const newInventory = new Inventory({
                productName: productTitle,
                quantity: inventory
            });

            //Save the inventory document
            await newInventory.save()

            const product = new Product({
                productTitle,
                price,
                category,
                description,
                images,
                inventory: newInventory._id
            });

            await product.save();

            //Check if product category exists in the database
            const productCategory = await ProductCategory.findById(category).populate('products');

            if (productCategory) {
                // Add the newly created product to the products array of the existing category
                productCategory.products.push(product);
                await productCategory.save();
            }

            res.json({message: 'Product Created Successfully'});
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    bulkCreateProduct: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    bulkPublishProduct: async(req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    viewProductsByCategory: async (req, res) => {
        try {
            //get the category id
            const categoryId = req.params.id;

            //Retrieve ProductCategory by ID
            const productCategory = await ProductCategory.findById(categoryId);

            //Check if the ProductCategory exists
            if(!productCategory){
                return res.status(404).json({error: 'Product Category not found'})
            }

            //Access the product IDs from the product category product field.
            const productIds = productCategory.products

            //Fetch the Products using the productIds
            const products = await Product.find({_id: {$in: productIds}});

            res.json(products)
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