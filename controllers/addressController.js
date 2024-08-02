const User = require('../models/User');
const Address = require('../models/Address');

const addressController = {
    createAddress: async (req, res) => {
        try {
            const userId = req.user._id;

            const {deliveryAddress, phone_number, city} = req.body;

            //Address Creation
            const address = new Address({
                user: userId,
                deliveryAddress,
                phone_number,
                city
            });

            await address.save();

            //Update User's Address Book
            const user = await User.findById(userId);
            user.addressBook.push(address._id);
            await user.save();
            res.json({message: 'Address Created successfully', address})

        } catch (error) {
            console.error(error)
            return res.status(500).json({error: error.message})
        }
    },
    getAddresses: async (req, res) => {
        try {
            const userId = req.user._id;

            //Find Addresses associated to a user
            const addresses = await Address.find({user: userId});
            
            res.json(addresses)
        } catch (error) {
           return res.status(500).json({error: error.message}) 
        }
    },
    editAddress: async (req, res) => {
        try {
            const userId = req.user._id;
            const {addressId, deliveryAddress, phone_number, city} = req.body;

            //Find User
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({error: 'User not found'})
            }
            const address = await Address.findByIdAndUpdate(
                addressId,
                {
                    deliveryAddress,
                    phone_number,
                    city
                },
                {new: true}
            );
            if(!address){
                return res.status(404).json({error: 'Address not found'})
            }

            res.json(address)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    deleteAddress: async (req, res) => {
        try {
            const {addressId} = req.body;

            const address = await Address.findByIdAndDelete(addressId);
            if(!address){
                return res.status(404).json({error: 'Addres not found'})
            }
            res.json({message: "Address deleted successfully"})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}
module.exports = addressController;