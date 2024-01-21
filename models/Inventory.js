//This Model has to do with the tracking of availability of a product
const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const inventorySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    }
})
module.exports = Inventory = model('Inventory', inventorySchema )