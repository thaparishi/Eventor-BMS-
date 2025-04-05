import React, { useState, useEffect } from "react";
import axios from "axios";
import DisplayBlog from "../pages-components/displayBlog.jsx";
import "./blog.css";

function Blog() {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        setBlogData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="img-section">
        <div className="img-content">
          <h2 className="animate__animated animate__pulse">
            Finding the Perfect Banquet Venue: A Stress-Free Guide
          </h2>
          <p className="animate__animated animate__lightSpeedInLeft">
            Planning a memorable banquet starts with choosing the right 
            venue—but with so many options, how do you pick the perfect one? Whether you're 
            organizing a corporate gala, a dream wedding reception, or an intimate anniversary dinner, 
            the venue sets the tone for your entire event. From elegant ballrooms to rustic outdoor spaces, 
            the ideal location should align with your vision, budget, and guest experience.
          </p>
        </div>
      </div>
      <div className="blog-container">
        {blogData.length === 0 ? (
          <p className="no-blogs">No blogs found. Check back soon!</p>
        ) : (
          blogData.map((item) => {
            return (
              <DisplayBlog 
                key={item._id} 
                {...item} 
                dataLen={blogData.length} 
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default Blog;