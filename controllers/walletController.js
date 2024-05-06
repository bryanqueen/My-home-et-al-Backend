const Wallet = require('../models/Wallet');
const axios = require('axios');
const bcrypt = require('bcryptjs')




const walletController = {
    createWallet: async (req, res) => {
        try {

            const createWalletRoute = process.env.CREATE_WALLET_API
            
            //Wallet Details collection
            const {
                display_name,
                bvn,
                firstname,
                lastname,
                currency,
                email,
                gender,
                date_of_birth,
                mobile_number
            } = req.body;

            const payload = {
                display_name,
                bvn,
                firstname,
                lastname,
                currency,
                email,
                gender,
                date_of_birth,
                mobile_number
            };

            const config = {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${process.env.POOLER_APIKEY}`
                }
            };

            const saltHash = 10;

            const hashedBvn = await bcrypt.hash(bvn, saltHash);

            const response = await axios.post(createWalletRoute, payload, config);

            console.log(response.data)

            const wallet = new Wallet({
                display_name,
                bvn: hashedBvn,
                firstname,
                lastname,
                currency,
                email,
                gender,
                date_of_birth,
                mobile_number
            })

            
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    },
    getWalletPaymentDetails: async (req, res) => {
        try {
            const accountNumber = req.params.id;

        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    }
}

module.exports = walletController;