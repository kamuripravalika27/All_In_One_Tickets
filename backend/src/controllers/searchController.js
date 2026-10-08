const demoProvider = require('../adapters/demoProvider');

const INDIAN_CITIES = [
  { code: 'HYD', name: 'Hyderabad', state: 'Telangana', airport: 'Rajiv Gandhi International Airport (HYD)', railwayStation: 'Secunderabad Junction (SC)' },
  { code: 'BGA', name: 'Bengaluru', state: 'Karnataka', airport: 'Kempegowda International Airport (BLR)', railwayStation: 'KSR Bengaluru City Junction (SBC)' },
  { code: 'BZA', name: 'Vijayawada', state: 'Andhra Pradesh', airport: 'Vijayawada International Airport (VGA)', railwayStation: 'Vijayawada Junction (BZA)' },
  { code: 'MAA', name: 'Chennai', state: 'Tamil Nadu', airport: 'Chennai International Airport (MAA)', railwayStation: 'Chennai Central (MAS)' },
  { code: 'BOM', name: 'Mumbai', state: 'Maharashtra', airport: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', railwayStation: 'Mumbai Chhatrapati Shivaji Maharaj Terminus (CSMT)' },
  { code: 'DEL', name: 'Delhi', state: 'Delhi', airport: 'Indira Gandhi International Airport (DEL)', railwayStation: 'New Delhi Railway Station (NDLS)' },
  { code: 'VTZ', name: 'Visakhapatnam', state: 'Andhra Pradesh', airport: 'Visakhapatnam International Airport (VTZ)', railwayStation: 'Visakhapatnam Junction (VSKP)' },
  { code: 'PUN', name: 'Pune', state: 'Maharashtra', airport: 'Pune Airport (PNQ)', railwayStation: 'Pune Junction (PUNE)' },
  { code: 'TPTY', name: 'Tirupati', state: 'Andhra Pradesh', airport: 'Tirupati Airport (TIR)', railwayStation: 'Tirupati Main (TPTY)' },
  { code: 'CCU', name: 'Kolkata', state: 'West Bengal', airport: 'Netaji Subhash Chandra Bose International Airport (CCU)', railwayStation: 'Howrah Junction (HWH)' }
];

exports.getCities = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      cities: INDIAN_CITIES
    });
  } catch (error) {
    next(error);
  }
};

exports.unifiedSearch = async (req, res, next) => {
  try {
    const { from, to, date, mode } = req.query;

    if (!from || !to) {
      return res.status(400).json({ success: false, message: 'Please select origin and destination cities.' });
    }

    if (from.toLowerCase() === to.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Source and destination cities must be different.' });
    }

    let results = {};
    if (!mode || mode === 'train') {
      results.trains = await demoProvider.searchTrains({ sourceCity: from, destinationCity: to, date });
    }
    if (!mode || mode === 'flight') {
      results.flights = await demoProvider.searchFlights({ sourceCity: from, destinationCity: to, date });
    }
    if (!mode || mode === 'bus') {
      results.buses = await demoProvider.searchBuses({ sourceCity: from, destinationCity: to, date });
    }

    return res.json({
      success: true,
      query: { from, to, date, mode },
      results
    });
  } catch (error) {
    next(error);
  }
};
