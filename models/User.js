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

    },
    savedItems: [{
        type: ''
    }],
    purchaseHistory: [{
        type: ''
    }],
    notificatiions: [{
        type: ''
    }],
    deliveryAddress: {
        type: String
    }

});

const User = model('User', userSchema);
module.exports = User;