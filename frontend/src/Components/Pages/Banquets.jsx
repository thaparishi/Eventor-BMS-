import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Importing images
import img11 from '../Images/11.jpg';
import img22 from '../Images/22.jpg';
import img33 from '../Images/33.jpg';
import clientImage1 from '../Images/11.jpg';
import clientImage2 from '../Images/22.jpg';
import clientImage3 from '../Images/33.jpg';

// Star Icons
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function Banquets() {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const images = [img11, img22, img33];

  const reviews = [
    {
      text: "Eventor made booking my wedding banquet a breeze! Highly recommend it for any event.",
      name: "Sarah L.",
      image: clientImage1,
      rating: 5, // 5 stars
    },
    {
      text: "Great platform with excellent customer support. My event was a success!",
      name: "John D.",
      image: clientImage2,
      rating: 4, // 4 stars
    },
    {
      text: "The perfect solution for all my event needs. Seamless experience!",
      name: "Emma W.",
      image: clientImage3,
      rating: 5, // 5 stars
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="home-container">
      {/* Welcome Section with Sliding Images */}
      <header className="home-header" style={{ backgroundImage: `url(${images[currentImage]})` }}>
        <div className="header-content">
          <h1>Welcome to Eventor</h1>
          <p>Book your perfect banquet for any occasion with ease!</p>
          <div className="header-buttons">
            <button onClick={() => navigate('/banquets')} className="btn-primary">
              Explore Banquets
            </button>
            <button onClick={() => navigate('/login')} className="btn-secondary">
              Log In
            </button>
          </div>
        </div>
      </header>

      {/* About Us Section */}
      <section className="about-us">
        <div className="about-content">
          <h2>About Us</h2>
          <img src={img22} alt="Eventor Overview" className="about-image" />
          <p>
            Eventor is your one-stop solution for managing banquets. Whether it's a wedding, a birthday party, or a corporate event, 
            we ensure you find the perfect venue and services for your special occasion. We offer an array of curated options and personalized services.
          </p>
        </div>
      </section>

      {/* Client Reviews Section */}
      <section className="client-reviews">
        <div className="reviews-text">
          <h2>What Our Clients Say</h2>
          <p>We’ve helped hundreds of clients create their dream events. Here’s what they have to say!</p>
          <div className="review-container">
            {reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="review-image">
                  <img src={review.image} alt={`Client ${review.name}`} />
                </div>
                <div className="review-content">
                  <p>"{review.text}"</p>
                  <strong>- {review.name}</strong>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Banquets;
