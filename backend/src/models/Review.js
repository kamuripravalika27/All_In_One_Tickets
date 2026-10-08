const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    transportType: { type: String, enum: ['train', 'flight', 'bus'], required: true },
    transportId: { type: mongoose.Schema.Types.ObjectId },
    bookingRef: { type: String, default: '' },
    operatorName: { type: String, default: 'OneTrip Service' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verifiedBooking: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
