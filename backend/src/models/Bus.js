const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true, unique: true, index: true },
    operatorName: { type: String, required: true },
    busType: { 
      type: String, 
      enum: ['AC Sleeper (2+1)', 'AC Seater (2+2)', 'Non-AC Sleeper (2+1)', 'Non-AC Seater (2+2)', 'Volvo AC Multi-Axle Sleeper'], 
      required: true 
    },
    totalSeats: { type: Number, default: 36 },
    sourceCity: { type: String, required: true, index: true },
    destinationCity: { type: String, required: true, index: true },
    boardingPoints: [{ station: String, time: String }],
    droppingPoints: [{ station: String, time: String }],
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    fare: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    amenities: [{ type: String }], // ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket', 'Pillow', 'Reading Light']
    runningDays: [{ type: String }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bus', busSchema);
