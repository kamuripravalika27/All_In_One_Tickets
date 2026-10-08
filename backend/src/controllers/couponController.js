const Coupon = require('../models/Coupon');

exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, amount, transportType } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a promo code.' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'This promo code has expired.' });
    }

    if (amount && amount < coupon.minBookingAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount of ₹${coupon.minBookingAmount} required for coupon ${coupon.code}.`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((amount * coupon.discountValue) / 100, coupon.maxDiscount);
    } else {
      discount = Math.min(coupon.discountValue, coupon.maxDiscount);
    }

    return res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Math.round(discount)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true, expiresAt: { $gte: new Date() } });
    return res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};
