const Payment = require('../models/Payment');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const axios = require('axios');

const paymentController = {
    makeWalletPayment: async (req, res) => {
        try {
            const userId = req.user._id;
            const {
                orderId,
                narration,
                amount,
                from_account_number,
            } = req.body;

            const adminWallet = 5579626765;
            const createWalletRoute = process.env.CREATE_WALLET_API;
            const walletIntraTransferRoute = `${createWalletRoute}payments/intra`
            

            //Find wallet
            const wallet = await Wallet.findOne({user: userId})

            if(!wallet){
                return res.status(404).json({error: 'Wallet not found'});
            }

            //Check if wallet has sufficient balance
            if(wallet.balance < amount){
                return res.status(400).json({error: 'Insufficient wallet balance'})
            };

            //Pooler Intra Transfer API Call

            //API request payload
            const payload = {
                narration,
                reference: orderId,
                amount,
                from_account_number,
                to_account_number: adminWallet,
                to_settlement: false
            };

            const config = {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.POOLER_APIKEY}`
                }
            }

            const response = await axios.post(walletIntraTransferRoute, payload, config);

            if(response.data.status !== '01'){
                return response.data.message
            }

            //Deduct amount from wallet balance
            wallet.balance -= amount;
            await wallet.save();

            //Record Payment in the database
            const payment = new Payment({
                paymentId,
                userId,
                orderId,
                amount,
                status: 'Success',
                method: 'Wallet'
            });
            await payment.save();

            //Record wallet Transaction in the database
            const transaction = new Transaction({
                wallet: wallet._id,
                amount: -amount,
                type: 'Purchase',
            });

            await transaction.save();

        // Add the transaction to the wallet's transactions array
        wallet.transactions.push(transaction._id);
        await wallet.save();

        res.json({ message: 'Payment successful', payment });

        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
};
module.exports = paymentController;