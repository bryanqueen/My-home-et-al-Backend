const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const orderItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    qty: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    subTotalPrice: {
        type: String,
        required: true
    }
});
module.exports = OrderItem = model('OrderItem', orderItemSchema);