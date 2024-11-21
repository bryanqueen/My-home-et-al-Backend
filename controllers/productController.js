const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Inventory = require('../models/Inventory');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const uploadCsv = multer({dest:'uploads/csv'});
const cloudinary = require('../config/cloudinary');
const {algoliasearch} = require('algoliasearch');


const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
// const index = client.initIndex('products');


// Helper function to create Algolia record
const indexAlgoliaRecord = async (product) => {
    const populatedProduct = await Product.findById(product._id).populate('category');
    const categoryName = populatedProduct.category?.name || '';
  
    return {
      objectID: populatedProduct._id.toString(),
      productTitle: populatedProduct.productTitle,
      category: {
        name: categoryName
      },
      subCategories: populatedProduct.subCategories || [],
      brand: populatedProduct.brand,
      mainMaterial: populatedProduct.mainMaterial,
      color: populatedProduct.color,
      description: populatedProduct.description || '',
      searchData: `${populatedProduct.productTitle} ${populatedProduct.brand} ${categoryName} ${populatedProduct.subCategories.join(' ')} ${populatedProduct.mainMaterial} ${populatedProduct.color} ${populatedProduct.description || ''}`.toLowerCase()
    };
  };


const productController = {
    createSingleProduct: async (req, res) => {
        try {
            
            const { 
                productTitle, 
                price, 
                category,
                subCategories, 
                description, 
                inventory, 
                brand,
                weight,
                modelNumber,
                mainMaterial,
                color,
                keyFeatures,
                size,
                sku
            } = req.body;

            // Create a new inventory document
            const newInventory = new Inventory({ 
                productName: productTitle, 
                quantity: Number(inventory) 
            });

            // Save the inventory document
            await newInventory.save();

            // Upload images to Cloudinary
            const uploadPromises = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: 'product_images'
                });
            });

            const imageResults = await Promise.all(uploadPromises);
            const imageUrls = imageResults.map(result => result.secure_url);

            // Handle keyFeatures array
             const keyFeaturesArray = Array.isArray(keyFeatures) ? keyFeatures : [keyFeatures];

             //Handle subCategories array
             const subCategoriesArray = Array.isArray(subCategories) ? subCategories : [subCategories];

            const product = new Product({ 
                productTitle, 
                price, 
                category,
                subCategories, 
                description, 
                images: imageUrls, 
                inventory: newInventory._id, 
                brand,
                isProductNew: true,
                weight,
                modelNumber,
                mainMaterial,
                color,
                keyFeatures: keyFeaturesArray,
                size,
                sku
            });

            await product.save();

            const algoliaRecord = await indexAlgoliaRecord(product);

            await client.saveObject({
                indexName: 'products',
                body: algoliaRecord
            })

            // Check if product category exists in the database
            const productCategory = await ProductCategory.findById(category).populate('products');

            if (productCategory) {
                // Add the newly created product to the products array of the existing category
                productCategory.products.push(product);
                await productCategory.save();
            }

             // Set a timer to update isProductNew field after 48 hours
                setTimeout(async () => {
                    await Product.findByIdAndUpdate(product._id, { isProductNew: false });
                }, 1 * 10 * 60 * 1000); // 48 hours in milliseconds
                    res.json({ message: 'Product Created Successfully', product });

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
                    images: [data.image1, data.image2, data.image3, data.image4].filter(Boolean),
                    inventory: data.inventory,
                    brand: data.brand,
                    weight: data.weight,
                    modelNumber: data.modelNumber,
                    mainMaterial: data.mainMaterial,
                    color: data.color,
                    size: data.size,
                    sku: data.sku,
                    keyFeatures: [
                        data.feature1,
                        data.feature2,
                        data.feature3,
                        data.feature4,
                        data.feature5,
                        data.feature6
                    ].filter(Boolean),
                    subCategories: [
                        data.sub1,
                        data.sub2,
                        data.sub3,
                        data.sub4,
                        data.sub5,
                        data.sub6,
                        data.sub7,
                        data.sub8
                    ].filter(Boolean)
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
            const products = req.body;
            const publishedProductsIds = [];
    
            for (const productData of products) {
                let category = null;
                
                if (productData.category) {
                    // console.log('Searching for category:', productData.category);
    
                    category = await ProductCategory.findOne({name: { $regex: new RegExp('^' + productData.category + '$', 'i') }});
                    
                    // console.log('Found category:', category);
    
                    if (!category) {
                        // console.log('Category not found. Creating new category:', productData.category);
                        category = new ProductCategory({
                            name: productData.category,
                            products: []
                        });
                        await category.save();
                        // console.log('New category created:', category);
                    }
                }
    
                const inventory = new Inventory({
                    productName: productData.productTitle,
                    quantity: productData.inventory
                });
    
                await inventory.save();
                
                const product = new Product({
                    productTitle: productData.productTitle,
                    price: productData.price,
                    category: category ? category._id : null,
                    subCategories: productData.subCategories,
                    description: productData.description,
                    images: productData.images,
                    inventory: inventory._id,
                    brand: productData.brand,
                    isProductNew: true,
                    weight: productData.weight,
                    modelNumber: productData.modelNumber,
                    mainMaterial: productData.mainMaterial,
                    color: productData.color,
                    size:  productData.color,
                    sku: productData.sku,
                    keyFeatures: productData.keyFeatures
                });
    
                // console.log('Product to be saved:', product);
    
                const savedProduct = await product.save();
                const algoliaRecord = await indexAlgoliaRecord(savedProduct);
                await client.saveObject({
                    indexName: 'products',
                    body: algoliaRecord
                })
                publishedProductsIds.push(savedProduct._id);
    
                if (category) {
                    category.products.push(savedProduct._id);
                    await category.save();
                }
            }
                 // Set a timer to update isProductNew field after 48 hours
                    setTimeout(async () => {
                        await Product.findByIdAndUpdate(savedProduct._id, { isProductNew: false });
                    }, 1 * 10 * 60 * 1000); // 48 hours in milliseconds


            res.json({ publishedProductsIds });
        } catch (error) {
            console.error('Error in bulkPublishProduct:', error);
            return res.status(500).json({error: error.message});
        }
    },
    viewProductsByCategory: async (req, res) => {
        try {
            // Get the category id
            const categoryId = req.params.id;
            // console.log('Category ID:', categoryId);
    
            // Retrieve ProductCategory by ID
            const productCategory = await ProductCategory.findById(categoryId);
    
            // Check if the ProductCategory exists
            if (!productCategory) {
                return res.status(404).json({error: 'Product Category not found'});
            }
    
            // console.log('Product Category:', productCategory.name);
            // console.log('Number of products in category:', productCategory.products.length);
    
            // Fetch all products in the category
            const products = await Product.find({_id: {$in: productCategory.products}}).populate('category', 'name').populate('review', 'rating')
    
            console.log('Number of products fetched:', products.length);
    
            // Reverse the order of products
            const reversedProducts = products.reverse();
    
            // console.log('First product after reversal:', reversedProducts[0]?.productTitle);
            // console.log('Last product after reversal:', reversedProducts[reversedProducts.length - 1]?.productTitle);
    
            res.json(reversedProducts);
        } catch (error) {
            console.error('Error in viewProductsByCategory:', error);
            return res.status(500).json({error: 'Oops! An error occurred, please refresh'});
        }
    },
    fetchAllProducts: async (req, res) => {
        try {
            const totalProducts = await Product.find().populate('category', 'name').populate('inventory', 'quantity' )
            
            res.json(totalProducts)
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getSingleProductDetails: async (req, res) => {
        try {
            const productId = req.params.id;

            const product = await Product.findById(productId).populate('category', 'name').populate('review', 'rating comment date').populate('inventory', 'quantity')

            if (!product) {
                return res.status(404).json({message: 'Product not found'})
            }
            // Convert the product to a plain JavaScript object
            // const productObject = product.toObject();

            // Add the category name to the response
            // productObject.categoryName = product.category ? product.category.name : null;

            res.json(product);
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    searchForProduct: async (req, res) => {
        //These function will be used for searching products
        try {
            const { query } = req.query; // Get the search query from the request

            if (!query) {
                return res.status(400).json({ error: 'Search query is required' });
            }
    
            // Create a regex pattern for case-insensitive search
            const searchPattern = new RegExp(query, 'i');
    
            // Search for products matching the query in title, description, or brand
            const products = await Product.find({
                $or: [
                    { productTitle: searchPattern },
                    { brand: searchPattern }
                ]
            }).populate('category'); // Populate the category field if needed
    
            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found matching the search query' });
            }
    
            res.json(products);
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    fetchNewProducts: async (req, res) => {
        //These are products added to the database within the timeframe of 48hrs, after 48hrs, the product can no longer be tagged a new product
            try {
                const cutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // Calculate cutoff date (48 hours ago)
        
                // Fetch products added within the last 48 hours
                const newProducts = await Product.find({ createdAt: { $gte: cutoffDate } });
        
                if (newProducts.length === 0) {
                    return res.status(404).json({ error: 'No new products found' });
                }
        
                res.json(newProducts);
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    
   
    editProduct: async (req, res) => {
        try {
            const productId = req.params.id; // Get the product ID from the request parameters
            const {
                productTitle, 
                price, 
                category, 
                subCategories,
                description, 
                inventory, 
                brand,
                weight,
                modelNumber,
                mainMaterial,
                color,
                keyFeatures,
                size,
                sku,
                imagesToDelete
            } = req.body;
    
            // Find the existing product by ID
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

        // Delete images from Cloudinary if any are marked for removal
            if (imagesToDelete && imagesToDelete.length > 0) {
                const deletePromises = imagesToDelete.map(imageUrl => {
                    const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
                    return cloudinary.uploader.destroy(`product_images/${publicId}`);
                });
                await Promise.all(deletePromises);

                // Filter out the deleted images from the product's existing images
                product.images = product.images.filter(image => !imagesToDelete.includes(image));
            }
    
            // Update the inventory if it exists
            if (inventory !== undefined) {
                const inventoryUpdate = await Inventory.findById(product.inventory);
                if (inventoryUpdate) {
                    inventoryUpdate.quantity = Number(inventory);
                    await inventoryUpdate.save();
                }
            }
    
            // Handle image uploads if new files are provided
            let imageUrls = product.images; // Keep existing images by default
    
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map(file => {
                    return cloudinary.uploader.upload(file.path, {
                        folder: 'product_images'
                    });
                });
    
                const imageResults = await Promise.all(uploadPromises);
                const newImageUrls = imageResults.map(result => result.secure_url);
                imageUrls = [...imageUrls, ...newImageUrls]; // Combine existing images with new ones
            }
    
            // Handle keyFeatures array
            const keyFeaturesArray = Array.isArray(keyFeatures) ? keyFeatures : [keyFeatures];

            //Handle subcategories array
            const subCategoriesArray = Array.isArray(subCategories) ? subCategories : [subCategories];
    
            // Update product fields
            product.productTitle = productTitle || product.productTitle;
            product.price = price || product.price;
            product.category = category || product.category;
            product.description = description || product.description;
            product.images = imageUrls;
            product.brand = brand || product.brand;
            product.weight = weight || product.weight;
            product.modelNumber = modelNumber || product.modelNumber;
            product.mainMaterial = mainMaterial || product.mainMaterial;
            product.color = color || product.color;
            product.keyFeatures = keyFeaturesArray.length > 0 ? keyFeaturesArray : product.keyFeatures;
            product.subCategories = subCategoriesArray.length > 0 ? subCategoriesArray : product.subCategories;
            product.size = size || product.size;
            product.sku = sku || product.sku;
    
            // Save the updated product
            await product.save();

            // Populate the category for Algolia update
            const populatedProduct = await Product.findById(product._id).populate('category');
            const categoryName = populatedProduct.category?.name || '';

            // Update Algolia index with correct partial update structure
            await client.partialUpdateObject({
                indexName: 'products',
                objectID: product._id.toString(),
                attributesToUpdate: {
                    productTitle: populatedProduct.productTitle,
                    category: {
                        name: categoryName
                    },
                    subCategories: populatedProduct.subCategories,
                    brand: populatedProduct.brand,
                    mainMaterial: populatedProduct.mainMaterial,
                    color: populatedProduct.color,
                    searchData: `${populatedProduct.productTitle} ${populatedProduct.brand} ${categoryName} ${populatedProduct.mainMaterial} ${populatedProduct.color}`.toLowerCase()
                }
            });
    
            // Check if the product category has changed
            if (category && category !== product.category.toString()) {
                const oldCategory = await ProductCategory.findById(product.category);
                const newCategory = await ProductCategory.findById(category).populate('products');
    
                // Remove product from old category
                if (oldCategory) {
                    oldCategory.products.pull(product._id);
                    await oldCategory.save();
                }
    
                // Add the product to the new category
                if (newCategory) {
                    newCategory.products.push(product);
                    await newCategory.save();
                }
            }
    
            return res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.id;

            //Find the Product to get it's inventory
            const product = await Product.findById(productId);

            if(!product){
                return res.status(404).json({error: 'Product not found'})
            }

            //First delete the inventory associated with the product
            const inventoryId = product.inventory;
            await Inventory.findByIdAndDelete(inventoryId);

            //Delete the product itself
            await Product.findByIdAndDelete(productId);

            //Delete index from Algolia
            await client.deleteObject({
                indexName: 'products',
                objectID: productId
            })

            res.json({message: 'Product deleted successfully'})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    bulkDeleteProducts: async (req, res) => {
        try {
            const { productIds } = req.body;  // Array of product IDs to delete
    
            if (!Array.isArray(productIds) || productIds.length === 0) {
                return res.status(400).json({ error: 'No product IDs provided' });
            }
    
            // Use deleteMany to remove multiple products
            await Product.deleteMany({ _id: { $in: productIds } });
    
            res.status(200).json({ message: 'Selected products deleted successfully' });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: error.message });
        }
    },

    //Index existing Product in Algolia -- Will be called Once during Development
    indexAllProducts: async(req, res) => {
        try {
            const products = await Product.find().populate('category');
            const objects = await Promise.all(
                products.map(async (product) => await indexAlgoliaRecord(product))
            )

            await client.saveObjects({
                indexName: 'products',
                objects: objects
            });

            res.status(200).json({message: 'All Products have been Successfully Indexed in Algolia'})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    updateSubCategories: async (req, res) => {
        try {
          const { brandSubCategories } = req.body;
    
          if (!brandSubCategories || typeof brandSubCategories !== 'object') {
            return res.status(400).json({ error: 'Invalid input. brandSubCategories object is required.' });
          }
    
          const updatePromises = Object.entries(brandSubCategories).map(async ([brand, subCategories]) => {
            const products = await Product.find({ brand: brand });
    
            const algoliaUpdates = [];
            let updateCount = 0;
    
            for (const product of products) {
              const matchedSubCategories = subCategories.filter(subCat => {
                const subCatLower = subCat.toLowerCase();
                const titleLower = product.productTitle.toLowerCase();
                const descLower = (product.description || '').toLowerCase();
                
                // Check if the subcategory is a substring of the title or description
                return titleLower.includes(subCatLower) || descLower.includes(subCatLower) ||
                  // Check if any word in the subcategory matches a word in the title or description
                  subCatLower.split(' ').some(word => 
                    titleLower.split(' ').includes(word) || descLower.split(' ').includes(word)
                  );
              });
    
              if (matchedSubCategories.length > 0) {
                product.subCategories = matchedSubCategories;
                await product.save();
    
                console.log(`Updating product: ${product._id}, Brand: ${brand}, Matched SubCategories: ${matchedSubCategories.join(', ')}`);
    
                const algoliaRecord = await indexAlgoliaRecord(product);
                algoliaUpdates.push({
                  objectID: product._id.toString(),
                  subCategories: matchedSubCategories,
                  searchData: algoliaRecord.searchData
                });
    
                updateCount++;
              }
            }
    
            // Perform batch update for Algolia
            if (algoliaUpdates.length > 0) {
              await client.partialUpdateObjects({
                indexName: 'products',
                objects: algoliaUpdates,
                createIfNotExists: true
              });
              console.log(`Algolia batch update completed for ${algoliaUpdates.length} products of brand ${brand}`);
            }
    
            return `Updated ${updateCount} products for ${brand}`;
          });
    
          const results = await Promise.all(updatePromises);
          res.json({ message: 'SubCategories updated for all brands', results });
        } catch (error) {
          console.error('Error in updateSubCategories:', error);
          res.status(500).json({ error: error.message, stack: error.stack });
        }
      },
      advancedSearchForProduct: async (req, res) => {
        try {
          const { query } = req.query;
    
          if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
          }
    
          // Split the query into individual words
          const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
          // Create a regex pattern for each word
          const regexPatterns = queryWords.map(word => new RegExp(word, 'i'));
    
          const products = await Product.find({
            $and: regexPatterns.map(pattern => ({
              $or: [
                { productTitle: pattern },
                { description: pattern },
                { brand: pattern },
                { subCategories: pattern },
                { 'category.name': pattern }
              ]
            }))
          })
          .populate('category', 'name')
          .populate('inventory', 'quantity')
          .limit(100);
    
          if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the search query' });
          }
    
          // Sort products by relevance
          const sortedProducts = products.sort((a, b) => {
            const aRelevance = queryWords.reduce((acc, word) => {
              const pattern = new RegExp(word, 'i');
              return acc + 
                (pattern.test(a.productTitle) ? 3 : 0) +
                (pattern.test(a.brand) ? 2 : 0) +
                (pattern.test(a.description) ? 1 : 0) +
                (a.subCategories.some(subCat => pattern.test(subCat)) ? 2 : 0) +
                (pattern.test(a.category.name) ? 2 : 0);
            }, 0);
    
            const bRelevance = queryWords.reduce((acc, word) => {
              const pattern = new RegExp(word, 'i');
              return acc + 
                (pattern.test(b.productTitle) ? 3 : 0) +
                (pattern.test(b.brand) ? 2 : 0) +
                (pattern.test(b.description) ? 1 : 0) +
                (b.subCategories.some(subCat => pattern.test(subCat)) ? 2 : 0) +
                (pattern.test(b.category.name) ? 2 : 0);
            }, 0);
    
            return bRelevance - aRelevance;
          });
    
          res.json(sortedProducts);
        } catch (error) {
          console.error('Error in advancedSearchForProduct:', error);
          return res.status(500).json({ error: 'An error occurred while searching for products' });
        }
      },
}
module.exports = productController;