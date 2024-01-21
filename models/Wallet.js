const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const walletSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    balance: {
        type: String,
        required: true
    },
    totalSpent: {
        type: String
    },
    transactions: [{
        type: String,
        enum: ['Withdrawal', 'Deposit', 'Purchase']
    }]
});
module.exports = Wallet = model('Wallet', walletSchema);