const mongoose = require('mongoose');

const flightClassSchema = new mongoose.Schema({
  className: { type: String, enum: ['Economy', 'Premium Economy', 'Business'], default: 'Economy' },
  fare: { type: Number, required: true },
  seatCount: { type: Number, default: 60 },
  baggageAllowance: { type: String, default: '15 kg Check-in, 7 kg Cabin' }
});

const flightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true, unique: true, index: true },
    airlineName: { type: String, required: true }, // Indigo, Air India, Vistara, Akasa Air, SpiceJet
    airlineCode: { type: String, required: true },
    logo: { type: String, default: '' },
    sourceCity: { type: String, required: true, index: true },
    destinationCity: { type: String, required: true, index: true },
    sourceAirport: { type: String, required: true },
    destinationAirport: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    stops: { type: Number, default: 0 }, // 0 = Non-stop, 1 = 1 Stop
    classes: [flightClassSchema],
    runningDays: [{ type: String }],
    isActive: { type: Boolean, default: true },
    demoNotice: { type: String, default: 'Demo flight schedule. Not an official airline PNR.' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', flightSchema);
