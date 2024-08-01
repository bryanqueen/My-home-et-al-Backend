const mongoose = require('mongoose');
const {model, Schema} = mongoose;

const addressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});
module.exports = Address = model('Address', addressSchema);