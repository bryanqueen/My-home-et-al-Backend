const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const paymentSchema = new Schema({
    paymentId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Success', 'Failed', 'Pending']
    },
    method: {
        type: String,
        required: true,
        enum: ['Wallet', 'Card']
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },

});
module.exports = Payment = model('Payment', paymentSchema)