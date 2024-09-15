const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const walletSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    account_no: {
        type: String,
        required: true
    },
    bvn: {
        type: String,
        required: true
    },
    mobile_number: {
        type: String,
        
    },
    bank_name: {
        type: String,
        required: true
    },
    // balance: {
    //     type: Number,
    //     required: true,
    //     default: 0
    // },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
        
    }],
    // totalSpent: {
    //     type: String
    // }

});
module.exports = Wallet = model('Wallet', walletSchema);