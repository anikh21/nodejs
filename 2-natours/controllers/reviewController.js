const Review = require('../models/reviewModel');
const {
    deleteOne,
    updateOne,
    createOne,
    getOne,
    getAll,
} = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.createReview = createOne(Review);
exports.getReview = getOne(Review);
exports.getAllReviews = getAll(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
