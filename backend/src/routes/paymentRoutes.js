const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, paymentController.createPaymentOrder);
router.post('/verify-confirm', protect, paymentController.verifyAndConfirmPayment);

module.exports = router;
