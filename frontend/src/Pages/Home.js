import React, { useState, useEffect } from 'react';
import './Home.css';


// Importing images correctly
import img11 from '../Images/11.jpg';
import img22 from '../Images/22.jpg';
import img33 from '../Images/33.jpg';

function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  // Using the imported images in the array
  const images = [img11, img22, img33];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);

  return (
    <div className="home-container">
      {/* Welcome Section with Sliding Images */}
      <header className="home-header" style={{ backgroundImage: `url(${images[currentImage]})` }}>
        <div className="header-content">
          <h1>Welcome to Eventor</h1>
          <p>Book your perfect banquet for any occasion with ease!</p>
        </div>
      </header>

      {/* About Us Section */}
      <section className="about-us">
        <h2>About Us</h2>
        <p>Why our banquet management system is perfect for your events.</p>
      </section>

      {/* Client Reviews Section */}
      <section className="client-reviews">
        <h2>Client Reviews</h2>
        <p>See what our clients have to say about our services!</p>
      </section>

    </div>
  );
}

export default Home;
