const Product = require('../models/Product');
const Review = require('../models/Review');
const User = require('../models/User');

const reviewController = {
    createReview: async (req, res) => {
        try {
            const userId = req.user._id;
            const productId = req.params.id;
            const { rating, comment} = req.body;

            const review = new Review({
               user: userId,
               product: productId,
               rating,
               comment
            });
            await review.save();

            //Update product's Reviews
            const product = await Product.findById(productId);
            product.review.push(review._id);
            await product.save()
            res.json({message: 'Review submission complete', review})
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    },
    getReviews: async (req, res) => {
        try {
            const productId = req.params.id;

            const review = await Review.find({product: productId}).populate('user', 'firstname')

            res.json(review)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
};
module.exports = reviewController;