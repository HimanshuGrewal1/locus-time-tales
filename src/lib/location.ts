
// Location utilities for the app

// Calculate distance between two coordinates in meters
export function getDistanceBetweenCoordinates(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Check if user is within radius of a capsule
export function isWithinRadius(
  userLat: number,
  userLng: number,
  capsuleLat: number,
  capsuleLng: number,
  radiusMeters: number
): boolean {
  const distance = getDistanceBetweenCoordinates(
    userLat,
    userLng,
    capsuleLat,
    capsuleLng
  );
  return distance <= radiusMeters;
}

// Generate a random point within a radius for demo purposes
export function getRandomPointInRadius(
  centerLat: number,
  centerLng: number,
  radiusMeters: number
): { lat: number; lng: number } {
  // Convert radius from meters to degrees (approximate)
  const radiusLat = radiusMeters / 111000; // 1 degree latitude is approx 111km
  const radiusLng =
    radiusMeters / (111000 * Math.cos((centerLat * Math.PI) / 180)); // Adjust for longitude

  // Generate random point
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomRadius = Math.sqrt(Math.random()) * radiusMeters;

  const offsetLat = (randomRadius * Math.cos(randomAngle)) / 111000;
  const offsetLng =
    (randomRadius * Math.sin(randomAngle)) /
    (111000 * Math.cos((centerLat * Math.PI) / 180));

  return {
    lat: centerLat + offsetLat,
    lng: centerLng + offsetLng,
  };
}

// Mock getting user's current location for development
export function mockCurrentLocation(): Promise<GeolocationPosition> {
  // Return a Promise to simulate the geolocation API
  return new Promise((resolve) => {
    // Simulate a delay
    setTimeout(() => {
      // Default to a location (can be anything for demo)
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      resolve(mockPosition);
    }, 500);
  });
}

// Get the user's current position
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
}

// Monitor the user's position for changes
export function watchPosition(
  onPositionChange: (position: GeolocationPosition) => void,
  onError?: (error: GeolocationPositionError) => void
): () => void {
  if (!navigator.geolocation) {
    if (onError) {
      onError({
        code: 0,
        message: "Geolocation is not supported by this browser",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    }
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    onPositionChange,
    onError,
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}
