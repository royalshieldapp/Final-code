const LocationService = {
  async fetchCurrent() {
    const lat = 37 + Math.random();
    const lng = -122 + Math.random();
    return { lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)), timestamp: new Date().toISOString() };
  },
};

export default LocationService;
