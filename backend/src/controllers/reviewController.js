const Review = require('../models/Review');

exports.getReviews = async (req, res, next) => {
  try {
    const { transportType, transportId } = req.query;
    const query = {};
    if (transportType) query.transportType = transportType;
    if (transportId) query.transportId = transportId;

    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(20);
    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 4.8;

    return res.json({
      success: true,
      count: total,
      avgRating: Number(avgRating),
      reviews
    });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { transportType, transportId, bookingRef, rating, comment, operatorName } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      transportType: transportType || 'bus',
      transportId,
      bookingRef: bookingRef || '',
      operatorName: operatorName || 'OneTrip Partner',
      rating: Number(rating),
      comment,
      verifiedBooking: true
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Review submitted.',
      review
    });
  } catch (error) {
    next(error);
  }
};
