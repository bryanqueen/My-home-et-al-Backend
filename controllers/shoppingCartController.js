const ShoppingCart = require('../models/ShoppingCart');
const OrderItem = require('../models/OrderItem')


const shoppingCartController = {
    addItemToCart: async (req, res) => {
        try {
            const { product, qty, price, subTotalPrice } = req.body;

            // Find user's shopping cart
            let shoppingCart = await ShoppingCart.findOne({ user: req.user._id });

            if (!shoppingCart) {
                shoppingCart = new ShoppingCart({ user: req.user._id, cartItems: [] });
            }

            // Check if the product already exists in the cart
            const existingItemIndex = shoppingCart.cartItems.findIndex(item => item.product.equals(product));

            if (existingItemIndex !== -1) {
                // Update quantity and subtotal for existing item
                const existingItem = shoppingCart.cartItems[existingItemIndex];
                existingItem.qty += qty;
                existingItem.subTotalPrice += subTotalPrice;
            } else {
                // Create new cart item
                const newItem = new OrderItem({ product, qty, price, subTotalPrice });
                shoppingCart.cartItems.push(newItem);
            }

            await shoppingCart.save();

            res.status(201).json({ message: 'Item added to cart successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding item to cart' });
        }
    },
    viewCart: async (req, res) => {
        try {
            // Find user's shopping cart
            const shoppingCart = await ShoppingCart.findOne({ user: req.user._id }).populate('cartItems.product');

            if (!shoppingCart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            res.json(shoppingCart.cartItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while retrieving cart contents' });
        }
    },
    removeItemFromCart: async (req, res) => {
        try {
            const { productId } = req.params;

            // Find user's shopping cart
            const shoppingCart = await ShoppingCart.findOne({ user: req.user._id });

            if (!shoppingCart) {
                return res.status(404).json({ error: 'Cart not found' });
            }

            // Remove the cart item by product ID
            shoppingCart.cartItems = shoppingCart.cartItems.filter(item => !item.product.equals(productId));

            await shoppingCart.save();

            res.json({ message: 'Item removed from cart successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while removing item from cart' });
        }
    },
}