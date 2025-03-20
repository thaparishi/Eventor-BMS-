import React, { useEffect, useState, } from "react";
import { useParams } from "react-router-dom";
import Slider from "@mui/material/Slider";
import {GiIndianPalace } from "react-icons/gi";
import {AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import "./Dbanquet.css";

const Dbanquet = () => {
  const [banquetData, setBanquetData] = useState([]);
  const [searchBanquetValue, setSearchBanquetValue] = useState("");
  const { token } = useParams();
  const [noDataFound, setNoDataFound] = useState(false);
  const [range, setRange] = useState([100, 1000]);

  async function handleChanges(event, newValue) {
    setRange(newValue);
    setNoDataFound(false);
    const response = await axios.get(`/api/filterBanquetPrice/${range}`);
    if (response.data === "unsucessful") {
      setNoDataFound(true);
      return;
    }
    setBanquetData(response.data);
  }

  const fetchData = async () => {
    fetch(`http://localhost:8000/api/getBanquet/${token}`)
      .then((response) => response.json())
      .then((data) => {
        setBanquetData(data);
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
    setBanquetData(response.data);
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
    setBanquetData(response.data);
  };

  const sortAscending = async () => {
    const response = await axios.get(`/api/filterBanquetAscending`);
    setBanquetData(response.data);
  };

  const sortDescending = async () => {
    const response = await axios.get(`/api/filterBanquetDescending`);
    setBanquetData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <div className="bodddy">
        <div className="book-banquet-container">
          <div className="display-banquet-container">
            <div className="select-hall">
              <GiIndianPalace className="hall-icon" />
              <h2>Select Banquet Hall</h2>
            </div>
            <div className="search-banquet-form">
              <div className="location-field">
                <select
                  name="location"
                  value={searchBanquetValue} // Control the value
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
              banquetData.map((item) => {
                const {
                  _id,
                  banquet_name,
                  banquet_description,
                  image_location,
                  banquet_location,
                  banquet_price,
                } = item;
                return (
                  <div key={_id} className="banquet-container">
                  <img src={`http://localhost:3000/banquet-Images/${image_location}`} alt="Banquet" />    
                    <div className="banquet-content">
                      <h2>{banquet_name}</h2>
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
