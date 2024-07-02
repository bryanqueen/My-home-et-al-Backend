const mongoose = require ('mongoose');
const {model, Schema} = mongoose;

const adminWalletSchema = new Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    account_no: {
        type: Number,
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
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});
module.exports = AdminWallet = model('AdminWallet', adminWalletSchema);