const AdminWallet = require('../models/AdminWallet');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const Payment = require('../models/Payment');
const Order = require('../models/Order')




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
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            };

            let response;
            try {
                response = await axios.post(createWalletRoute, payload, config);
            } catch (apiError) {
                console.error('Error creating wallet with Pooler API:', apiError.response?.data || apiError.message);
                return res.status(500).json({ error: apiError.response?.data.data });
            }

            const {account_no, bank_name} = response.data.data;
            const {balance} = response.data.data.balance;
            
            const adminWallet = new AdminWallet({
                admin,
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

            const newAdminWalletData = await adminWallet.save();

            res.json({message: 'Wallet Created Successfully', newAdminWalletData})

        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getAdminWalletandTransactions: async (req, res) => {
        try {
            const adminId = req.admin._id;

            const adminWallet = await AdminWallet.findOne({admin: adminId}).select('-transactions');

            if(!adminWallet){
                return res.status(404).json({error: 'Admin Wallet not found'})
            }
            const userPayments = await Payment.find().populate('userId', 'firstname lastname' )

            res.json({adminWallet, userPayments})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getTotalSales: async (req, res) => {
        try {
            const orders = await Order.find({status: { $in: ['Ongoing', 'Delivered'] }});
            res.json(orders)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
};
module.exports = adminWalletController;