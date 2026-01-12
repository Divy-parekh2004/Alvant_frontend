import { useState } from "react";
import "./ProductSlider.css";

import p1 from "../assets/grains.jpg";
import p2 from "../assets/kiwi.jpg";
import p3 from "../assets/peas.jpg";
import p4 from "../assets/Tea_Coffee.jpg";
import p5 from "../assets/herbs.jpg";
import p6 from "../assets/spices.jpg";
import p7 from "../assets/dry_fruits.jpg";
import p8 from "../assets/moringa_infused_products.jpg";
import p9 from "../assets/handicrafts.jpg";
import p10 from "../assets/other_food_products.jpg";

const products = [
  {
    img: p1,
    title: "Grains",
    desc: [
      "Kala Namak Rice",
      "Katarni Rice",
      "Coffee Beans",
      "Wheat"
    ]
  },
  {
    img: p2,
    title: "Frizzed Dried Fruits",
    desc: [
      "Mango",
      "Banana",
      "Pineapple",
      "Jamun",
      "Kiwi",
      "Chikoo",
      "Strawberry",
      "Blueberry"
    ]
  },
  {
    img: p3,
    title: "Other Frizzed Dried Products",
    desc: [
      "Green peas",
      "Sweet corn",
      "Golden crunchy corn",
      "Ice cream scoop"
    ]
  },
  {
    img: p4,
    title: "Tea / Coffee",
    desc: [
      "Kangra tea",
      "Gurug Arabic coffee",
      "Darjeeling tea",
      "Koraput coffee",
      "Moringa tea"
    ]
  },
  {
    img: p5,
    title: "Herbs",
    desc: [
      "Rose petals",
      "Stevia powder",
      "Moringa leaf powder",
      "Drumstick powder",
      "psyllium husk"
    ]
  },
  {
    img: p6,
    title: "Spices",
    desc: [
      "Kashmiri premium saffron",
      "Turmeric",
      "Chili",
      "Kerala Cardmom",
      "Cumin",
      "Ajwain",
      "Malabar Black Pepper",
      "Sikkim Large Cardamom",
      "Hathras Hing",
      "FenuGreek"
    ]
  },
  {
    img: p7,
    title: "Dry Fruits",
    desc: [
      "Kashmiri mamra almonds(Non-GMO)",
      "peanuts",
      "Kashmiri walnuts",
      "Cashew",
      "Kerala cardamom",
      "Purandar fig"
    ]
  },
  {
    img: p8,
    title: "Moringa Infused Products",
    desc: [
      "Moringa effervescent tablet",
      "Pan mukhwas",
      "Nutribar",
      "Choco bar",
      "Infused jeera powder",
      "Moringa soap",
      "Moringa jelly",
      "Moringa capsules",
      "Women’s special tablet",
      "Peri peri powder",
      "Chili powder",
      "Turmeric powder",
      "Seed oil"
    ]
  },
  {
    img: p9,
    title: "Handicraft",
    desc: [
      "Kashmiri pashmina",
      "Patola patterns"
    ]
  },
  {
    img: p10,
    title: "Other Food Products",
    desc: [
      "GI-tagged Sulai honey",
      "GI-tagged Sundarban honey",
      "Bilona method ghee"
    ]
  }
];



const ProductSlider = () => {
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeCard, setActiveCard] = useState(null);

  const next = () => {
    if (desktopIndex < products.length - 3) {
      setDesktopIndex(desktopIndex + 3);
    }
  };

  const prev = () => {
    if (desktopIndex > 0) {
      setDesktopIndex(desktopIndex - 3);
    }
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 1, products.length));
  };

  return (
    <section className="products-section">
      <h2>Our Products</h2>

      {/* DESKTOP */}
      <div className="slider-container desktop-only">
        <button className="arrow left" onClick={prev}>‹</button>

        <div className="cards">
          {products.slice(desktopIndex, desktopIndex + 3).map((item, i) => (
            <div className="flip-card" key={i}>
              <div className="flip-inner">
                <div className="flip-front">
                  <img src={item.img} alt={item.title} />
                  <h3>{item.title}</h3>
                </div>
                <div className="flip-back">
                  <ul className="desc-list">
  {item.desc.map((point, idx) => (
    <li key={idx}>{point}</li>
  ))}
</ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="arrow right" onClick={next}>›</button>
      </div>

      {/* MOBILE */}
      <div className="mobile-only">
        <div className="mobile-cards">
          {products.slice(0, visibleCount).map((item, i) => (
            <div
              className={`mobile-flip-card ${activeCard === i ? "active" : ""}`}
              key={i}
              onClick={() =>
                setActiveCard(activeCard === i ? null : i)
              }
            >
              <div className="mobile-flip-inner">
                <div className="mobile-flip-front">
                  <img src={item.img} alt={item.title} />
                  <h3>{item.title}</h3>
                </div>

                <div className="mobile-flip-back">
                  <ul className="desc-list">
                    {item.desc.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < products.length && (
          <button className="load-more" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductSlider;
