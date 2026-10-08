const mongoose = require('mongoose');

const trainClassSchema = new mongoose.Schema({
  className: { type: String, required: true }, // e.g., '1AC', '2AC', '3AC', 'SL', 'CC', '2S'
  code: { type: String, required: true },
  fare: { type: Number, required: true },
  seatsAvailable: { type: Number, default: 50 },
  status: { type: String, default: 'AVAILABLE' } // AVAILABLE, RAC, WL
});

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true, unique: true, index: true },
    trainName: { type: String, required: true },
    sourceCity: { type: String, required: true, index: true },
    destinationCity: { type: String, required: true, index: true },
    departureStation: { type: String, required: true },
    arrivalStation: { type: String, required: true },
    departureTime: { type: String, required: true }, // "06:00 AM"
    arrivalTime: { type: String, required: true }, // "02:30 PM"
    duration: { type: String, required: true }, // "8h 30m"
    runningDays: [{ type: String }], // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    classes: [trainClassSchema],
    isActive: { type: Boolean, default: true },
    demoNotice: { type: String, default: 'Demo railway schedule. Not an official IRCTC ticket.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Train', trainSchema);
