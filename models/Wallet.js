const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const walletSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    account_no: {
        type: Number,
        required: true
    },
    bvn: {
        type: Number,
        required: true
    },
    mobile_number: {
        type: String,
        
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