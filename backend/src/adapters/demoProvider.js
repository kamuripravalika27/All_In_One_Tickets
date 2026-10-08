const BaseTransportAdapter = require('./baseAdapter');
const Train = require('../models/Train');
const Flight = require('../models/Flight');
const Bus = require('../models/Bus');

class DemoProviderAdapter extends BaseTransportAdapter {
  constructor() {
    super('OneTrip Internal Demo Engine');
  }

  async searchTrains({ sourceCity, destinationCity, date }) {
    const query = {};
    if (sourceCity) query.sourceCity = new RegExp(`^${sourceCity}$`, 'i');
    if (destinationCity) query.destinationCity = new RegExp(`^${destinationCity}$`, 'i');
    query.isActive = true;

    const trains = await Train.find(query);
    return trains.map(t => ({
      ...t.toObject(),
      provider: this.providerName,
      isRealTime: false
    }));
  }

  async searchFlights({ sourceCity, destinationCity, date }) {
    const query = {};
    if (sourceCity) query.sourceCity = new RegExp(`^${sourceCity}$`, 'i');
    if (destinationCity) query.destinationCity = new RegExp(`^${destinationCity}$`, 'i');
    query.isActive = true;

    const flights = await Flight.find(query);
    return flights.map(f => ({
      ...f.toObject(),
      provider: this.providerName,
      isRealTime: false
    }));
  }

  async searchBuses({ sourceCity, destinationCity, date }) {
    const query = {};
    if (sourceCity) query.sourceCity = new RegExp(`^${sourceCity}$`, 'i');
    if (destinationCity) query.destinationCity = new RegExp(`^${destinationCity}$`, 'i');
    query.isActive = true;

    const buses = await Bus.find(query);
    return buses.map(b => ({
      ...b.toObject(),
      provider: this.providerName,
      isRealTime: false
    }));
  }

  async getStatus() {
    return {
      providerName: this.providerName,
      isLive: false,
      status: 'OPERATIONAL',
      message: 'Running simulated demo schedule engine with high-fidelity database models.'
    };
  }
}

module.exports = new DemoProviderAdapter();
