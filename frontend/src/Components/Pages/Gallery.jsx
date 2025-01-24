import React from "react";
import galleryData from "./gallery_data";
import "./Gallery.css"; 

const Gallery = () => {
  return (
    <main>
      <div className="gallery-container">
        <section className="gallery-bg"></section>
        <section className="gallery-heading">
          <p>/ GALLERY</p>
          <h2>ALBUM</h2>
        </section>
        <section className="gallery-images">
          {galleryData.map((item) => {
            const { id, image, description } = item;
            return (
              <article className="gallery-image" data-aos="zoom-in" key={id}>
                {/* <img
                  src={require("../images/gallery/pexels-cottonbro-studio-6718617.jpg")}
                  alt=""
                /> */}
                <img src={image} alt="" />
                <h2>{description}</h2>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
};

export default Gallery;
