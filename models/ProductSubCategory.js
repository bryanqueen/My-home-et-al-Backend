const mongoose = require ('mongoose');

const productSubCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true,
    },

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
    },

    subCategoryImage: {
        type: String
    },

    createdBy:  {
        type: String
    },

    updatedBy: {
        type: String
    },

    createdOn: { 
        type: String, 
        // default: Date.now
    },

    updatedOn: { 
        type: String, 
        // default: Date.now
    }

},  //{ timestamps: true } 
)

const productSubCategoryModel = mongoose.model('ProductSubCategory', productSubCategorySchema);

module.exports = productSubCategoryModel