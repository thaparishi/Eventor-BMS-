import React, { useState, useEffect } from "react";
import "./createBanquet.css";

function Banquet() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    desc: "",
  });
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Form validation function
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate banquet name - no spaces allowed
    if (formData.name.startsWith(" ")) {
      formErrors.name = "Banquet name cannot start with a space";
      isValid = false;
    }

    // Validate price - must be positive
    if (formData.price <= 0) {
      formErrors.price = "Price must be a positive number";
      isValid = false;
    }

    // Validate location - must be selected
    if (!selectedLocation) {
      formErrors.location = "Please select a location";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Search for location suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (locationInput.length < 3 || !showSuggestions) {
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
  }, [locationInput, showSuggestions]);

  const handleLocationSelect = (suggestion) => {
    setLocationInput(suggestion.display_name);
    setSelectedLocation({
      name: suggestion.display_name.split(',')[0], // Extract the main place name
      fullName: suggestion.display_name,
      lat: suggestion.lat,
      lon: suggestion.lon
    });
    setSuggestions([]);
    setShowSuggestions(false); // Stop showing suggestions after selection
    setErrors({...errors, location: ""});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // If validation passes, submit the form
      e.target.submit();
    }
  };

  const handleLocationFocus = () => {
    // Re-enable suggestions when user focuses on the input again
    setShowSuggestions(true);
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
          onSubmit={handleSubmit}
        >
          <div className="email-field">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Banquet Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="email-field">
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price Per Plate"
              value={formData.price}
              onChange={handleInputChange}
              min="1"
              max="1000"
              required
            />
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>

          <div className="password-field">
            <textarea
              id="desc"
              name="desc"
              placeholder="Description"
              value={formData.desc}
              onChange={handleInputChange}
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
              onFocus={handleLocationFocus}
              autoComplete="off"
              required
            />
            
            {/* Hidden fields to store coordinates */}
            <input type="hidden" name="location" value={selectedLocation?.name || ""} />
            <input type="hidden" name="location_lat" value={selectedLocation?.lat || ""} />
            <input type="hidden" name="location_lon" value={selectedLocation?.lon || ""} />
            
            {loading && <div className="loading-spinner">Loading...</div>}
            {errors.location && <div className="error-message">{errors.location}</div>}
            
            {suggestions.length > 0 && showSuggestions && (
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