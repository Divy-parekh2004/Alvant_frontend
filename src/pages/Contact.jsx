import "./Contact.css";
import heroImg from "../assets/contactusbg.jpg";
import { useState } from "react";

const categoriesList = [
  "Grains",
  "Freeze-Dried Fruits",
  "Other Freeze-Dried Products",
  "Tea / Coffee",
  "Herbs",
  "Spices",
  "Dry Fruits",
  "Moringa Infused Products",
  "Handicraft",
  "Other Food Products",
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleCategory = (item) => {
    setCategories((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  // Validation functions
  const validateName = (value) => {
    if (!value || !value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value || !value.trim()) {
      return 'Email is required';
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value.trim())) {
      return 'Please provide a valid email address';
    }
    return '';
  };

  const validatePhone = (value) => {
    if (!value || !value.trim()) {
      return 'Phone number is required';
    }
    const phoneRe = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRe.test(value.trim())) {
      return 'Please provide a valid phone number';
    }
    const digitsOnly = value.trim().replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      return 'Phone number must contain at least 10 digits';
    }
    return '';
  };

  const validateCategories = (cats) => {
    if (!Array.isArray(cats) || cats.length === 0) {
      return 'Please select at least one category';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Client-side validation
    const newErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const categoriesError = validateCategories(categories);
    
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    if (categoriesError) newErrors.categories = categoriesError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      const apiBase = process.env.REACT_APP_API_URL;
      const res = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, categories }),
      }).catch((fetchErr) => {
        throw new Error("Network error: Unable to connect to server. Please check your connection.");
      });

      let body;
      try {
        body = await res.json();
      } catch (parseErr) {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        // Handle database connection errors
        if (res.status === 503 && body.error === 'Database not connected') {
          throw new Error('Database connection error. Please check if MongoDB is configured and running.');
        }
        // Handle validation errors from backend
        if (body.errors && typeof body.errors === 'object') {
          setErrors(body.errors);
          const errorMsg = body.error || "Please correct the errors below";
          throw new Error(errorMsg);
        }
        // Handle other errors
        const errorMsg = body.error || body.details || "Failed to submit";
        throw new Error(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
      }

      alert("Thanks — your message was sent.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setCategories([]);
      setErrors({});
    } catch (err) {
      console.error("Contact form submission error:", err);
      if (!errors || Object.keys(errors).length === 0) {
        alert(err.message || "There was an error sending your message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <div
        className="contact-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>Reach out to us for transport, export, and logistics solutions.</p>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <div className="contact-container">

          {/* LEFT INFO */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p>
              We’d love to hear from you. Fill out the form or contact us
              directly using the details below.
            </p>

            <div className="info-item">
              <strong>Email:</strong>
              <span>alvantexport369@gmail.com</span>
            </div>

            <div className="info-item">
              <strong>Phone:</strong>
              <span>CEO: +91 9054871775</span>
              <span>CTO: +91 9773297483</span>
            </div>

            <div className="info-item">
              <strong>Location:</strong>
              <span>India</span>
            </div>
          </div>

          {/* RIGHT FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send Us a Message</h2>

            <div className="form-row">
              <label className="form-label">Name <span className="req">*</span></label>
              <input
                type="text"
                placeholder="Enter Your Name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    const error = validateName(e.target.value);
                    setErrors(prev => ({ ...prev, name: error || undefined }));
                  }
                }}
                onBlur={(e) => {
                  const error = validateName(e.target.value);
                  setErrors(prev => ({ ...prev, name: error || undefined }));
                }}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>

            <div className="form-row">
              <label className="form-label">Email <span className="req">*</span></label>
              <input
                type="email"
                placeholder="Enter Your Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    const error = validateEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: error || undefined }));
                  }
                }}
                onBlur={(e) => {
                  const error = validateEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: error || undefined }));
                }}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-row">
              <label className="form-label">WhatsApp Number <span className="req">*</span></label>
              <input
                type="tel"
                placeholder="Enter WhatsApp Number (e.g., +91 1234567890)"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    const error = validatePhone(e.target.value);
                    setErrors(prev => ({ ...prev, phone: error || undefined }));
                  }
                }}
                onBlur={(e) => {
                  const error = validatePhone(e.target.value);
                  setErrors(prev => ({ ...prev, phone: error || undefined }));
                }}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>

            {/* CHECKBOXES */}
            <fieldset className="checkbox-group">
              <legend className="checkbox-legend">Select Categories <span className="req">*</span></legend>

              <div className="checkbox-grid">
                {categoriesList.map((item) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={categories.includes(item)}
                      onChange={() => {
                        toggleCategory(item);
                        if (errors.categories) {
                          const newCats = categories.includes(item) 
                            ? categories.filter(c => c !== item)
                            : [...categories, item];
                          const error = validateCategories(newCats);
                          setErrors(prev => ({ ...prev, categories: error || undefined }));
                        }
                      }}
                    />
                    {" "}
                    {item}
                  </label>
                ))}
              </div>
              {errors.categories && <div className="field-error">{errors.categories}</div>}
            </fieldset>

            <div className="form-row">
              <label className="form-label">
                Message <span className="optional">(Optional)</span>
              </label>
              <textarea
                placeholder="Enter Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Submit'}</button>
          </form>

        </div>
      </section>
    </>
  );
};

export default Contact;
