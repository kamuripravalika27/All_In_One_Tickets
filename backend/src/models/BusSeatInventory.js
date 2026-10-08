const mongoose = require('mongoose');

const seatItemSchema = new mongoose.Schema({
  seatNo: { type: String, required: true },
  deck: { type: String, enum: ['Lower', 'Upper'], default: 'Lower' },
  row: { type: Number },
  column: { type: Number },
  type: { type: String, enum: ['Sleeper', 'Seater'], default: 'Seater' },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'booked', 'reserved'], default: 'available' },
  genderPreference: { type: String, enum: ['any', 'female', 'male'], default: 'any' },
  bookedByPassengerId: { type: String, default: null }
});

const busSeatInventorySchema = new mongoose.Schema(
  {
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true, index: true },
    date: { type: String, required: true, index: true }, // Format YYYY-MM-DD
    seats: [seatItemSchema]
  },
  { timestamps: true }
);

busSeatInventorySchema.index({ busId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('BusSeatInventory', busSeatInventorySchema);
