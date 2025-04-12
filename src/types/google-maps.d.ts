
// Type definitions for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        InfoWindow: typeof google.maps.InfoWindow;
        LatLng: typeof google.maps.LatLng;
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
          HYBRID: string;
          TERRAIN: string;
        };
        Circle: typeof google.maps.Circle;
        event: {
          addListener: (
            instance: any,
            eventName: string,
            handler: Function
          ) => google.maps.MapsEventListener;
        };
      };
    };
  }
}

export {};
