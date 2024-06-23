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
            const newOrder = new Order({
                user,
                address,
                orderPrice,
                totalPrice,
                orderItems,
                deliveryMethod,
                paymentMethod
            });
            await newOrder.save();
            res.json({message: 'Order Created Successfully'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
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