class BaseTransportAdapter {
  constructor(providerName = 'Demo Provider') {
    this.providerName = providerName;
  }

  async searchTrains(params) {
    throw new Error('Method searchTrains must be implemented by provider adapter');
  }

  async searchFlights(params) {
    throw new Error('Method searchFlights must be implemented by provider adapter');
  }

  async searchBuses(params) {
    throw new Error('Method searchBuses must be implemented by provider adapter');
  }

  async getStatus() {
    return {
      providerName: this.providerName,
      isLive: false,
      status: 'OPERATIONAL (DEMO MODE)'
    };
  }
}

module.exports = BaseTransportAdapter;
