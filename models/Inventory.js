//This Model has to do with the tracking of availability of a product
const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const inventorySchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    createdOn: {
        type: String
    },
    createdBy: {
        type: String
    },
    updatedOn: {
        type: String
    },
    updatedBy: {
        type: String
    }
    
})
module.exports = Inventory = model('Inventory', inventorySchema )