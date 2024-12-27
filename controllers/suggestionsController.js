const Suggestion = require('../models/Suggestion');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const refineProductDetails = require('../utils/refineProduct');

const suggestionController = {
    populateFromProductandCategories: async (req, res) => {
        const BATCH_SIZE = 50; // Process 50 items at a time
        let processedCount = 0;
        let totalCount = 0;
        let newSuggestionsCount = 0;
      
        try {
          // Get total counts
          const productCount = await Product.countDocuments();
          const categoryCount = await ProductCategory.countDocuments();
          totalCount = productCount + categoryCount;
      
          console.log(`Starting to process ${totalCount} items (${productCount} products and ${categoryCount} categories)`);
      
          // Process products
          for (let skip = 0; skip < productCount; skip += BATCH_SIZE) {
            const products = await Product.find({}, "productTitle category")
              .populate({ path: "category", select: "name" })
              .skip(skip)
              .limit(BATCH_SIZE);
      
            const productPromises = products.map(async (product) => {
              try {
                if (!product || !product.productTitle) {
                  console.log(`Skipping product with id ${product?._id || 'unknown'} due to missing title`);
                  return null;
                }
                console.log(`Processing product: ${product.productTitle}`);
                const { refinedName, keywords } = await refineProductDetails(product.productTitle);
                console.log(`Refined Name: ${refinedName}`);
                console.log(`Keywords: ${keywords.join(', ')}`);
                return {
                  suggestionText: refinedName,
                  type: "Product",
                  keywords,
                  popularityScore: Math.floor(Math.random() * 100),
                };
              } catch (error) {
                console.error(`Failed to process product: ${product?.productTitle || 'undefined'}`, error);
                return null;
              }
            });
      
            const batchSuggestions = (await Promise.all(productPromises)).filter(Boolean);
            
            // Use bulkWrite for efficient database operations
            const bulkOps = batchSuggestions.map(suggestion => ({
              updateOne: {
                filter: { suggestionText: suggestion.suggestionText },
                update: { $set: suggestion },
                upsert: true
              }
            }));
      
            const result = await Suggestion.bulkWrite(bulkOps);
            newSuggestionsCount += result.upsertedCount;
            processedCount += batchSuggestions.length;
            console.log(`Processed ${processedCount}/${totalCount} items. New suggestions: ${result.upsertedCount}`);
          }
      
          // Process categories
          const categories = await ProductCategory.find({}, "name");
          const categoryBulkOps = categories.map(category => ({
            updateOne: {
              filter: { suggestionText: category.name },
              update: {
                $set: {
                  suggestionText: category.name,
                  type: "Category",
                  keywords: [category.name.toLowerCase()],
                  popularityScore: Math.floor(Math.random() * 100),
                }
              },
              upsert: true
            }
          }));
      
          const categoryResult = await Suggestion.bulkWrite(categoryBulkOps);
          newSuggestionsCount += categoryResult.upsertedCount;
          processedCount += categories.length;
          console.log(`Processed ${processedCount}/${totalCount} items. New category suggestions: ${categoryResult.upsertedCount}`);
      
          console.log("Suggestions population completed successfully!");
          res.status(200).json({ 
            message: "Suggestions populated successfully", 
            totalProcessed: processedCount,
            newSuggestionsAdded: newSuggestionsCount
          });
        } catch (error) {
          console.error("Error populating suggestions:", error);
          res.status(500).json({ 
            error: "Failed to populate suggestions", 
            details: error.message 
          });
        }
    }
}

module.exports = suggestionController;