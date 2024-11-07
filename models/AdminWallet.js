const mongoose = require ('mongoose');
const {model, Schema} = mongoose;

const adminWalletSchema = new Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Admin'
    },
    account_no: {
        type: String,
        required: true
    },


    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});
module.exports = AdminWallet = model('AdminWallet', adminWalletSchema);