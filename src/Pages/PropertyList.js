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
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-6 py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
        <FilterBar setFilters={setFilters} />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 mt-6">
          {properties.map(p => <PropertyCard key={p._id} property={p} />)}
        </div>
        <div className="mt-8">
          <MapView properties={properties} />
        </div>
      </div>
    </div>
  );
}

export default PropertyList;