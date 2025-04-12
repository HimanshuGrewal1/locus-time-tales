
// Type definitions for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
        LatLng: any;
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
          HYBRID: string;
          TERRAIN: string;
        };
        Circle: any;
        SymbolPath: {
          CIRCLE: number;
          BACKWARD_CLOSED_ARROW: number;
          FORWARD_CLOSED_ARROW: number;
        };
        event: {
          addListener: (
            instance: any,
            eventName: string,
            handler: Function
          ) => any;
        };
        MapsEventListener: any;
      };
    };
  }
}

export {};
