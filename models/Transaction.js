const mongoose = require('mongoose');
const {model, Schema} = mongoose;


const transactionSchema = new Schema({
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Deposit', 'Purchase'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    description: {
        type: String,
    }
});

module.exports = Transaction = model('Transaction', transactionSchema)