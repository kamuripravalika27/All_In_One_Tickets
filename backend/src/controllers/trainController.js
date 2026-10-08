const Train = require('../models/Train');

exports.searchTrains = async (req, res, next) => {
  try {
    const { from, to, date, class: travelClass, maxPrice } = req.query;

    const query = { isActive: true };
    if (from) query.sourceCity = new RegExp(`^${from}$`, 'i');
    if (to) query.destinationCity = new RegExp(`^${to}$`, 'i');

    let trains = await Train.find(query);

    // Apply filtering
    if (travelClass) {
      trains = trains.filter(t => t.classes.some(c => c.code === travelClass || c.className === travelClass));
    }
    if (maxPrice) {
      trains = trains.filter(t => t.classes.some(c => c.fare <= Number(maxPrice)));
    }

    return res.json({
      success: true,
      count: trains.length,
      trains
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrainById = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train service not found.' });
    }
    return res.json({ success: true, train });
  } catch (error) {
    next(error);
  }
};
