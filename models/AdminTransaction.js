const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const adminTransactionSchema = Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['Wallet payment', 'Withdrawal'],
        required: true
    },
    actor: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    // reference: {
    //     type: String
    // }
});

module.exports = AdminTransaction = model('AdminTransaction', adminTransactionSchema)