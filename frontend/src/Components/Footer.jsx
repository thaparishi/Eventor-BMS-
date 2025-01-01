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

function Footer() {
  return (
    <footer>
      <div className="footer-short-info">
        <div className="short-info-text" data-aos="zoom-in">
          <h2>Short Info</h2>
          <p>Get in Touch</p>
          <img
            src={"http://wahabali.com/work/pearl-demo/images/heading-dark.png"}
            alt=""
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
              <img src={require("../Components/Images/dhido.jpg")} alt="" width="100" />
              <img src={require("../Components/Images/1a.png")} alt="" width="100" />
              <img src={require("../Components/Images/1b.png")} alt="" width="100" />
              <img src={require("../Components/Images/1c.png")} alt="" width="100" />
              <img src={require("../Components/Images/1d.png")} alt="" width="100" />
              <img src={require("../Components/Images/1e.png")} alt="" width="100" />
            </div>
          </section>
        </div>
        <div className="underline" data-aos="zoom-in"></div>
        <div className="about-banquet" data-aos="zoom-in">
          <div className="heading">
            <h2>About Banquet</h2>
          </div>

          <div className="footer-content">
            <p>
              A banquet is a formal event usually held to celebrate a particular
              occasion or to recognize a significant achievement. It involves a
              sit-down meal and can be hosted at various locations such as
              hotels, conference centers, and restaurants. Banquets can range
              from intimate gatherings of a few people to large-scale events
              with hundreds of attendees. Typically, the banquet planning
              process includes selecting a venue, determining a guest list,
              choosing a menu, arranging for decor and entertainment, and
              coordinating logistics such as transportation and parking. The
              success of a banquet largely depends on the attention to detail
              and thorough planning.
            </p>
          </div>
        </div>
        <div className="links-newsletter">
          <div className="social-links">
            <div className="heading">
              <h2>Follow Along</h2>
            </div>
            <div className="social-link">
              <a href="www.instagram.com">
                {" "}
                <AiFillInstagram className="social-icon" />
              </a>
              <a href="www.instagram.com">
                {" "}
                <AiFillFacebook className="social-icon" />
              </a>
              <a href="www.instagram.com">
                {" "}
                <AiOutlineWhatsApp className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-content-last">
        <section className="footer-left">
          {/* <i
            class="fa-brands fa-square-pied-piper"
            style="font-size: 100px"
          ></i> */}
          <img src={require("../Components/Images/dhido.jpg")} alt="" width="100" />
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
              <img src="../Components/Images/Facebook_Logo.png.webp" alt="" width="100" />
            </a>
            <a href="www.instagram.com">
              <img
                src="../Components/Images/Instagram_logo_2016.svg.webp"
                alt=""
                width="100"
              />
            </a>
            <a href="www.twitter.com">
              <img
                class="twitter"
                src="../Components/Images/twitter.png"
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
              Copyright © 2024 Eventor, All rights reserved
            </p>
          </section>
        </section>
      </div>
      {/* <div className="copyright-footer">
        <p>Copyright © 2024 EVentor All rights reserved.</p>
        <p>Permissions and Copyrights - Contact Us </p>
      </div> */}
    </footer>
  );
}
export default Footer;
