import React, { useEffect, useState } from "react";
import axios from "axios";

const OngoingProjectCard = ({ project }) => {
  const {
    projectName,
    progress,
    status,
    // budget: { allotted, available, utilized },
    // startCoordinates,
    // endCoordinates,
  } = project;

  // State to store the locations
  // const [startLocation, setStartLocation] = useState(null);
  // const [endLocation, setEndLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch location details using OpenCage API
  const fetchLocation = async (lat, lng) => {
    const url = `${process.env.REACT_APP_OPENCAGE_URL}?q=${lat}+${lng}&key=${process.env.REACT_APP_OPENCAGE_KEY}`;
    try {
      const response = await axios.get(url);
      const location = response.data.results[0].formatted;
      return location;
    } catch (error) {
      console.error("Error fetching location:", error);
      return "Location not found";
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const start = await fetchLocation(startCoordinates.lat, startCoordinates.lng);
  //     const end = await fetchLocation(endCoordinates.lat, endCoordinates.lng);
  //     setStartLocation(start);
  //     setEndLocation(end);
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, [startCoordinates, endCoordinates]);

  // Format the numbers to avoid scientific notation and round to the nearest integer
  const formatCurrency = (value) => {
    const roundedValue = Math.round(value); // Round to nearest whole number
    return `₹${roundedValue.toLocaleString("en-IN")}`; // Convert to INR format
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
      <h2 className="text-xl font-bold">{projectName}</h2>

      {/* Display progress as a green bar */}
      <div className="my-4">
        <p className="text-gray-700 mb-2">Progress:</p>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600">
                {progress}%
              </span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-green-500 text-xs leading-none py-1 text-center text-white"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Project status */}
      <p className="text-gray-700">Status: {status}</p>
{/* 
      Budget details
      <div className="my-2">
        <p className="text-gray-700">Budget Allotted: {formatCurrency(allotted)}</p>
        <p className="text-gray-700">Budget Available: {formatCurrency(available)}</p>
        <p className="text-gray-700">Budget Utilized: {formatCurrency(utilized)}</p>
      </div> */}

      {/* Coordinates (Start and End locations)
      <div className="mt-4">
        {loading ? (
          <p>Loading locations...</p>
        ) : (
          <>
            <p className="text-gray-700">
              <strong>Start Location:</strong> {startLocation}
            </p>
            <p className="text-gray-700">
              <strong>End Location:</strong> {endLocation}
            </p>
          </>
        )}
      </div> */}
    </div>
  );
};

export default OngoingProjectCard;
