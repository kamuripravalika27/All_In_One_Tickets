const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true }, // e.g. 15 for 15% or 200 for ₹200
    minBookingAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 500 },
    applicableTransport: { type: String, enum: ['ALL', 'train', 'flight', 'bus'], default: 'ALL' },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
