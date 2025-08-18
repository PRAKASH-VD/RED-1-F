import React from "react";

const PropertyCard = ({ property, inCart, onAdd, onRemove, onView }) => (
  <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between hover:shadow-lg transition">
    <div className="space-y-2">
      <img
        src={property.image}
        alt={property.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-xl font-semibold">{property.name}</h2>
      <p className="text-sm text-gray-500">{property.type} • {property.location}</p>
      <p className="text-blue-600 font-bold">${property.price}</p>
      <p className="text-sm text-gray-600">
        {property.size} sqft • {property.rooms} rooms
      </p>
      <p className="text-sm text-gray-500 line-clamp-2">{property.description}</p>
    </div>

    <div className="mt-4 flex gap-2">
      <button
        onClick={onView}
        className="flex-1 border border-blue-500 text-blue-600 px-3 py-2 rounded hover:bg-blue-50"
      >
        View
      </button>
      {inCart ? (
        <button
          onClick={onRemove}
          className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
        >
          Remove
        </button>
      ) : (
        <button
          onClick={onAdd}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      )}
    </div>
  </div>
);

export default PropertyCard;
