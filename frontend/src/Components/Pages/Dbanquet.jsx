import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { GiIndianPalace } from "react-icons/gi";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import "./Dbanquet.css";

// Helper function to calculate distance between two coordinates (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const Dbanquet = () => {
  const [banquetData, setBanquetData] = useState([]);
  const [sortedBanquetData, setSortedBanquetData] = useState([]);
  const [searchBanquetValue, setSearchBanquetValue] = useState("");
  const { token } = useParams();
  const [noDataFound, setNoDataFound] = useState(false);
  const [range, setRange] = useState([100, 1000]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationAsked, setLocationAsked] = useState(false);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationAsked(true);
        },
        (error) => {
          setLocationError(error.message);
          setLocationAsked(true);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationAsked(true);
    }
  };

  // Sort banquet data by distance from user
  const sortByDistance = (data) => {
    if (!userLocation) return data;
    
    return [...data].sort((a, b) => {
      // Some banquet halls might not have coordinates, we'll put them at the end
      if (!a.latitude || !a.longitude) return 1;
      if (!b.latitude || !b.longitude) return -1;
      
      const distanceA = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        a.latitude,
        a.longitude
      );
      const distanceB = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        b.latitude,
        b.longitude
      );
      return distanceA - distanceB;
    });
  };

  async function handleChanges(event, newValue) {
    setRange(newValue);
    setNoDataFound(false);
    const response = await axios.get(`/api/filterBanquetPrice/${range}`);
    if (response.data === "unsucessful") {
      setNoDataFound(true);
      return;
    }
    const sortedData = sortByDistance(response.data);
    setBanquetData(response.data);
    setSortedBanquetData(sortedData);
  }

  const fetchData = async () => {
    fetch(`http://localhost:8000/api/getBanquet/${token}`)
      .then((response) => response.json())
      .then((data) => {
        setBanquetData(data);
        const sortedData = sortByDistance(data);
        setSortedBanquetData(sortedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInput = (e) => {
    setSearchBanquetValue(e.target.value);
    setNoDataFound(false);
    if (e.target.value === "") {
      fetchData();
    }
  };

  const handleSearchByLocationInput = async (e) => {
    setNoDataFound(false);
    const response = await axios.get(
      `/api/filterBanquetLocation/${e.target.value}`
    );
    if (response.data === "unsucessful") {
      setNoDataFound(true);
      return;
    }
    const sortedData = sortByDistance(response.data);
    setBanquetData(response.data);
    setSortedBanquetData(sortedData);
    if (e.target.value === "") {
      fetchData();
    }
  };

  const handleSearchBanquet = async (e) => {
    e.preventDefault();
    const response = await axios.get(
      `/api/filterBanquetName/${searchBanquetValue}`
    );
    if (response.data === "unsucessful") {
      setNoDataFound(true);
      return;
    }
    const sortedData = sortByDistance(response.data);
    setBanquetData(response.data);
    setSortedBanquetData(sortedData);
  };

  const sortAscending = async () => {
    const response = await axios.get(`/api/filterBanquetAscending`);
    const sortedData = sortByDistance(response.data);
    setBanquetData(response.data);
    setSortedBanquetData(sortedData);
  };

  const sortDescending = async () => {
    const response = await axios.get(`/api/filterBanquetDescending`);
    const sortedData = sortByDistance(response.data);
    setBanquetData(response.data);
    setSortedBanquetData(sortedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Display data to show - either filtered or sorted
  const displayData = sortedBanquetData.length > 0 ? sortedBanquetData : banquetData;

  return (
    <>
      <div className="bodddy">
        <div className="book-banquet-container">
          <div className="display-banquet-container">
            <div className="select-hall">
              <GiIndianPalace className="hall-icon" />
              <h2>Select Banquet Hall</h2>
            </div>
            
            {/* Location access button */}
            {!locationAsked && (
              <div className="location-access-box">
                <p>Get banquet halls near you</p>
                <button onClick={getUserLocation}>Allow Location Access</button>
              </div>
            )}
            
            {locationError && (
              <div className="location-error">
                <p>{locationError}</p>
              </div>
            )}

            <div className="search-banquet-form">
              <div className="location-field">
                <select
                  name="location"
                  value={searchBanquetValue}
                  onChange={(e) => {
                    handleSearchByLocationInput(e);
                  }}
                >
                  <option value="" disabled>
                    Location
                  </option>
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Butwal">Butwal</option>
                  <option value="Janakpur">Janakpur</option>
                  <option value="Hetauda">Hetauda</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Jhapa">Jhapa</option>
                  <option value="Charikot">Charikot</option>
                  <option value="Dharan">Dharan</option>
                  <option value="Birtamod">Birtamod</option>
                  <option value="Dhangadhi">Dhangadhi</option>
                  <option value="Nepalgunj">Nepalgunj</option>
                </select>
              </div>

              <form onSubmit={handleSearchBanquet}>
                <input
                  type="search"
                  id="gsearch"
                  name="gsearch"
                  placeholder="Search for banquet"
                  value={searchBanquetValue}
                  onChange={(e) => {
                    handleInput(e);
                  }}
                />
                <button className="btnn" type="submit">
                  <AiOutlineSearch />
                </button>
              </form>

              <div className="sliderr">
                <h3>Please Select Range</h3>
                <Slider
                  value={range}
                  min={100}
                  max={1000}
                  onChange={handleChanges}
                  valueLabelDisplay="auto"
                />
                {range[1] === 1000 ? (
                  <p>Please select a maximum value</p>
                ) : (
                  <p>
                    The selected range is {range[0]} - {range[1]}
                  </p>
                )}
              </div>
              <div className="button-asc-desc">
                <button type="submit" onClick={() => sortAscending()}>
                  Sort Ascending
                </button>
                <button type="submit" onClick={() => sortDescending()}>
                  Sort Descending
                </button>
              </div>
            </div>

            {!noDataFound &&
              displayData.map((item) => {
                const {
                  _id,
                  banquet_name,
                  banquet_description,
                  image_location,
                  banquet_location,
                  banquet_price,
                  latitude,
                  longitude,
                } = item;
                
                // Calculate distance if we have user location and banquet coordinates
                let distanceText = "";
                if (userLocation && latitude && longitude) {
                  const distance = getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    latitude,
                    longitude
                  );
                  distanceText = ` (${distance.toFixed(1)} km away)`;
                }
                
                return (
                  <div key={_id} className="banquet-container">
                    <img 
                      src={`http://localhost:3000/banquet-Images/${image_location}`} 
                      alt="Banquet" 
                    />    
                    <div className="banquet-content">
                      <h2>{banquet_name}{distanceText}</h2>
                      <p>
                        <strong>Description: </strong>
                        {banquet_description}
                      </p>
                      <p>
                        <strong>Location:</strong> {banquet_location}
                      </p>
                      <p>
                        <strong>Price: </strong>
                        {banquet_price}
                      </p>
                      <a
                        href={`/DisplayMenu/${_id}/${token}/${banquet_name}/${banquet_price}`}
                      >
                        <button className="banquet-menu-btn">Continue</button>
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

export default Dbanquet;