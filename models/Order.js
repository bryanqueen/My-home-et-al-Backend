const mongoose = require('mongoose');
const {model, Schema} = mongoose;
const OrderItem = require('../models/OrderItem')

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Pending', 'Failed', 'Confirmed']
    },
    address: {
        type: String,
        required: true
    },
    orderPrice: {
        type: String,
        required: true
    },
    totalPrice: {
        type: String,
        required: true
    },
    orderItems: {
        type: [OrderItem]
    },
    deliveryMethod: {
        type: String,
        enum: ['Door delivery', 'Pickup delivery'],
        required: true
    }
});
module.exports = Order = model('Order', orderSchema);