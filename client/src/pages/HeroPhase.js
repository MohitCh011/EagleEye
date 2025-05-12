import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from "react-leaflet";
import L from "leaflet";
import API from "../utils/api";
import "leaflet/dist/leaflet.css";
import "./HeroPhase.css";

const HeroPhase = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupProject, setPopupProject] = useState(null);

  // Fetch location names using OpenCage API
  const fetchLocationName = async (lat, lng) => {
    const openCageUrl = process.env.REACT_APP_OPENCAGE_URL;
    const apiKey = process.env.REACT_APP_OPENCAGE_KEY;

    try {
      const response = await fetch(`${openCageUrl}?q=${lat}+${lng}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`OpenCage API Error: ${response.status}`);
      }
      const data = await response.json();
      return data.results[0]?.formatted || "Location Unavailable";
    } catch (err) {
      console.error("Error fetching location name:", err.message);
      return "Location Unavailable";
    }
  };

  // Fetch projects from the backend and enhance with location names
  useEffect(() => {
    const fetchTopProjects = async () => {
      try {
        const response = await API.get("/projects/top/projects");
        const projectsWithNames = await Promise.all(
          response.data.data.map(async (project) => {
            const startName = await fetchLocationName(
              project.startCoordinates.lat,
              project.startCoordinates.lng
            );
            const endName = await fetchLocationName(
              project.endCoordinates.lat,
              project.endCoordinates.lng
            );
            return { ...project, startName, endName };
          })
        );
        setProjects(projectsWithNames);
      } catch (err) {
        console.error("Error fetching projects:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProjects();
  }, []);

  if (loading)
    return (
      <div className="spinner-container">
        <div className="spinner">Loading projects...</div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p className="error-text">{`Error: ${error}`}</p>
      </div>
    );

  return (
    <div className="hero-phase-container">
      <div className="projects-list">
        <h2>Ongoing Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id} onClick={() => setPopupProject(project)}>
              <h3>{project.projectName}</h3>
            </li>
          ))}
        </ul>
        <div className="btn-view-all">
          <a href="/projects" className="view-more">
            View More
          </a>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[20.5937, 78.9629]} // Centered on India
          zoom={5}
          scrollWheelZoom={true}
          maxBounds={[
            [6.462, 68.126], // Southwest corner
            [35.51, 97.402], // Northeast corner
          ]}
          maxBoundsViscosity={1.0}
          minZoom={5}
          maxZoom={10}
          className="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              <Polyline
                positions={[
                  [project.startCoordinates.lat, project.startCoordinates.lng],
                  [project.endCoordinates.lat, project.endCoordinates.lng],
                ]}
                pathOptions={{ color: getRouteColor(index), weight: 4 }}
              >
                <Tooltip>
                  <strong>{project.projectName}</strong>
                </Tooltip>
              </Polyline>
              <Marker position={[project.startCoordinates.lat, project.startCoordinates.lng]} icon={pinIcon}>
                <Popup>
                  <strong>Start Point</strong>
                  <p>{project.startName}</p>
                </Popup>
              </Marker>
              <Marker position={[project.endCoordinates.lat, project.endCoordinates.lng]} icon={pinIcon}>
                <Popup>
                  <strong>End Point</strong>
                  <p>{project.endName}</p>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {popupProject && (
        <div className="custom-popup">
          <div className="popup-content">
            <button className="popup-close" onClick={() => setPopupProject(null)}>
              &times;
            </button>
            <h3>{popupProject.projectName}</h3>
            <p>
              <strong>Start Location:</strong> {popupProject.startName}
            </p>
            <p>
              <strong>End Location:</strong> {popupProject.endName}
            </p>
            <p>
              <strong>Budget:</strong> ₹{popupProject.budget.allotted}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const getRouteColor = (index) => {
  const colors = ["red", "blue", "green", "orange", "purple", "pink", "yellow", "cyan", "brown", "black"];
  return colors[index % colors.length];
};

export default HeroPhase;
