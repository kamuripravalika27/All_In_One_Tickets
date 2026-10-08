const Flight = require('../models/Flight');

exports.searchFlights = async (req, res, next) => {
  try {
    const { from, to, date, returnDate, tripType, airline, class: travelClass, maxPrice } = req.query;

    const query = { isActive: true };
    if (from) query.sourceCity = new RegExp(`^${from}$`, 'i');
    if (to) query.destinationCity = new RegExp(`^${to}$`, 'i');
    if (airline) query.airlineName = new RegExp(airline, 'i');

    let outboundFlights = await Flight.find(query);
    let returnFlights = [];

    if (tripType === 'round' && returnDate) {
      const returnQuery = {
        isActive: true,
        sourceCity: new RegExp(`^${to}$`, 'i'),
        destinationCity: new RegExp(`^${from}$`, 'i')
      };
      returnFlights = await Flight.find(returnQuery);
    }

    if (maxPrice) {
      outboundFlights = outboundFlights.filter(f => f.classes.some(c => c.fare <= Number(maxPrice)));
      returnFlights = returnFlights.filter(f => f.classes.some(c => c.fare <= Number(maxPrice)));
    }

    return res.json({
      success: true,
      tripType: tripType || 'oneway',
      outbound: outboundFlights,
      inbound: returnFlights
    });
  } catch (error) {
    next(error);
  }
};

exports.getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ success: false, message: 'Flight not found.' });
    }
    return res.json({ success: true, flight });
  } catch (error) {
    next(error);
  }
};
