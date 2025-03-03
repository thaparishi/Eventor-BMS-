import React from 'react';
import './About.css';

import img11 from '../Images/11.jpg';
import img22 from '../Images/22.jpg';
import img33 from '../Images/33.jpg';

function About() {
  return (
    <div className="about-container">
      {/* About Us Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>About Us</h2>
          <div className="image-container">
            <img src={img33} alt="Eventor Overview" className="about-image" />
          </div>
          <p>
            Eventor is your one-stop solution for managing banquets. Whether it's a wedding, a birthday party, or a corporate event, 
            we ensure you find the perfect venue and services for your special occasion. We offer an array of curated options and personalized services.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to connect people with exceptional venues, enabling them to create unforgettable experiences for any occasion. We strive to simplify event planning and provide unparalleled customer service.
        </p>
      </section>

      {/* Our Vision Section */}
      <section className="vision-section">
        <h2>Our Vision</h2>
        <p>
          To become the leading platform for event planning and venue booking, empowering individuals and organizations to host events with ease and confidence.
        </p>
      </section>

      {/* Our Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="card">
              <div className="front">
                <img src={img22} alt="Team Member 1" />
                <h3>Rishi Thapa</h3>
                <p>Founder & CEO</p>
              </div>
              <div className="back">
                <p>Rishi leads the vision of Eventor, ensuring we provide exceptional event solutions for all our clients.</p>
              </div>
            </div>
          </div>
          <div className="team-member">
            <div className="card">
              <div className="front">
                <img src={img33} alt="Team Member 2" />
                <h3>Sital Aryal</h3>
                <p>Event Specialist</p>
              </div>
              <div className="back">
                <p>Sital helps design memorable events by selecting the best venues and services for our clients.</p>
              </div>
            </div>
          </div>
          <div className="team-member">
            <div className="card">
              <div className="front">
                <img src={img11} alt="Team Member 3" />
                <h3>Prashant Adk</h3>
                <p>Technical Lead</p>
              </div>
              <div className="back">
                <p>Prashant ensures the platform runs smoothly, always innovating for a better user experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
