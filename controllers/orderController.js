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
            const orders = await Order.find()
            .populate('user', 'firstname lastname')
            .populate('address', 'deliveryAddress phone_number city')
            res.json(orders)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getSingleOrder: async (req, res) => {
        try {
            const orderId = req.params.id;
    
            // Find the order and populate user and orderItems with product details
            const order = await Order.findById(orderId)
                .populate({
                    path: 'user',
                    select: 'firstname lastname email phone_number' // Specify the fields to return
                })
                .populate({
                    path: 'orderItems.product', // Assuming orderItems has a field 'product' that references Product
                    select: 'productTitle' // Specify the fields to return from Product
                })
                .populate({
                    path: 'address',
                    select: 'deliveryAddress city phone_number'
                })
    
            if (!order) {
                return res.status(404).json({ error: 'Order Not found' });
            }
    
            // Map the orderItems to include productTitle
            const orderItemsWithTitles = order.orderItems.map(item => {
                return {
                    ...item.toObject(), // Convert Mongoose document to plain object
                    productTitle: item.product ? item.product.productTitle : null // Add productTitle
                };
            });
    
            // Return the order with modified orderItems
            res.json({
                ...order.toObject(), // Convert order to plain object
                orderItems: orderItemsWithTitles // Replace orderItems with the new array
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    ,
    getUserPurchaseHistory: async (req, res) => {
        try {
            const userId = req.user._id;
            // console.log('User ID:', userId);
    
            // Find orders associated with the user
            const orders = await Order.find({ user: userId }).populate('orderItems.product', 'productTitle images')
     
            res.json(orders);
        } catch (error) {
            
            return res.status(500).json({ error: error.message });
        }
    },
    
    updateOrderStatusToCompleted: async (req, res) => {
        try {
            const {orderId} = req.body;

            const order = await Order.findOne({orderId});

            if(order){
                order.status = 'Delivered'
                await order.save();  
            }
            res.json({message: 'Order status updated successfully', order})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
};
module.exports = orderController;