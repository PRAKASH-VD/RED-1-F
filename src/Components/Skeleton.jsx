import React from "react";

const Skeleton = ({ height = 20, width = '100%', className = "" }) => (
  <div
    className={`bg-gray-200 animate-pulse rounded ${className}`}
    style={{ height, width }}
  />
);

export default Skeleton;
