const Bus = require('../models/Bus');
const BusSeatInventory = require('../models/BusSeatInventory');

exports.searchBuses = async (req, res, next) => {
  try {
    const { from, to, date, busType, amenity, maxPrice } = req.query;

    const query = { isActive: true };
    if (from) query.sourceCity = new RegExp(`^${from}$`, 'i');
    if (to) query.destinationCity = new RegExp(`^${to}$`, 'i');
    if (busType) query.busType = new RegExp(busType, 'i');

    let buses = await Bus.find(query);

    if (amenity) {
      buses = buses.filter(b => b.amenities.includes(amenity));
    }
    if (maxPrice) {
      buses = buses.filter(b => b.fare <= Number(maxPrice));
    }

    return res.json({
      success: true,
      count: buses.length,
      buses
    });
  } catch (error) {
    next(error);
  }
};

exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found.' });
    }
    return res.json({ success: true, bus });
  } catch (error) {
    next(error);
  }
};

exports.getBusSeatLayout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // YYYY-MM-DD
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found.' });
    }

    const journeyDate = date || new Date().toISOString().split('T')[0];

    let inventory = await BusSeatInventory.findOne({ busId: id, date: journeyDate });

    if (!inventory) {
      // Generate default seat layout if missing
      const seats = [];
      const total = bus.totalSeats || 36;
      const isSleeper = bus.busType.toLowerCase().includes('sleeper');

      for (let i = 1; i <= total; i++) {
        const deck = i <= total / 2 ? 'Lower' : 'Upper';
        const seatNo = isSleeper ? `${deck === 'Lower' ? 'L' : 'U'}${i}` : `S${i}`;
        // Mark some seats as booked for demo realism
        const isBooked = [3, 7, 12, 18, 22].includes(i);

        seats.push({
          seatNo,
          deck,
          row: Math.ceil(i / 3),
          column: (i % 3) + 1,
          type: isSleeper ? 'Sleeper' : 'Seater',
          price: isSleeper ? bus.fare + 200 : bus.fare,
          status: isBooked ? 'booked' : 'available',
          genderPreference: 'any'
        });
      }

      inventory = await BusSeatInventory.create({
        busId: id,
        date: journeyDate,
        seats
      });
    }

    return res.json({
      success: true,
      bus,
      date: journeyDate,
      seats: inventory.seats
    });
  } catch (error) {
    next(error);
  }
};
