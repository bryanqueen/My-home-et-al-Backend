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

            //Hash BVN
            const saltRounds = 10;

            const hashedBvn = await bcrypt.hash(bvn, saltRounds);

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
          const authHeader = req.headers['authorization'];
          if (!authHeader) {
            return res.status(401).json({ error: 'Authorization Header is Missing' });
          }
          const token = authHeader.split(' ')[1];
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decodedToken.id;
          console.log('Decoded token userId:', userId);
      
          const wallet = await Wallet.findOne({ user: userId });
          if (!wallet) {
            console.error(`Wallet not found for user ID: ${userId}`);
            return res.status(404).json({ error: 'Wallet not found' });
          }
      
          const { account_no } = wallet;
          const GETWALLETROUTE = 'https://api.poolerapp.com/v1/wallet/';
          console.log('GETWALLETROUTE:', GETWALLETROUTE);
          console.log('account_no:', account_no);
      
          const getWalletBalance = await axios.get(`${GETWALLETROUTE}${account_no}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.POOLER_APIKEY}`,
            },
          });
          console.log('getWalletBalance response:', getWalletBalance.data);
      
          if (!getWalletBalance.data || !getWalletBalance.data.balance || !getWalletBalance.data.balance.balance) {
            console.error('Invalid response from POOLER_APIKEY endpoint');
            return res.status(500).json({ error: 'Error retrieving wallet balance' });
          }
      
          const walletBalance = getWalletBalance.data.balance.balance;
          res.json({ wallet_details: wallet, wallet_balance: walletBalance });
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
            return res.status(500).json({error: 'Ooops!! an error occured, please try again'})
        }
    },

}

module.exports = walletController;