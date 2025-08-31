import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import MapView from '../components/MapView';

function PropertyList() {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Fetch properties with filters
    // ...existing code...
  }, [filters]);

  return (
    <div>
      <FilterBar setFilters={setFilters} />
      <div className="property-list">
        {properties.map(p => <PropertyCard key={p._id} property={p} />)}
      </div>
      <MapView properties={properties} />
    </div>
  );
}

export default PropertyList;