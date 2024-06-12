const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Inventory = require('../models/Inventory');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const uploadCsv = multer({dest:'uploads/csv'});
const cloudinary = require('../config/cloudinary')


const productController = {
    createSingleProduct: async (req, res) => {
        try {
            
            const {
                productTitle,
                price,
                category,
                description,
                inventory,
                brand
            } = req.body;

            const imageFiles = req.files;

            const uploadedImageUrls = [];
            
            for (const file of imageFiles) {
                // Upload each file to Cloudinary
                const result = await cloudinary.uploader.upload(file.path);
                uploadedImageUrls.push(result.secure_url);
          
                // Remove the file from the local uploads folder
                fs.unlinkSync(file.path);
              }
          

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
                images: uploadedImageUrls,
                inventory: newInventory._id,
                brand
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
            const products = [];

            uploadCsv.single('csvFile')(req, res, function (err) {
                if (err) {
                    return res.status(500).json({error: 'Error uploading file'})
                }
            

            fs.createReadStream(req.file.path)
               .pipe(csv())
               .on('data', data=> {
                //Create product object from CSV data
                const product = {
                    productTitle: data.productTitle,
                    price: data.price,
                    category: data.category,
                    description: data.description,
                    images: [data.image1, data.image2, data.image3].filter(Boolean),
                    inventory: data.inventory,
                    brand: data.brand
                };
                products.push(product)
               })
               .on('end', () => {
                //Send array of products as JSON response
                res.json(products)
               });

            })
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    bulkPublishProduct: async(req, res) => {
        try {
            //Get the array of product from the request body
            const products = req.body;

            //Create an array to store the IDs of the published products
            const publishedProductsIds = [];

            //Iterate over each product in the array
            for (const productData of products){
                //Find the product category document by name
                const productCategory = await ProductCategory.findOne({name: productData.category.lowerCase()});

            // If the product category exists, replace the category name with its _id
            if (productCategory) {
                productData.category = productCategory._id;
            }

            //Create an inventory document for each products
            const inventory = new Inventory({
                productName: productData.productTitle,
                quantity: productData.inventory
            })

            //Save the invetory document
            await inventory.save();
            
                //Create the product document
                const product = new Product({
                    productTitle: productData.productTitle,
                    price: productData.price,
                    category: productData.category,
                    description: productData.description,
                    images: productData.images,
                    //Set the inventory to 0 initially
                    inventory: inventory._id,
                    brand: productData.brand
                });

                //Save the product to the database
                const savedProduct =  await product.save();

                //Push the ID of the published product to the array
                publishedProductsIds.push(savedProduct._id);

                //If the product category exists, add the product ID to its products array
                if (productCategory){
                    productCategory.products.push(savedProduct._id);
                    await productCategory.save();
                }
            }

            //Send the array of published product IDs as the response
            res.json({ publishedProductsIds })
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
                    images,
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