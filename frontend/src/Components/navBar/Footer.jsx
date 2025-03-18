import React from "react";
import { BsFillTelephoneForwardFill } from "react-icons/bs";
import {
  AiFillMail,
  AiFillHome,
  AiFillInstagram,
  AiFillFacebook,
  AiOutlineWhatsApp,
} from "react-icons/ai";

import "./Footer.css";
import facebookLogo from'../Images/Facebook_Logo.png.webp';
import instagramLogo from '../Images/Instagram_logo_2016.svg.webp';
import twitterLogo from '../Images/twitter.png';


function Footer() {
  return (
    <footer>
      <div className="mainn">
        <div className="footer-short-info">
          <div className="short-info-text" data-aos="zoom-in">
            <h2>Short Info</h2>
            <p>Get in Touch</p>
            <img
              src={""}
              alt="img"
            />
          </div>
          <div className="get-touch" data-aos="zoom-in">
            <section className="contact-us">
              <div className="heading">
                <h2>Contact Us</h2>
              </div>
              <div className="footer-content">
                <p id="margin-btm">Reach us via Different Medias</p>
                <p>
                  <BsFillTelephoneForwardFill /> +977 980000000
                </p>
                <p>
                  <AiFillMail /> eventor@gmail.com
                </p>
                <p>
                  <AiFillHome /> Kalanki-14, Kathmandu
                </p>
                <p>
                  <AiFillInstagram /> Eventor
                </p>
                <p>
                  <AiFillFacebook /> wwww.facebook.com/Eventor
                </p>
                <p>
                  <AiOutlineWhatsApp /> +977- 9800000000
                </p>
              </div>
            </section>
            <section className="opening-hour">
              <div className="heading">
                <h2>Opening Hour</h2>
              </div>
              <div className="opening-hour-content">
                <div className="days">
                  <h2>Monday</h2>
                  <h2>Tuesday</h2>
                  <h2>Wednessday</h2>
                  <h2>Thursday</h2>
                  <h2>Friday</h2>
                  <h2>Saturday</h2>
                  <h2>Sunday</h2>
                </div>
                <div className="time">
                  <p>09am - 10pm</p>
                  <p>09am - 10pm</p>
                  <p>09am - 10pm</p>
                  <p>09am - 10pm</p>
                  <p>11am - 08pm</p>
                  <p>10am - 11pm</p>
                  <p>Closed</p>
                </div>
              </div>
            </section>
            <section className="opening-hour">
              <div className="heading">
                <h2> Our Reach</h2>
              </div>

              <div className="content">
                <img src={require("../Images/dhido.jpg")} alt="a" width="100" />
                <img src={require("../Images/1a.png")} alt="a" width="100" />
                <img src={require("../Images/1b.png")} alt="a" width="100" />
                <img src={require("../Images/1c.png")} alt="a" width="100" />
                <img src={require("../Images/1d.png")} alt="a" width="100" />
                <img src={require("../Images/1e.png")} alt="a" width="100" />
              </div>
            </section>
          </div>
          <div className="underline" data-aos="zoom-in"></div>
          <div className="about-banquet" data-aos="zoom-in">
            <div className="heading">
              <h3>About Banquet</h3>
            </div>

            <div className="footer-content">
              <p>
                A banquet is a formal event or gathering where a large group of people come together 
                to enjoy a lavish meal or celebration. Typically held in elegant venues such as hotels or 
                event halls, banquets areoften organized for special occasions like weddings, corporate functions,
                or holidays.The atmosphere is generally refined, with beautifully arranged tables, intricate decorations, 
                and a menu designed to impress. In addition to dining, banquets may feature speeches, entertainment, 
                or awards. They provide an opportunity for guests to socialize, network, and celebrate in a festive setting.
              </p>
            </div>
          </div>
          <div className="links-newsletter">
            <div className="social-links">
              <div className="heading">
                <h2>Find Us On</h2>
              </div>
              <div className="social-link">
                <a href="www.instagram.com">
                  {" "}
                  <AiFillInstagram className="social-icon" />
                  <span>Instagram</span> 
                </a>
                <a href="www.instagram.com">
                  {" "}
                  <AiFillFacebook className="social-icon" />
                  <span>FaceBook</span> 
                </a>
                <a href="www.instagram.com">
                  {" "}
                  <AiOutlineWhatsApp className="social-icon" />
                  <span>Whatsapp</span> 
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-content-last">
        <section className="footer-left">
          <img src={require("../Images/dhido.jpg")} alt="a" width="100" />
          <p>
            A banquet is a formal event usually held to celebrate a particular
            occasion or to recognize a significant achievement. It involves a
            sit-down meal and can be hosted at various locations such as hotels,
            conference centers, and restaurants. Banquets can range from
            intimate gatherings of a few people to large-scale events with
            hundreds of attendees
          </p>
          <article className="hide-element">
            <a href="www.facebook.com">
              <img src={facebookLogo} alt="a" width="100" />
            </a>
            <a href="www.instagram.com">
              <img
                src={instagramLogo}
                alt=""
                width="100"
              />
            </a>
            <a href="www.twitter.com">
              <img
                className="twitter"
                src={twitterLogo}
                alt=""
                width="100"
              />
            </a>
          </article>
        </section>
        <section className="footer-right">

          <section className="footer-links">
            <a href="/">Home </a>
            <a href="About">About Us </a>
            <a href="Login">Log in </a>
            <a href="Gallery">Our Gallery </a>
            <a href="Contact">Contact </a>
            <br />
          </section>  

          <section className="footer-text">
            <p>
              Reach Us
              <br />
              ----------------------------------------
            </p>
            <p className="small-text">
              Copyright © 2025 Eventor, All rights reserved
            </p>
          </section>

        </section>
      </div>
    </footer>
  );
}
export default Footer;