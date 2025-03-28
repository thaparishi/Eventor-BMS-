import React from "react";

import "./createBanquet.css";

function Banquet() {
  return (
        <div className="auth-container">
            <section id="create-banquet">
              <h1>Create Banquet</h1>
              <form
                className="create-banquet-form"
                method="POST"
                action="/api/createBanquet"
                enctype="multipart/form-data"
              >
                <div className="email-field">
                  <input
                    type="name"
                    id="name"
                    name="name"
                    placeholder="Banquet Name"
                  />
                </div>

                <div className="email-field">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Price Per Plate"
                    max="1000"
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
                  />
                </div>

                <div className="location-field" style={{ margin: "20px 50px" }}>
                  <select name="location" required>
                    <option value="" disabled selected>
                      Location
                    </option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Butwal">Butwal</option>
                    <option value="Dhulikhel">Dhulikhel</option>
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

                <div className="image-field">
                  <input
                    type="file"
                    name="image"
                    accept="image/png,image/jpeg"
                    id="image-field"
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