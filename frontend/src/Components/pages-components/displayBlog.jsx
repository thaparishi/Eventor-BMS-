import React, { useState } from "react";
import { Link } from "react-router-dom";

const DisplayBlog = ({ _id, title, text, auther, read, desc, image, postedDate }) => {
  const [readMore, setReadMore] = useState(false);

  return (
    <>
      <div className="blog-items">
        <div className="blog-right">
          <div className="blog-desc">
            <span id="blog-cover-bg">{desc}</span>
          </div>
          <h2>{title}</h2>
          <p>
            {readMore ? text : `${text.substring(0, 150)}...`}
            <button
              className="show-items"
              onClick={() => setReadMore(!readMore)}
            >
              {readMore ? "show less" : "read more"}
            </button>
          </p>
          <div className="blog-buttom">
            <p>By {auther}</p>
            <p>{read}</p>
            <p>{postedDate}</p>
          </div>
        </div>
        <div className="blog-left">
          {/* Update image path handling to work with backend */}
          <img 
            src={image.startsWith('http') ? image : `${process.env.PUBLIC_URL}${image}`} 
            alt={title} 
          />
        </div>
      </div>
      <div className="underline"></div>
    </>
  );
};

export default DisplayBlog;