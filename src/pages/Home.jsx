import "./Home.css";
import ProductSlider from "../components/ProductSlider";
import heroImg from "../assets/hero1.jpg";
import WhatWeDo from "../components/WhatWeDo";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* HERO */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      >
        <div className="hero-content">
          <h1>Connecting Local Farmers to Global Markets</h1>
          <p>Connecting markets worldwide</p>
          {/* <button className="hero-btn">Register Your Interest</button> */}
          <NavLink to="/registeryourinterest" className="hero-btn">
                      Register Your Interest
                    </NavLink>
        </div>
      </div>

      {/* PRODUCTS */}
      <ProductSlider />

      <WhatWeDo />

      <Footer />
    </>
  );
};

export default Home;
