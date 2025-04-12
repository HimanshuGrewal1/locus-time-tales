
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Capsule } from "@/types";
import { getCurrentPosition, isWithinRadius } from "@/lib/location";

interface MapProps {
  capsules: Capsule[];
  onCapsuleSelect: (capsule: Capsule) => void;
}

export function Map({ capsules, onCapsuleSelect }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markerRefs = useRef<{ [key: string]: google.maps.Marker }>({});
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  // Initialize the map
  useEffect(() => {
    const initMap = async () => {
      if (!window.google || !mapRef.current) {
        setError("Google Maps could not be loaded");
        setLoading(false);
        return;
      }

      try {
        // Get user's location
        const position = await getCurrentPosition();
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userPos);

        // Create map centered on user's location
        const map = new google.maps.Map(mapRef.current, {
          center: userPos,
          zoom: 17,
          mapId: "LocusTimeTales",
          disableDefaultUI: true,
          zoomControl: true,
        });

        // Create user marker
        const userMarker = new google.maps.Marker({
          position: userPos,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          },
          title: "Your Location",
        });
        userMarkerRef.current = userMarker;

        setGoogleMap(map);
        setLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Could not access your location");
        setLoading(false);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      // For production, you'd load the Google Maps script dynamically here
      // This is a simplified version for the demo
      setError("Google Maps API not loaded");
      setLoading(false);
    }

    return () => {
      // Cleanup map resources if needed
    };
  }, []);

  // Add capsule markers to the map
  useEffect(() => {
    if (!googleMap || !userLocation) return;

    // Clear existing markers
    Object.values(markerRefs.current).forEach((marker) => {
      marker.setMap(null);
    });
    markerRefs.current = {};

    // Add markers for capsules
    capsules.forEach((capsule) => {
      const isAccessible = isWithinRadius(
        userLocation.lat,
        userLocation.lng,
        capsule.location.lat,
        capsule.location.lng,
        capsule.radius
      );

      const markerColor = isAccessible ? "#8B5CF6" : "#9CA3AF";

      const marker = new google.maps.Marker({
        position: capsule.location,
        map: googleMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: markerColor,
          fillOpacity: 0.7,
          strokeColor: "#FFFFFF",
          strokeWeight: 1,
        },
        title: capsule.title,
      });

      // Add a circle to represent the capsule radius
      const circle = new google.maps.Circle({
        map: googleMap,
        center: capsule.location,
        radius: capsule.radius,
        fillColor: isAccessible ? "#8B5CF6" : "#9CA3AF",
        fillOpacity: 0.1,
        strokeColor: isAccessible ? "#8B5CF6" : "#9CA3AF",
        strokeOpacity: 0.5,
        strokeWeight: 1,
      });

      // Add click handler for the marker
      marker.addListener("click", () => {
        onCapsuleSelect(capsule);
      });

      markerRefs.current[capsule.id] = marker;
    });
  }, [googleMap, capsules, userLocation, onCapsuleSelect]);

  // Watch user's position and update
  useEffect(() => {
    if (!googleMap) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(newPos);

        // Update user marker position
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(newPos);
        }
      },
      (err) => {
        console.error("Error watching position:", err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [googleMap]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
