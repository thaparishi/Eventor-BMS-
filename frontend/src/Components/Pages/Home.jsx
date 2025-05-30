import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import img11 from '../Images/11.jpg';
import img22 from '../Images/22.jpg';
import img33 from '../Images/33.jpg';
import { FaMedal } from 'react-icons/fa';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaQuoteRight } from "react-icons/fa";
import silderImage01 from "../Images/home_slider/slider-img01.jpg";
import silderImage02 from "../Images/home_slider/slider-img02.jpg";
import silderImage03 from "../Images/home_slider/slider-img03.jpg";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const image = [silderImage03, silderImage01, silderImage02];

function Home({ checkLogin }) {
  const [index, setIndex] = useState(0);

  const [sliderIndex, setSliderIndex] = useState(0);

  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const totalDataLength = reviewData.length - 1;
    if (index < 0) {
      setIndex(totalDataLength);
      return;
    } else if (index > totalDataLength) {
      setIndex(0);
      return;
    }
  }, [index, reviewData]);

  useEffect(() => {
    const timoutFunction = setInterval(() => {
      setIndex(index + 1);
    }, 3000);
    return () => {
      clearInterval(timoutFunction);
    };
  }, [index]);

  useEffect(() => {
    const totalDataLength = image.length - 1;
    if (sliderIndex < 0) {
      setSliderIndex(totalDataLength);
      return;
    } else if (sliderIndex > totalDataLength) {
      setSliderIndex(0);
      return;
    }
  }, [sliderIndex]);


  const [currentImage, setCurrentImage] = useState(0);
  // Using the imported images in the array
  const images = [img11, img22, img33];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);

  useEffect(() => {
  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:8000/approved-reviews");
      console.log("Approved reviews response:", response.data);
      if (response.data.reviews && response.data.reviews.length > 0) {
        setReviewData(response.data.reviews);
      } else {
        // Fallback to default review data if no approved reviews in database
        import("./review").then((defaultReviews) => {
          setReviewData(defaultReviews.default);
        });
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
      // Fallback to default review data on error
      import("./review").then((defaultReviews) => {
        setReviewData(defaultReviews.default);
      });
    } finally {
      setLoading(false);
    }
  };

  fetchReviews();
}, []);

  return (
    <div className="home-container">
      <header className="home-header" style={{ backgroundImage: `url(${images[currentImage]})` }}>
        <div className="header-content">
          <h1>Welcome to Eventor</h1>
          <p>Book your perfect banquet for any occasion with ease!</p>
          {checkLogin && (
            <div className="bottom-middle-banquet">
              <Link to="/createBanquet">
                <button className="bottom-banquet-btn create-banquet-btn">
                  Register Your Banquet
                </button>
              </Link>
              <Link to="/banquets">
                <button className="bottom-banquet-btn show-banquet-btn">
                  Book Banquet for events
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="bottom-medall">
          <div className="medall">
            <p>
              <FaMedal />
            </p>
          </div>

          <div className="text-medall ">
            <p>
              <CountUp end={1} duration={3} />+
            </p>
            <p id="changeColor">Years of Excellence</p>
          </div>
        </div>
      </header>

      <section className="about-bqt " data-aos="fade-down">
        <section className="banquet-info ">
          <section className="heading-bqt">
            <h1 id="h-h1">WELCOME </h1>
            <p>
              Beyond the hustle and bustle of the city, we provide our one
              stop party venue services in a serene family location,
              furnished and attained to make your celebrations eternally
              memorable.Spread in a compound of over four rapani of land, a
              traditional newari house offers you a homely enviornment;
              state of art auditorium of 5500 sq.feet...
            </p>

            <section
              className="bqt-flx"
              data-aos="fade-right"
              data-aos-delay="600"
            >
              <section className="about-bqt-items">
                <h2>
                  <i className="fa-solid fa-hands-holding-circle"></i>
                  ABOUT OUR BANQUET SYSTEM
                </h2>
                <p>
                  At Our Banquet System, we plan to make your event, worry
                  free and fun. Take the stress of planning your special
                  event off your shoulders by selecting the level of
                  assistance you want. When it comes to managing and
                  catering your own event, our team of expertise...
                </p>
                <div className="about-link">
                  <a href="about">
                    <button type="submit" className="read-more-btn">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      READ MORE
                    </button>
                  </a>
                </div>
              </section>
              <section className="choose-item banquet-item">
                <h2>
                  <i className="fa-solid fa-clipboard"></i>
                  WHY CHOOSE OUR BANQUET SYSTEM
                </h2>
                <p>
                  At Our Banquet System, we plan to make your event, worry
                  free and fun. Take the stress of planning your special
                  event off your shoulders by selecting the level of
                  assistance you want. When it comes to managing and
                  catering your own event,our team of expertise...
                </p>
                <div className="about-link">
                  <a href="about">
                    <button type="submit" className="read-more-btn">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      READ MORE
                    </button>
                  </a>
                </div>
              </section>
            </section>
          </section>
        </section>
        <section className="heading-img">
          <img src={require("../Images/s3.jpg")} alt="buddha " />
        </section>
      </section>
      
       <section className="third-sec" data-aos="fade-up">
            <div className="section">
              <div className="title">
                <h2>
                  <span>/</span> Our Valuable Clients
                </h2>
              </div>

              <div className="section-center">
                {loading ? (
                  <div className="loading">Loading reviews...</div>
                ) : error ? (
                  <div className="error">{error}</div>
                ) : reviewData.length === 0 ? (
                  <div className="no-reviews">No reviews available yet</div>
                ) : (
                  reviewData.map((item, personIndex) => {
                    const { _id, image, name, title, quote } = item;
                    
                    let position = "lastSlide";
                    
                    if (personIndex === index) {
                      position = "activeSlide";
                    }
                    if (
                      personIndex === index - 1 ||
                      (personIndex === reviewData.length - 1 && index === 0)
                    ) {
                      position = "nextSlide";
                    }
                    
                    return (
                      <article key={_id || personIndex} className={position}>
                        <img 
                          src={image && image.startsWith('http') ? image : 
                              image && image.startsWith('/') ? `http://localhost:8000${image}` : 
                              image ? require(`../Images/${image}`) : require('../Images/rabi.png')} 
                          alt={name} 
                          className="review-img" 
                        />
                        <h4>{name}</h4>
                        <p>{title}</p>
                        <p className="text">{quote}</p>
                        <FaQuoteRight className="home-quote-icon" />
                      </article>
                    );
                  })
                )}
                
                <button
                  className="prev-btn"
                  onClick={() => {
                    setIndex(index - 1);
                  }}
                >
                  <FiChevronLeft />
                </button>
                <button
                  className="next-btn"
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                >
                  <FiChevronRight />
                </button>
              </div>
              
              <div className="leave-review-container">
                <Link to="/reviews">
                  <button className="leave-review-btn">
                    Leave a Review
                  </button>
                </Link>
              </div>
            </div>
          </section>
    </div>
  );
}
export default Home;