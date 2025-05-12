import React, { useEffect, useState, useRef } from "react"; 
import API from "../utils/api"; 
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"; 
import L from "leaflet"; 
import "leaflet/dist/leaflet.css"; 
import "../utils/leafletIconFix"; 
import Loading from "../components/LoadingGif/Loading"; 
import HomePage2 from "./HomePage2"; 
import Carousel from "./Carousel"; 
import ThemeCarousel from "./ThemeCarousel";

const HomePage = () => { 
  const [projects, setProjects] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(null); 
  const [hoveredProject, setHoveredProject] = useState(null); 
  const [hoverPosition, setHoverPosition] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const [isScrolling, setIsScrolling] = useState(true); 
  // const [startLocation, setStartLocation] = useState(null); 
  const [endLocation, setEndLocation] = useState(null);

  const listRef = useRef(); 

  // Custom icons for start and end markers
  const startIcon = new L.Icon({ 
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9101/9101314.png", 
    iconSize: [25, 25], 
    iconAnchor: [12, 24], 
  }); 

  const endIcon = new L.Icon({ 
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png", 
    iconSize: [25, 25], 
    iconAnchor: [12, 24], 
  }); 

  // Function to fetch location names using OpenCage API
  const getLocationName = async (lat, lng) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_OPENCAGE_URL}?q=${lat}+${lng}&key=${process.env.REACT_APP_OPENCAGE_KEY}`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        return data.results[0].formatted; // Return the formatted address
      }
      return "Location not found";
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Error fetching location";
    }
  };

  // Fetch projects
  useEffect(() => { 
    const fetchProjects = async () => { 
      try { 
        const response = await API.get("/projects/ongoing"); 
        console.log(response.data.data); 
        setProjects(response.data.data); 
        setLoading(false); 
      } catch (error) { 
        console.error("Error fetching projects:", error); 
        setError("Failed to load projects. Please try again later."); 
        setLoading(false); 
      } 
    }; 
    fetchProjects(); 
  }, []); 

  

  // Infinite scrolling effect
  useEffect(() => { 
    if (!isScrolling || !listRef.current) return; 

    const list = listRef.current; 

    const scroll = () => { 
      list.scrollTop += 1; 
      if (list.scrollTop >= list.scrollHeight / 2) { 
        list.scrollTop = 0; // Reset scroll to start 
      } 
    }; 

    const interval = setInterval(scroll, 30); 
    return () => clearInterval(interval); 
  }, [isScrolling]); 

  // Clone list items for infinite effect
  useEffect(() => { 
    if (!listRef.current) return; 

    const list = listRef.current; 

    const cloneItems = () => { 
      const items = list.children; 
      const clonedItems = Array.from(items).map((item) => item.cloneNode(true)); 
      clonedItems.forEach((item) => list.appendChild(item)); 
    }; 

    cloneItems(); 
    
  }, []); 

  if (loading) { 
    return <Loading />; 
  }

  if (error) { 
    return ( 
      <div className="flex items-center justify-center h-screen"> 
        <p className="text-red-500 font-bold">{error}</p> 
      </div> 
    ); 
  }

  return (
    <>
      <div className="relative bg-[#F8F4F3]"> 
        <div className="hero-section py-12 max-h-[680px]"> 
          <div className="container mx-auto px-6 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Ongoing Projects List Section (1/4th width) */}
            <div 
  className="projects-list overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 shadow-xl rounded-lg p-6 lg:w-1/4 w-full"
  onMouseEnter={() => setIsScrolling(false)}
  onMouseLeave={() => setIsScrolling(true)}
> 
  <h2 className="text-3xl font-serif mb-6 text-center text-gray-700">
    Ongoing Projects
  </h2>

  <div 
    ref={listRef} 
    className="space-y-4" 
    style={{ height: "300px", overflow: "hidden" }}
  > 
    {projects.map((project) => ( 
      <div 
        key={project.id} 
        onClick={() => { 
          setSelectedProject(project); 
          setIsScrolling(false); 
        }} 
        className="cursor-pointer bg-white hover:bg-gray-100 p-4 rounded-lg shadow-md transition-all duration-300"
      > 
        {/* Title as a hyperlink */}
        <a 
          href="#"
          className="text-xl font-serif text-gray-800 hover:text-gray-600"
        >
          {project.projectName}
        </a>
      </div> 
    ))} 
  </div> 
</div>



            {/* Carousel Section (3/4th width) */}
            <div className="lg:w-3/4 w-full">
              <div className="max-h-[680px] overflow-hidden">
                <Carousel />
              </div>
            </div>
          </div> 
        </div> 

        {/* Modal for Project Details */}
        {selectedProject && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg relative">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => { 
                  setSelectedProject(null); 
                  setIsScrolling(true); 
                }}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-4">{selectedProject.projectName}</h3>
              <p>
                <strong>Created At:</strong> {new Date(selectedProject.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <HomePage2 />
        <ThemeCarousel />
      </div>
    </>
  );
};

export default HomePage;