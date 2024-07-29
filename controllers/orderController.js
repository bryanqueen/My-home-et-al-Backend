const Order = require('../models/Order');
const User = require('../models/User');


const orderController = {
    createOrder: async (req, res) => {
        try {
            const userId = req.user._id
            const { address, 
                    orderPrice, 
                    orderItems, 
                    deliveryMethod,
                    paymentMethod
                  } = req.body;
        if(!userId){
            return res.status(400).json({error: ''})
        }

        const orderId = Math.floor(Math.random() * 10**13).toString().padStart(13, '0');

            const newOrder = new Order({
                orderId,
                user: userId,
                address,
                orderPrice,
                orderItems,
                deliveryMethod,
                paymentMethod
            });
            await newOrder.save();

        // Update user's purchase history
        const user = await User.findById(userId);
        user.purchaseHistory.push(newOrder._id);
        await user.save();
            res.json({message: 'Order Created Successfully', newOrder})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    // const getAllOrdersWithPagination = async (req, res) => {
    //     try {
    //         const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    //         // Convert page and limit to integers
    //         const pageNum = parseInt(page, 10);
    //         const limitNum = parseInt(limit, 10);
    
    //         // Fetch orders with pagination
    //         const orders = await Order.find()
    //             .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
    //             .skip((pageNum - 1) * limitNum)
    //             .limit(limitNum)
    //             .populate('user', 'firstname lastname email') // Populate user details if needed
    //             .populate('orderItems.product'); // Populate product details in order items
    
    //         // Get total order count for pagination info
    //         const totalOrders = await Order.countDocuments();
    
    //         res.status(200).json({
    //             orders,
    //             pagination: {
    //                 currentPage: pageNum,
    //                 totalPages: Math.ceil(totalOrders / limitNum),
    //                 totalOrders
    //             }
    //         });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find();
            if(!orders){
                return res.status(404).json({error: 'No orders found'})
            }
            res.json(orders)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getSingleOrder: async (req, res) => {
        try {
            const orderId = req.params.id;

            const order = await Order.findById(orderId);

            if(!order){
                return res.status(404).json({error: 'Order Not found'})
            }
            res.json(order)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getUserPurchaseHistory: async (req, res) => {
        try {
            const userId = req.user._id;

            // Find orders associated with the user
            const orders = await Order.find({ user: userId });
    
            if (orders.length === 0) {
                return res.status(404).json({ error: 'No orders found' });
            }
    
            res.json(orders);
        } catch (error) {

            return res.status(500).json({ error: error.message });
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