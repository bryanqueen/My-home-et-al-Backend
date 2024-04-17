
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
    }
};
module.exports = reviewController;