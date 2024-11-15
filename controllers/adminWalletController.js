const AdminWallet = require('../models/AdminWallet');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const AdminTransaction = require('../models/AdminTransaction')




const adminWalletController = {
    createWallet: async (req, res) => {
        try {
            const admin = req.admin._id;
            const createWalletRoute = process.env.CREATE_WALLET_API

            //Wallet Details collection
            const {
                display_name,
                firstname,
                lastname,
                bvn,
                email,
                gender,
                currency,
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
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            };

            let response;
            try {
                response = await axios.post(createWalletRoute, payload, config);
            } catch (apiError) {
                console.error('Error creating wallet with Pooler API:', apiError);
                return res.status(500).json({ error: apiError.message });
            }

            const {account_no} = response.data.data;
            
            const adminWallet = new AdminWallet({
                admin,
                account_no,
            });

            const newAdminWalletData = await adminWallet.save();

            res.json({message: 'Wallet Created Successfully', newAdminWalletData})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getAdminWalletDetails: async (req, res) => {
        try {
            const adminId = req.admin._id;

            const adminWallet = await AdminWallet.findOne({admin: adminId});
            if(!adminWallet){
                console.error(`Admin Wallet not found`);
                return res.status(404).json({error: 'Admin Wallet Not found'})
            }

            const {account_no} = adminWallet;
            const GETWALLETROUTE = 'https://api.poolerapp.com/api/v1/wallet/';

            const getAdminWallet = await axios.get(`${GETWALLETROUTE}${account_no}`, {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            });
            if(!getAdminWallet.data){
                console.error(getAdminWallet.data.message);
                return res.status(500).json({error: 'Error occured while retrieving Wallet Details'})
            };

            const adminWalletDeets = getAdminWallet.data.data;

            res.json({adminWalletDeets})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getAdminWalletTransactions: async (req, res) => {
        try {
            const adminId = req.admin._id;

            const adminWallet = await AdminWallet.findOne({admin: adminId}).populate('transactions', 'amount type actor');
            if(!adminWallet){
                return res.status(404).json({error: 'Admin Wallet not found'})
            }
            res.json({adminWallet})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    withdraw: async (req, res) => {
        try {
            const adminId = req.admin._id;
            const adminWallet = await AdminWallet.findOne({admin: adminId});
            const {account_no} = adminWallet
            const merchantAccount = process.env.POOLER_MERCHANT_SETTLEMENT_ACCOUNT
            const MERCHANTSETTLEMENTROUTE = 'https://api.poolerapp.com/api/v1/wallet/payments/intra'
            const {
                narration,
                amount
            } = req.body;

            //Prepare payload for Pooler Settlement
            const payload = {
                narration,
                reference,
                amount,
                from_account_number: account_no,
                to_account_number: merchantAccount,
                to_settlement: true
            };

            console.log('Payload for Merchant Settlement:', payload);

            const config = {
                header: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            }

            //Call the Pooler Intra Transfer API for Merchant settlement
            const response = await axios.post(MERCHANTSETTLEMENTROUTE, payload, config);
            if(response.data.status !== '01'){
                return res.status(400).json({error: response.data.message})
            }
            const adminTransaction = new AdminTransaction({
                amount: -amount,
                type: 'Withdrawal',
                actor: 'Withdrawal'
            });
            await adminTransaction.save();
            res.json({message: 'Settlement Completed successfully'})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getTotalSales: async (req, res) => {
        try {
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
          const totalSales = await Order.aggregate([
            {
              $match: {
                createdAt: { $gte: twelveMonthsAgo },
                status: { $in: ['Ongoing', 'Delivered'] }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$totalAmount" }
              }
            }
          ]);
    
          const sales = totalSales.length > 0 ? totalSales[0].total : 0;
    
          res.json({ totalSales: sales });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
    getTotalRevenue: async (req, res) => {
        try {
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
          const totalRevenue = await AdminTransaction.aggregate([
            {
              $match: {
                date: { $gte: twelveMonthsAgo }
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" }
              }
            }
          ]);
    
          const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
          res.json({ totalRevenue: revenue });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
    
      getTotalWithdrawal: async (req, res) => {
        try {
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
          const totalWithdrawal = await AdminTransaction.aggregate([
            {
              $match: {
                date: { $gte: twelveMonthsAgo },
                type: 'Withdrawal'
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $abs: "$amount" } }
              }
            }
          ]);
    
          const withdrawal = totalWithdrawal.length > 0 ? totalWithdrawal[0].total : 0;
    
          res.json({ totalWithdrawal: withdrawal });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }

};
module.exports = adminWalletController;