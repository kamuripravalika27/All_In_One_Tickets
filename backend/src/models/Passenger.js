const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  berthPreference: { type: String, default: 'No Preference' }, // Lower, Upper, Middle, Side Lower, Side Upper, Window
  seatNumber: { type: String, default: '' },
  idType: { type: String, default: 'Aadhaar' },
  idNumber: { type: String, default: '' }
});

module.exports = passengerSchema;
