const Wallet = require('../models/Wallet');
const axios = require('axios');
const bcrypt = require('bcryptjs')




const walletController = {
    createWallet: async (req, res) => {
        try {
            const user = req.userId
            const createWalletRoute = process.env.CREATE_WALLET_API
            
            //Wallet Details collection
            const {
                display_name,
                bvn,
                email,
                gender,
                date_of_birth,
                mobile_number,
            } = req.body;

            //Hash BVN
            const saltHash = 10;

            const hashedBvn = await bcrypt.hash(bvn, saltHash);

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


            const response = await axios.post(createWalletRoute, payload, config);

        
            const {account_no, bank_name} = response.data.data;

            const wallet = new Wallet({
                user,
                bvn: hashedBvn,
                firstname,
                lastname,
                currency,
                email,
                gender,
                date_of_birth,
                mobile_number,
                account_no,
                bank_name
            });

            const newWalletData = await wallet.save()

            res.json({message: 'Wallet Created Successfully', newWalletData})
            
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: error.message})
        }
    },
    getWalletPaymentDetails: async (req, res) => {
        try {
            

        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    }
}

module.exports = walletController;