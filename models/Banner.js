const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema ({
    banner: {
        type: String,
        required: true
    },

    // postedBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Admin'
    // }],

    postedBy: {
        type: String,
    },

    // updatedBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Admin'
    // }]

    updatedBy: {
        type: String,
    },

    createdOn: { 
        type: String, 
        // default: Date.now
    },

    updatedOn: { 
        type: String, 
        // default: Date.now
    }

}  //{ timestamps: true }
)

const bannerModel = mongoose.model('Banner', bannerSchema);

module.exports = bannerModel;