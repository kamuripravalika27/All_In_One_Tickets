const mongoose = require('mongoose');
const passengerSchema = require('./Passenger');

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, required: true, unique: true, index: true },
    PNR: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    transportType: { type: String, enum: ['train', 'flight', 'bus'], required: true },
    transportId: { type: mongoose.Schema.Types.ObjectId, required: true },
    snapshot: {
      transportName: { type: String, required: true },
      transportNumber: { type: String, required: true },
      operatorName: { type: String, default: '' },
      sourceCity: { type: String, required: true },
      destinationCity: { type: String, required: true },
      departureStation: { type: String, required: true },
      arrivalStation: { type: String, required: true },
      departureTime: { type: String, required: true },
      arrivalTime: { type: String, required: true },
      journeyDate: { type: String, required: true },
      travelClass: { type: String, required: true },
      duration: { type: String, default: '' }
    },
    passengers: [passengerSchema],
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    seatNumbers: [{ type: String }],
    boardingPoint: { type: String, default: '' },
    droppingPoint: { type: String, default: '' },
    totalBaseFare: { type: Number, required: true },
    totalTaxes: { type: Number, required: true },
    serviceFee: { type: Number, default: 20 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    finalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    bookingStatus: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled', 'RAC', 'WaitingList'], default: 'Pending' },
    cancellationDetails: {
      cancelledAt: Date,
      refundAmount: Number,
      cancellationFee: Number,
      reason: String,
      refundStatus: { type: String, enum: ['Not Applicable', 'Processed', 'Pending'], default: 'Not Applicable' }
    },
    demoNotice: { type: String, default: 'DEMO BOOKING RESERVATION. Not valid for actual travel.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
