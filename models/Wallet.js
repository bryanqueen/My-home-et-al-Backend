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

    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
        
    }],

});
module.exports = Wallet = model('Wallet', walletSchema);