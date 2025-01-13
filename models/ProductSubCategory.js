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

    productCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
    }],

    subCategoryImage: {
        type: String
    },

    createdBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }], 

    updatedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }],

})

const productSubCategoryModel = mongoose.model('ProductSubCategory', productSubCategorySchema);

module.exports = productSubCategoryModel