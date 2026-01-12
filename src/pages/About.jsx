import "./About.css";
import heroImg from "../assets/aboutusbg.jpg";
import aboutImg1 from "../assets/about1.jpg";
import aboutImg2 from "../assets/about2.jpg";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      {/* HERO */}
      <div
        className="about-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="about-hero-content">
          <h1>About Alvant Export</h1>
          <p>
            Building reliable transport and export solutions that connect
            businesses to global markets.
          </p>
        </div>
      </div>

      {/* SECTION 1 */}
      <section className="about-section first-section">
        <div className="about-section-inner">
          <div className="about-text">
            <h2>About Us</h2>
            <p>
              We are a purpose-driven company engaged in the trading and sourcing
              of premium Indian agricultural products, including dry fruits,
              spices, moringa-infused products, and other authentic Indian GI
              (Geographical Indication) products.
            </p>

            <p>
              Our core strength lies in our direct partnership with farmers. By
              sourcing products straight from the fields, we eliminate unnecessary
              intermediaries, ensuring fair prices for farmers and superior
              quality for customers. This approach preserves freshness,
              authenticity, and empowers farmers with better income opportunities.
            </p>
          </div>

          <div className="about-image">
            <img src={aboutImg1} alt="Indian Agricultural Products" />
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="about-section">
        <div className="about-section-inner">
          <div className="about-image">
            <img src={aboutImg2} alt="Farmer Partnership" />
          </div>

          <div className="about-text">
            <p>
              We are committed to promoting India’s rich agricultural heritage on
              the world stage. Every product we trade reflects the purity,
              tradition, and excellence of its region of origin.
            </p>

            <p>
              Driven by sustainability, transparency, and trust, we aim to build
              long-term relationships with farmers, buyers, and partners—creating
              value for all while supporting rural livelihoods and responsible
              trade.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
