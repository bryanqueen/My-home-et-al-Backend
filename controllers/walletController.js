const Wallet = require('../models/Wallet');
const axios = require('axios');
const bcrypt = require('bcryptjs')




const walletController = {
    createWallet: async (req, res) => {
        try {
            const user = req.user._id;
            const createWalletRoute = process.env.CREATE_WALLET_API
            
            //Wallet Details collection
            const {
                display_name,
                bvn,
                email,
                firstname,
                lastname,
                gender,
                currency,
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


            let response;
            try {
                response = await axios.post(createWalletRoute, payload, config);
            } catch (apiError) {
                console.error('Error creating wallet with Pooler API:', apiError.response?.data || apiError.message);
                return res.status(500).json({ error: apiError.response?.data.data });
            }
    
            const { account_no, bank_name } = response.data.data;
            const { balance } = response.data.data.balance;

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
                bank_name,
                balance: balance || 0
            });

            const newWalletData = await wallet.save()

            res.json({message: 'Wallet Created Successfully', newWalletData})
            
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: error.message})
        }
    },
    getWallet: async (req, res) => {
        try {
            const userId = req.user._id;
    
            // Check if req.user is defined
            if (!req.user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const wallet = await Wallet.findOne({user: userId});
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }
    
            res.json(wallet);  // Return the wallet information
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    ,
    getWalletPaymentDetails: async (req, res) => {
        try {
            

        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    },

}

module.exports = walletController;