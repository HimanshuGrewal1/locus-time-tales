
// Mock implementation for getCurrentPosition
// In a real app, this would use the browser's Geolocation API

/**
 * Gets the current position of the user
 * @returns Promise that resolves with a GeolocationPosition object
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      // For development/testing, return a mock position
      setTimeout(() => {
        const mockCoords: GeolocationCoordinates = {
          latitude: 37.7749, // San Francisco
          longitude: -122.4194,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: function() {
            return {
              latitude: this.latitude,
              longitude: this.longitude,
              accuracy: this.accuracy,
              altitude: this.altitude,
              altitudeAccuracy: this.altitudeAccuracy,
              heading: this.heading,
              speed: this.speed
            };
          }
        };
        
        const mockPosition: GeolocationPosition = {
          coords: mockCoords,
          timestamp: Date.now(),
        };
        
        resolve(mockPosition);
      }, 100);
    }
  });
};

/**
 * Calculates the distance in meters between two coordinates
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns Distance in meters
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

/**
 * Checks if the user is within a specified radius of a location
 * @param userLat User latitude
 * @param userLng User longitude
 * @param targetLat Target location latitude
 * @param targetLng Target location longitude
 * @param radiusMeters Radius in meters
 * @returns Boolean indicating if user is within the radius
 */
export const isWithinRadius = (
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusMeters: number
): boolean => {
  const distance = calculateDistance(userLat, userLng, targetLat, targetLng);
  return distance <= radiusMeters;
};
