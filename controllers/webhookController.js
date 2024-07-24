const crypto = require('crypto');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// Function to verify the webhook signature
function verifySignature(req) {
    const signature = req.headers['x-wallet-signature'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.POOLER_APIKEY;
    
    const hash = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    
    return hash === signature;
}

const webhookController = {
    handleWebhook: async (req, res) => {
        console.log('Webhook received:', req.body);
        try {
            // Verify the webhook signature
            if (!verifySignature(req)) {
                console.log('Invalid signature');
                return res.status(400).json({ error: 'Invalid signature' });
            }

            const { event, data } = req.body;
            
            console.log('Event:', event); // Log the event type
            console.log('Data:', data); // Log the event data

            if (event === 'event.intra.transfer' && data.completed) {
                await handleIntraTransfer(data);
                res.status(200).json({ message: 'Intra transfer webhook processed successfully' });
            } else if (event === 'event.collection' && data.completed) {
                await handleFundWallet(data);
                res.status(200).json({ message: 'Fund wallet webhook processed successfully' });
            } else {
                res.status(400).json({ message: 'Unhandled event type or incomplete transaction' });
            }
        } catch (error) {
            console.error('Error processing webhook:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

// Function to handle intra transfer
async function handleIntraTransfer(data) {
    const { amount, target_account_number, reference, narration } = data;

    // Find the wallet by account number
    const wallet = await Wallet.findOne({ account_no: target_account_number });

    if (!wallet) {
        throw new Error('Wallet not found');
    }

    // Update the wallet balance
    wallet.balance += parseFloat(amount);
    await wallet.save();

    // Create a new transaction
    const transaction = new Transaction({
        wallet: wallet._id,
        amount: parseFloat(amount),
        type: 'Purchase',
        reference,
        narration
    });
    await transaction.save();

    // Add the transaction to the wallet's transactions array
    wallet.transactions.push(transaction._id);
    await wallet.save();
}

// Function to handle fund wallet
async function handleFundWallet(data) {
    const { amount, target_account_number, reference, narration } = data;

    // Find the wallet by account number
    const wallet = await Wallet.findOne({ account_no: target_account_number });

    if (!wallet) {
        throw new Error('Wallet not found');
    }

    // Update the wallet balance
    wallet.balance += parseFloat(amount);
    await wallet.save();

    // Create a new transaction
    const transaction = new Transaction({
        wallet: wallet._id,
        amount: parseFloat(amount),
        type: 'Deposit',
        reference,
        narration
    });
    await transaction.save();

    // Add the transaction to the wallet's transactions array
    wallet.transactions.push(transaction._id);
    await wallet.save();
}

module.exports = webhookController;
