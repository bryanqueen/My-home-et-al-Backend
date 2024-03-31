const mongoose = require('mongoose');
const {Schema, model} = mongoose;


const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    savedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    purchaseHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    notificatiions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    deliveryAddress: {
        type: String
    }

});

const User = model('User', userSchema);
module.exports = User;