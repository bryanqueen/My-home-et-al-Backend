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
    
            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Fetch the admin wallet
            const fetchAdminWallet = await AdminWallet.find();
            if (!fetchAdminWallet || fetchAdminWallet.length === 0) {
                return res.status(404).json({ error: 'No admin account was found' });
            }
    
            const adminAccountNumber = fetchAdminWallet[0].account_no; // Ensure this is the admin account
    
            const createWalletRoute = process.env.CREATE_WALLET_API;
            const walletIntraTransferRoute = `${createWalletRoute}payments/intra`;
    
            // Find the user's wallet
            const wallet = await Wallet.findOne({ user: userId });
            if (!wallet) {
                return res.status(404).json({ error: 'Wallet not found' });
            }

            const {account_no} = wallet;

            const GETWALLETROUTE = 'https://api.poolerapp.com/v1/wallets/'

            const getWalletBalance = await axios.get(`${GETWALLETROUTE}${account_no}`, {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            });

            const walletBalance = getWalletBalance.data.balance.balance;

            // Check if wallet has sufficient balance
            if (walletBalance < amount) {
                return res.status(400).json({ error: 'Insufficient wallet balance' });
            }
    
            // Deduct points only if they are greater than 0
            if (points > 0) {
                if (user.points < points) {
                    return res.status(400).json({ error: 'Insufficient points' });
                }
            }
    
            // Prepare payload for Pooler Intra Transfer API Call
            const payload = {
                narration,
                reference: orderId,
                amount,
                from_account_number,
                to_account_number: adminAccountNumber, // Ensure this is set correctly
                to_settlement: false
            };
    
            console.log('Payload for Intra Transfer:', payload); // Log for debugging
    
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.POOLER_APIKEY}`
                }
            };
    
            // Call the Pooler Intra Transfer API
            const response = await axios.post(walletIntraTransferRoute, payload, config);
            if (response.data.status !== '01') {
                return res.status(400).json({ error: response.data.message });
            }
    
            // Deduct amount from wallet balance
            wallet.balance -= amount;
            await wallet.save();
    
            // Deduct points from the user only if payment was successful
            if (points > 0) {
                user.points -= points;
                await user.save();
            }
    
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

                    // Clear the user's cart after successful payment
                    user.cart = []; // Empty the cart
                    await user.save(); // Save the user document
    
            await userController.handlePurchaseAndReferralReward(userId);
            res.json({ message: 'Payment successful', payment });
    
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },
    UpdateOrderStatusWithSpayorRexpay: async (req, res) => {
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

                    // Clear the user's cart after successful payment
                    user.cart = []; // Empty the cart
                    await user.save(); // Save the user document

            await userController.handlePurchaseAndReferralReward(userId);
            res.json({message: 'Payment Confirmed as successful', order})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    initiateRexpayPayment: async(req, res) => {
        try {
            const {orderId, amount, email, } = req.body;
            const paymentDetails = {
              reference: orderId,
              amount,
              currency: 'NGN',
              userId: email,
              callbackUrl: `https://www.myhomeetal.com/order-confirmed?id=${orderId}-${amount}`,
            //   metadata: req.body.metadata
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