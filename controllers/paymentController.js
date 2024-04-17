const Payment = require('../models/Payment');

const paymentController = {
    //This Controller should be called via a route when payment is made in any form.
    //The Forms include: deduction from card, deduction from wallet.
    createPayment: async (req, res) => {
        try {
            
        } catch (error) {
            return res.status(500).json({error: 'Ooops!!! an error occured in the server'})
        }
    }
};
module.exports = paymentController;