const Order = require('../models/Order');


const orderController = {
    createOrder: async (req, res) => {
        try {
            const user = req.userId;
            const { address, 
                    orderPrice,
                    totalPrice, 
                    orderItems, 
                    deliveryMethod
                  } = req.body;
            const newOrder = new Order({
                user,
                address,
                orderPrice,
                totalPrice,
                orderItems,
                deliveryMethod
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