const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    mode: { type: String, enum: ['train', 'flight', 'bus'], required: true },
    sourceCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    distanceKm: { type: Number, default: 500 },
    estimatedDuration: { type: String, default: '6h 00m' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
