const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const AdminWallet = require('../models/AdminWallet');
const Order = require('../models/Order');
const axios = require('axios');
const { createPayment } = require('../config/rexPay');
const userController = require('./userController');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const mongoose = require('mongoose')

const paymentController = {
    makeWalletPayment: async (req, res) => {
        try {
            const userId = req.user._id;
            const {
                orderId,
                narration,
                amount,
                from_account_number,
                points
            } = req.body;

   

            const user = await User.findById(userId);

            if(points > 0){
                if (user.points < points) {
                    return res.status(400).json({error: 'Insufficient points'});
                }
                user.points -= points
                await user.save();
            }
            const fetchAdminWallet = await AdminWallet.find();
            if(!fetchAdminWallet){
                return res.status(404).json({error: 'No admin account was found'});
            }
            
            const adminAccountNumber = parseInt(fetchAdminWallet[0].account_no)
            const createWalletRoute = process.env.CREATE_WALLET_API;
            const walletIntraTransferRoute = `${createWalletRoute}payments/intra`;
            
            // Find wallet
            const wallet = await Wallet.findOne({user: userId});
            if(!wallet){
                return res.status(404).json({error: 'Wallet not found'});
            }
            
            // Check if wallet has sufficient balance
            if(wallet.balance < amount){
                return res.status(400).json({error: 'Insufficient wallet balance'});
            }
            
            // Pooler Intra Transfer API Call
            const payload = {
                narration,
                reference: orderId,
                amount,
                from_account_number,
                to_account_number: adminAccountNumber,
                to_settlement: false
            };
    
            const config = {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            };
    
            const response = await axios.post(walletIntraTransferRoute, payload, config);
            if(response.data.status !== '01'){
                return res.status(400).json({error: response.data.message});
            }
            
            // Deduct amount from wallet balance
            wallet.balance -= amount;
            await wallet.save();
    
            // Record Payment in the database
            const payment = new Payment({
                userId,
                orderId,
                amount,
                status: 'Success',
                method: 'Wallet'
            });
            await payment.save();
    
            // Record wallet Transaction in the database
            const transaction = new Transaction({
                wallet: wallet._id,
                amount: -amount,
                type: 'Purchase',
                order: orderId
            });
            await transaction.save();
    
            // Add the transaction to the wallet's transactions array
            wallet.transactions.push(transaction._id);
            await wallet.save();
    
            // Update the order status to Ongoing
            const order = await Order.findOne({ orderId: orderId });
            if (order) {
                order.status = 'Ongoing';
                await order.save();
    
                // Update stock quantity for each product in the order
                for (let item of order.orderItems) {
                    await Inventory.findOneAndUpdate(
                        { product: item.product },
                        { $inc: { quantity: -item.qty } }
                    );
                }
            }
    
            await userController.handlePurchaseAndReferralReward(userId);
            res.json({ message: 'Payment successful', payment });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    },
    UpdateOrderStatusWithSpay: async (req, res) => {
        try {
            const userId = req.user._id;
            const {orderId, points} = req.body;

            const user = await User.findById(userId);

            if(points > 0){
                if (user.points < points) {
                    return res.status(400).json({error: 'Insufficient points'});
                }
                user.points -= points
                await user.save();
            }
            
            const order = await Order.findOne({orderId: orderId});

            if(!order){
                return res.status(404).json({error: 'Order not found'})
            }
            order.status = 'Ongoing'
            await order.save();

            // Update the order status to Ongoing
            for (let item of order.orderItems) {
                await Inventory.findOneAndUpdate(
                    { product: item.product },
                    { $inc: { quantity: -item.qty } }
                );
            }
            res.json({message: 'Payment Confirmed as successful', order})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    initiateRexpayPayment: async(req, res) => {
        try {
            const paymentDetails = {
              reference: req.body.reference,
              amount: req.body.amount,
              currency: req.body.currency,
              userId: req.body.userId,
              callbackUrl: req.body.callbackUrl,
              metadata: req.body.metadata
            };
        
            const result = await createPayment(paymentDetails);
            res.status(200).json(result);
          } catch (error) {
            console.error('Payment initiation failed:', error);
            res.status(500).json({ error: 'Failed to initiate payment' });
          }
    },

};
module.exports = paymentController;