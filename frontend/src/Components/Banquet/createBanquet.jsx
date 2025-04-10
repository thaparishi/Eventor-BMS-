import React, { useState, useEffect } from "react";
import "./createBanquet.css";

function Banquet() {
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search for location suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (locationInput.length < 3) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationInput
          )}&limit=5&countrycodes=np`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (locationInput) fetchSuggestions();
    }, 500);

    return () => clearTimeout(timer);
  }, [locationInput]);

  const handleLocationSelect = (suggestion) => {
    setLocationInput(suggestion.display_name);
    setSelectedLocation({
      name: suggestion.display_name.split(',')[0], // Extract the main place name
      fullName: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon
    });
    setSuggestions([]);
  };

  return (
    <div className="auth-container">
      <section id="create-banquet">
        <h1>Create Banquet</h1>
        <form
          className="create-banquet-form"
          method="POST"
          action="/api/createBanquet"
          encType="multipart/form-data"
        >
          <div className="email-field">
            <input
              type="name"
              id="name"
              name="name"
              placeholder="Banquet Name"
              required
            />
          </div>

          <div className="email-field">
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price Per Plate"
              max="1000"
              required
              onChange={(e) => {
                if (e.target.value > 1000) {
                  e.target.value = 1000;
                }
              }}
            />
          </div>

          <div className="password-field">
            <textarea
              type="desc"
              id="desc"
              name="desc"
              placeholder="Description"
              minLength={50}
              required
            />
          </div>

          <div className="location-field" style={{ margin: "20px 50px", position: "relative" }}>
            <input
              type="text"
              name="location_input"
              placeholder="Search location..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              autoComplete="off"
              required
            />
            
            {/* Hidden fields to store coordinates */}
            <input type="hidden" name="location" value={selectedLocation?.name || ""} />
            <input type="hidden" name="location_lat" value={selectedLocation?.lat || ""} />
            <input type="hidden" name="location_lon" value={selectedLocation?.lon || ""} />
            
            {loading && <div className="loading-spinner">Loading...</div>}
            
            {suggestions.length > 0 && (
              <ul className="location-suggestions">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="image-field">
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg"
              id="image-field"
              required
            />
          </div>

          <div className="create-banquet-btnn">
            <button type="submit" className="btnn">
              Create Banquet
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Banquet;