import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { GiIndianPalace } from "react-icons/gi";
import { AiOutlineSearch } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import "./displayBanquet.css";

const DisplayBanquet = () => {
  const [banquetData, setBanquetData] = useState([]);
  const [searchBanquetValue, setSearchBanquetValue] = useState("");
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const { token } = useParams();
  const [noDataFound, setNoDataFound] = useState(false);
  const [range, setRange] = useState([100, 1000]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  // Fetch all banquets as fallback
  const fetchAllBanquets = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/getBanquet/${token || 'default'}`);
      const data = await response.json();
      setBanquetData(data);
    } catch (error) {
      console.error("Error fetching banquets:", error);
      setNoDataFound(true);
    }
  };

  // Fetch banquets near a location
  const fetchNearbyBanquets = async (lat, lon) => {
    try {
      setLocationLoading(true);
      const response = await axios.get(`/api/getNearbyBanquets/${lat}/${lon}`);
      if (response.data && response.data.length > 0) {
        setBanquetData(response.data);
      } else {
        // If no nearby banquets found, fall back to all banquets
        await fetchAllBanquets();
      }
    } catch (error) {
      console.error("Error fetching nearby banquets:", error);
      // Fall back to all banquets on error
      await fetchAllBanquets();
    } finally {
      setLocationLoading(false);
    }
  };

  // Get user location
  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          fetchNearbyBanquets(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to access your location. Showing all available banquets.");
          fetchAllBanquets();
          setLocationLoading(false);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser. Showing all available banquets.");
      fetchAllBanquets();
      setLocationLoading(false);
    }
  };

  // Fetch location suggestions for search
  const fetchLocationSuggestions = async (query) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&countrycodes=np`
      );
      const data = await response.json();
      setLocationSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setLocationSuggestions([]);
    }
  };

  // Handle selecting a location from suggestions
  const handleSelectLocationSuggestion = (suggestion) => {
    setLocationSearchValue(suggestion.display_name);
    setShowLocationSuggestions(false);
    
    // Update user location and fetch banquets near this location
    setUserLocation({ lat: suggestion.lat, lon: suggestion.lon });
    fetchNearbyBanquets(suggestion.lat, suggestion.lon);
  };

  // Handle changes to banquet search input
  const handleInput = (e) => {
    setSearchBanquetValue(e.target.value);
    setNoDataFound(false);
    if (e.target.value === "") {
      // If user clears search, return to location-based results or all banquets
      if (userLocation) {
        fetchNearbyBanquets(userLocation.lat, userLocation.lon);
      } else {
        fetchAllBanquets();
      }
    }
  };

  // Handle changes to location search input
  const handleLocationSearchInput = (e) => {
    setLocationSearchValue(e.target.value);
    setShowLocationSuggestions(true);
    fetchLocationSuggestions(e.target.value);
  };

  // Handle search for banquet by name
  const handleSearchBanquet = async (e) => {
    e.preventDefault();
    if (!searchBanquetValue.trim()) return;
    
    setLocationLoading(true);
    try {
      const response = await axios.get(
        `/api/filterBanquetName/${searchBanquetValue}`
      );
      if (response.data === "unsucessful") {
        setNoDataFound(true);
      } else {
        setBanquetData(response.data);
        setNoDataFound(false);
      }
    } catch (error) {
      console.error("Error searching for banquet:", error);
      setNoDataFound(true);
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle price range changes
  async function handleChanges(event, newValue) {
    setRange(newValue);
    setNoDataFound(false);
    setLocationLoading(true);
    
    try {
      const response = await axios.get(`/api/filterBanquetPrice/${newValue[0]},${newValue[1]}`);
      if (response.data === "unsucessful") {
        setNoDataFound(true);
      } else {
        setBanquetData(response.data);
      }
    } catch (error) {
      console.error("Error filtering by price:", error);
      setNoDataFound(true);
    } finally {
      setLocationLoading(false);
    }
  }

  // Sort banquets by price (ascending)
  const sortAscending = async () => {
    setLocationLoading(true);
    try {
      const response = await axios.get(`/api/filterBanquetAscending`);
      setBanquetData(response.data);
    } catch (error) {
      console.error("Error sorting banquets:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Sort banquets by price (descending)
  const sortDescending = async () => {
    setLocationLoading(true);
    try {
      const response = await axios.get(`/api/filterBanquetDescending`);
      setBanquetData(response.data);
    } catch (error) {
      console.error("Error sorting banquets:", error);
    } finally {
      setLocationLoading(false);
    }
  };

  // Request location and load banquets when component mounts
  useEffect(() => {
    if (token) {
      fetchAllBanquets();
    } else {
      getUserLocation();
    }
    
    // Click outside to close location suggestions
    const handleClickOutside = (event) => {
      if (!event.target.closest('.location-search-field')) {
        setShowLocationSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [token]);

  return (
    <>
      <div className="bodddy">
        <div className="book-banquet-container">
          <div className="display-banquet-container">
            <div className="select-hall">
              <GiIndianPalace className="hall-icon" />
              <h2>Select Banquet Hall</h2>
              {locationLoading && <p className="location-status">Finding banquets near you...</p>}
              {locationError && <p className="location-error">{locationError}</p>}
              {userLocation && !locationError && !locationLoading && (
                <p className="location-status">Showing banquets near your location</p>
              )}
            </div>
            <div className="search-banquet-form">
              {/* Location search with autocomplete */}
              <div className="location-search-field">
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={locationSearchValue}
                  onChange={handleLocationSearchInput}
                  className="location-search-input"
                />
                <MdLocationOn className="location-icon" />
                
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <ul className="location-suggestions">
                    {locationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        onClick={() => handleSelectLocationSuggestion(suggestion)}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form onSubmit={handleSearchBanquet}>
                <input
                  type="search"
                  id="gsearch"
                  name="gsearch"
                  placeholder="Search for banquet"
                  value={searchBanquetValue}
                  onChange={handleInput}
                />
                <button className="btnn" type="submit">
                  <AiOutlineSearch />
                </button>
              </form>

              <div className="sliderr">
                <h3>Please Select Price Range</h3>
                <Slider
                  value={range}
                  min={100}
                  max={1000}
                  onChange={handleChanges}
                  valueLabelDisplay="auto"
                />
                <p>
                  The selected range is {range[0]} - {range[1]}
                </p>
              </div>
              
              <div className="button-asc-desc">
                <button type="button" onClick={sortAscending} disabled={locationLoading}>
                  Sort by Price: Low to High
                </button>
                <button type="button" onClick={sortDescending} disabled={locationLoading}>
                  Sort by Price: High to Low
                </button>
              </div>
            </div>

            {locationLoading && banquetData.length === 0 && (
              <div className="loading-container">
                <p>Loading banquets...</p>
              </div>
            )}

            {!locationLoading && !noDataFound && banquetData.length === 0 && (
              <div className="no-data-container">
                <p>No banquets available. Try a different search or location.</p>
              </div>
            )}

            {!locationLoading && banquetData.length > 0 && !noDataFound &&
              banquetData.map((item) => {
                const {
                  _id,
                  banquet_name,
                  banquet_description,
                  image_location,
                  banquet_location,
                  banquet_price,
                  distance
                } = item;
                return (
                  <div key={_id} className="banquet-container">
                    <img 
                        src={image_location} 
                        alt={`${banquet_name} Banquet`} 
                        onError={(e) => {
                          console.error("Failed to load image:", image_location);
                          e.target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    <div className="banquet-content">
                      <h2>{banquet_name}</h2>
                      <p>
                        <strong>Description: </strong>
                        {banquet_description}
                      </p>
                      <p>
                        <strong>Location:</strong> {banquet_location}
                      </p>
                      {distance && (
                        <p>
                          <strong>Distance:</strong> {distance.toFixed(1)} km from you
                        </p>
                      )}
                      <p>
                        <strong>Price: </strong>
                        {banquet_price}
                      </p>
                      {/* Modified this link to go to bookBanquet first */}
                      <a href={`/bookBanquet/${_id}/${banquet_name}/${banquet_price}`}>
                        <button className="banquet-menu-btn">Book Now</button>
                      </a>
                    </div>
                  </div>
                );
              })}

            {noDataFound && (
              <p
                style={{
                  textAlign: "center",
                  display: "block",
                  fontSize: "40px",
                  fontWeight: "600",
                }}
              >
                NO DATA FOUND
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplayBanquet;