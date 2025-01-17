const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema ({
    banner: {
        type: String,
        required: true
    },

    updatedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }]
})

const bannerModel = mongoose.model('Banner', bannerSchema);

module.exports = bannerModel;