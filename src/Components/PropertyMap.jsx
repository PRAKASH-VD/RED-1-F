import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Very simple forward geocoding using OpenStreetMap nominatim is BE task.
// Here we accept lat/lng if backend provides, else map centers to a default.
const PropertyMap = ({ lat, lng, locationText }) => {
  const center = useMemo(() => {
    if (lat && lng) return [lat, lng];
    // fallback center (Bengaluru)
    return [12.9716, 77.5946];
  }, [lat, lng]);

  return (
    <div className="w-full h-80 rounded overflow-hidden">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{locationText || "Property Location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
