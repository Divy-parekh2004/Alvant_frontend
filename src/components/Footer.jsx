import "./Footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* LEFT */}
        <div className="footer-col">
          <h3>Alvant Export</h3>
          <p>
            Global transport and export solutions delivering reliability,
            efficiency, and trust across international markets.
          </p>
        </div>

        {/* MIDDLE */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <NavLink to="/" className="footer-link">
                Home
              </NavLink>
            </li>

            <li>
              <NavLink to="/about" className="footer-link">
                About us
              </NavLink>
            </li>

            <li>
              <NavLink to="/contact" className="footer-link">
                Get In Touch
              </NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT */}
        <div className="footer-col">
          <h4>Contact</h4>

          <p>
            Email:{" "}
            <a href="mailto:alvantexport369@gmail.com">
              alvantexport369@gmail.com
            </a>
          </p>

          {/* WhatsApp instead of phone number */}
          <p>
            <a
              href="https://wa.me/919054871775"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              💬 WhatsApp Us
            </a>
          </p>
          <p>
            Contact: +91 9054871775
          </p>

          <p>Location: India</p>
        </div>

        {/* TEAM */}
        <div className="footer-col">
          <h4>Our Team</h4>
          <p>Malav Thakkar (CEO)</p>
          <p>Ved Patel (CTO)</p>
          <p>Neel Patel (MD)</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Alvant Export. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
