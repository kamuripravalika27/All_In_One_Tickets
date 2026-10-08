const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema(
  {
    transportType: { type: String, enum: ['train', 'flight', 'bus'], required: true },
    transportId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    status: { type: String, enum: ['ON_TIME', 'DELAYED', 'CANCELLED'], default: 'ON_TIME' },
    dynamicPriceMultiplier: { type: Number, default: 1.0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Schedule', scheduleSchema);
