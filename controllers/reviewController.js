
const Review = require('../models/Review');

const reviewController = {
    createReview: async (req, res) => {
        try {
            const user = req.userId;
            const { rating, comment} = req.body;

            const review = new Review({
               user,
               rating,
               comment
            });
            await review.save();
            res.json({message: 'Review submission complete'})
        } catch (error) {
            return res.status(500).json({error: 'Ooops!! an error occured, please refresh'})
        }
    },
    getReviews: async (req, res) => {
        try {
            const reviews = await Review.find();

            if (!reviews) {
                return res.status(404).json({error: 'No reviews found'})
            }

            res.json(reviews)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
};
module.exports = reviewController;