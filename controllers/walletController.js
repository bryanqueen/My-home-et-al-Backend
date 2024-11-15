const Wallet = require('../models/Wallet');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken')




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
    
            const { account_no } = response.data.data;

            const wallet = new Wallet({
                user,
                account_no
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
          const userId = req.user._id
          const wallet = await Wallet.findOne({ user: userId });
          if (!wallet) {
            console.error(`Wallet not found for user ID: ${userId}`);
            return res.status(404).json({ error: 'Wallet not found' });
          }
      
          const { account_no } = wallet;
          const GETWALLETROUTE = 'https://api.poolerapp.com/api/v1/wallet/';
          console.log('GETWALLETROUTE:', GETWALLETROUTE);
          console.log('account_no:', account_no);
      
          const getWallet = await axios.get(`${GETWALLETROUTE}${account_no}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.POOLER_APIKEY}`,
            },
          });
          console.log('getWallet response:', getWallet.data);
      
          if (!getWallet.data) {
            console.error('Invalid response from POOLER_APIKEY endpoint');
            return res.status(500).json({ error: 'Error retrieving wallet details' });
          }
      
          const walletDeets = getWallet.data.data
          res.json({ wallet_details: walletDeets });
        } catch (error) {
          console.error('Error in getWallet:', error);
          return res.status(500).json({ error: error.message });
        }
      },
    getWalletTransactions: async (req, res) => {
        try {
            const userId = req.user._id;
        
            const wallet = await Wallet.findOne({user: userId}).populate('transactions', 'amount type date order');
            if(!wallet){
                return res.status(500).json({error: 'Wallet not found'})
            }
            res.json(wallet.transactions);

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },

}

module.exports = walletController;