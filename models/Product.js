const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const productSchema = new Schema({
    productTitle: {
        type: String,
        required: true
    },
   review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: false
   }],
    price: {
        type: String,
        required: true
    },
    category: {
        type: '',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: [{
        type: String,
        required: true
    }],
    isNew: {
        type: Boolean
    },

});

const Product = model('Product', productSchema);

module.exports = Product;
