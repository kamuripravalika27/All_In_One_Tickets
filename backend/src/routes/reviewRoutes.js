const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', reviewController.getReviews);
router.post('/create', protect, reviewController.createReview);

module.exports = router;
