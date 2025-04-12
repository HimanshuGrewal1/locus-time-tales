
// This is a mock Google Maps implementation for demonstration purposes
// In a production app, you would use the actual Google Maps JavaScript API
window.google = {
  maps: {
    Map: class MockMap {
      constructor(element, options) {
        this.element = element;
        this.options = options;
        this.markers = [];
        this.circles = [];
        
        // Create a mock map interface
        element.style.backgroundColor = '#e8eaed';
        element.innerHTML = `
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #5f6368; font-family: sans-serif;">
            <div style="background: #fff; padding: 16px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); width: 80%; max-width: 400px; text-align: center;">
              <div style="font-size: 18px; margin-bottom: 8px; font-weight: 500;">Map Simulation</div>
              <div style="font-size: 14px; margin-bottom: 12px;">This is a simulated map for the demo.</div>
              <div style="font-size: 14px; color: #1a73e8;">In a production app, this would be a real Google Map.</div>
            </div>
          </div>
        `;
      }
      
      setCenter(latLng) {
        this.options.center = latLng;
      }
    },
    
    Marker: class MockMarker {
      constructor(options) {
        this.options = options;
        this.listeners = {};
      }
      
      setMap(map) {
        this.map = map;
        if (map) map.markers.push(this);
      }
      
      setPosition(latLng) {
        this.options.position = latLng;
      }
      
      addListener(event, callback) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(callback);
        return { remove: () => {} };
      }
    },
    
    Circle: class MockCircle {
      constructor(options) {
        this.options = options;
      }
      
      setMap(map) {
        this.map = map;
        if (map) map.circles.push(this);
      }
    },
    
    LatLng: class MockLatLng {
      constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
      }
      
      lat() {
        return this.lat;
      }
      
      lng() {
        return this.lng;
      }
    },
    
    SymbolPath: {
      CIRCLE: 0,
      BACKWARD_CLOSED_ARROW: 1,
      FORWARD_CLOSED_ARROW: 2,
    },
    
    Animation: {
      DROP: 'DROP',
      BOUNCE: 'BOUNCE',
    },
  },
};
