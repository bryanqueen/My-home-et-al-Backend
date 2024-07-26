const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const paymentSchema = new Schema({
    paymentId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Success', 'Failed', 'Pending']
    },
    method: {
        type: String,
        required: true,
        enum: ['Wallet', 'Online']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },

});
module.exports = Payment = model('Payment', paymentSchema)