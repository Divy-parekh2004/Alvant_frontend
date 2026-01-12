import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";

const Navbar = ({ disableSticky = false }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (disableSticky) return;

    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [disableSticky]);

  return (
    <>
      <nav
        className={`navbar
          ${disableSticky ? "" : scrolled ? "scrolled" : "transparent"}
          ${open ? "menu-open" : ""}
        `}
      >
        {/* LOGO */}
        <div className="logo">
          <img src={logo} alt="Alvant Export Logo" />
        </div>

        {/* DESKTOP LINKS */}
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link btn-link">
            Get In Touch
          </NavLink>
        </div>

        {/* HAMBURGER */}
        <div className="hamburger" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-dropdown">
          <NavLink to="/" className="nav-link" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="nav-link btn-link mobile-btn"
            onClick={() => setOpen(false)}
          >
            Get In Touch
          </NavLink>
        </div>
      )}
    </>
  );
};

export default Navbar;
