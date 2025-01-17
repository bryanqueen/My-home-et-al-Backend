const bannerModel =require('../models/Banner');
const adminModel = require('../models/Admin');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const postBanner = async (req, res) => {
    try {

        let newImage = null;

        if (req.file) {
            try {

                // upload available photo to cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, 
                    {folder: 'banner'} 
                );

                newImage = result.secure_url
                fs.unlinkSync(req.file.path); // remove from local

            } catch (error) {
                console.error('Cloudinary upload error:', error.message);
                return res.status(500).json({ error: 'Failed to upload picture' });
            }
        }

        const data = {
            banner: newImage
        }

        const bannerImage = new bannerModel(data);  // update photo field with uploaded photo
        const newBanner = await bannerImage.save();  // save to database
        res.status(200).json({
            message: "successfully posted a new banner",
            data: newBanner
        }) 

    } catch (error) {
        console.error('server error :', error.message)
        res.status(500).json({
            error: error.message,
            message: "internal error"
        })
 }
}

const updateBanner = async (req, res) => {
    try {

        const bannerId = req.params.id; // get id of banner to update
        const getBannerToUpdate = await bannerModel.findById(bannerId); // find banner in DB with id

        if(!getBannerToUpdate.banner) {
            return res.status(404).json({
                message: 'trying to update a non existing banner'
            })
        }

        const updateData = {
            banner: getBannerToUpdate.banner 
        }

        let newImage = null;

        if(req.file) {
                try{
                    // if an image was provided, delete the previous image, by extracting the publicId
                    const public_id = updateData.banner.split('/').slice(7).join('/').split('.')[0];
    
                    const deleteImage = await cloudinary.uploader.destroy(public_id);  // then delete the image
                    // console.log(public_id)  // log the public id
                    // console.log(deleteImage) // log to know if the image available on the server was deleted
    
                    // upload the new image
                    const result = await cloudinary.uploader.upload(req.file.path, 
                        { folder: "banner"}
                    )
                    newImage = result.secure_url
                    fs.unlinkSync(req.file.path)  // remove the image from the local storage
                } catch (error) {
                console.error('cloudinary upload error :', error.message)
                return res.status(400).json({
                    message: "unable to upload updated banner"
                })
            }
        }

        // data for banner field,either previous one or new one 
        const Data = {
            banner: newImage || updateData.banner
        }

        const updatedBanner = await bannerModel.findByIdAndUpdate(
            bannerId, 
            Data, 
            {new: true})

            res.status(200).json({
            message: 'successfully updated Banner',
            data: updatedBanner
        })
        console.log(updatedBanner)
    } catch (error) {
        console.error('server error :', error.message)
        res.status(500).json({
            error: error.message, 
            message: 'internal error'
        })
    }
}


module.exports = { postBanner, updateBanner }