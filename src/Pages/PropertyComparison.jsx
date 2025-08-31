import React, { useState, useEffect } from "react";
import PropertyCard from "../Components/PropertyCard";

const PropertyComparison = () => {
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://red1-1-0-0.onrender.com/api/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch properties", err);
        setLoading(false);
      });
  }, []);

  const toggleSelect = (property) => {
    setSelected((prev) =>
      prev.some((p) => p._id === property._id)
        ? prev.filter((p) => p._id !== property._id)
        : [...prev, property]
    );
  };

  if (loading) return <div>Loading properties...</div>;

  return (
    <div>
      <h2>Compare Properties</h2>
      <div>
        {properties.map((property) => (
          <div key={property._id}>
            <PropertyCard property={property} />
            <button onClick={() => toggleSelect(property)}>
              {selected.some((p) => p._id === property._id)
                ? "Remove from Compare"
                : "Add to Compare"}
            </button>
          </div>
        ))}
      </div>
      <hr />
      <h3>Selected Properties</h3>
      <div style={{ display: "flex", gap: "1rem" }}>
        {selected.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyComparison;