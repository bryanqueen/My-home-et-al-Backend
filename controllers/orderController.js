const Order = require('../models/Order');


const orderController = {
    createOrder: async (req, res) => {
        try {
            const user = req.user._id
            const { address, 
                    orderPrice, 
                    orderItems, 
                    deliveryMethod,
                    paymentMethod
                  } = req.body;
        if(!user){
            return res.status(400).json({error: ''})
        }

        const orderId = Math.floor(Math.random() * 10**13).toString().padStart(13, '0');

            const newOrder = new Order({
                orderId,
                user,
                address,
                orderPrice,
                orderItems,
                deliveryMethod,
                paymentMethod
            });
            await newOrder.save();
            res.json({message: 'Order Created Successfully', newOrder})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    trackOrder: async (req, res) => {
        try {
           
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    }
};
module.exports = orderController;