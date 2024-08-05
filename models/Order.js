const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
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
        enum: ['Not paid',, 'Ongoing', 'Delivered'],
        default: 'Not paid'
    },
    address: {
        type: String,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true
    },
    orderItems:[{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }],
    deliveryMethod: {
        type: String,
        enum: ['Door delivery', 'Pickup delivery'],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Wallet', 'Online'],
        required: true
    }
});
module.exports = Order = model('Order', orderSchema);