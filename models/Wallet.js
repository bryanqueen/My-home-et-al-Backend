const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const walletSchema = new Schema({
    balance: {
        type: String,
        required: true
    },
    totalSpent: {
        type: String
    },
    transactions: [{
        type: ''
    }]
});
module.exports = Wallet = model('Wallet', walletSchema);