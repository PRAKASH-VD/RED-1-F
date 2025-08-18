import React, { useState, useEffect } from "react";

const defaultFilters = { q: "", location: "", minPrice: "", maxPrice: "", type: "", rooms: "" };

const PropertyFilters = ({ onChange, initial = {} }) => {
  const [filters, setFilters] = useState({ ...defaultFilters, ...initial });

  useEffect(() => { onChange(filters); }, [filters]);

  return (
    <div className="bg-white p-4 rounded-md shadow mb-6 grid md:grid-cols-6 gap-3">
      <input placeholder="Search name/desc" className="border p-2 rounded"
        value={filters.q} onChange={(e)=>setFilters({...filters, q:e.target.value})}/>
      <input placeholder="Location" className="border p-2 rounded"
        value={filters.location} onChange={(e)=>setFilters({...filters, location:e.target.value})}/>
      <input type="number" placeholder="Min Price" className="border p-2 rounded"
        value={filters.minPrice} onChange={(e)=>setFilters({...filters, minPrice:e.target.value})}/>
      <input type="number" placeholder="Max Price" className="border p-2 rounded"
        value={filters.maxPrice} onChange={(e)=>setFilters({...filters, maxPrice:e.target.value})}/>
      <select className="border p-2 rounded"
        value={filters.type} onChange={(e)=>setFilters({...filters, type:e.target.value})}>
        <option value="">Type</option>
        <option>Apartment</option>
        <option>Villa</option>
        <option>Independent House</option>
        <option>Commercial</option>
      </select>
      <select className="border p-2 rounded"
        value={filters.rooms} onChange={(e)=>setFilters({...filters, rooms:e.target.value})}>
        <option value="">Rooms</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
        <option value="4">4+</option>
      </select>
    </div>
  );
};

export default PropertyFilters;
