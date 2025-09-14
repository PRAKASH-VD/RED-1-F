import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Very simple forward geocoding using OpenStreetMap nominatim is BE task.
// Here we accept lat/lng if backend provides, else map centers to a default.
const PropertyMap = ({ properties }) => {
  return (
    <div>
      {properties
        .filter(
          (property) =>
            property.location &&
            typeof property.location.lat === "number" &&
            typeof property.location.lng === "number" &&
            !isNaN(property.location.lat) &&
            !isNaN(property.location.lng)
        )
        .map((property) => (
          <div key={property._id} className="w-full h-80 rounded overflow-hidden">
            <MapContainer
              center={[property.location.lat, property.location.lng]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[property.location.lat, property.location.lng]}>
                <Popup>{property.locationText || "Property Location"}</Popup>
              </Marker>
            </MapContainer>
          </div>
        ))}
    </div>
  );
};

export default PropertyMap;
