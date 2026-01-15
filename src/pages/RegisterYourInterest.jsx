import "./RegisterYourInterest.css";
import { useState } from "react";

const RegisterYourInterest = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    phone: "",
    email: "",
    hasUAE: "",
    multiCountry: "",
    lineOfBusiness: [],
    categories: [],
    productInterest: [],
    markets: [],
    services: [],
    captcha: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") return; // checkboxes handled by toggle
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (field, value) => {
    setFormData((prev) => {
      const arr = prev[field] || [];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const initialState = {
    companyName: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    phone: "",
    email: "",
    hasUAE: "",
    multiCountry: "",
    lineOfBusiness: [],
    categories: [],
    productInterest: [],
    markets: [],
    services: [],
    captcha: "",
  };

  // Validation functions
  const validateName = (value, fieldName) => {
    if (!value || !value.trim()) {
      return `${fieldName} is required`;
    }
    if (value.trim().length < 2) {
      return `${fieldName} must be at least 2 characters long`;
    }
    return "";
  };

  const validateEmail = (value) => {
    if (!value || !value.trim()) {
      return "Email is required";
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value.trim())) {
      return "Please provide a valid email address";
    }
    return "";
  };

  const validatePhone = (value) => {
    if (!value || !value.trim()) {
      return "Phone number is required";
    }
    const phoneRe = /^[\d\s\-+()]+$/;
    if (!phoneRe.test(value.trim())) {
      return "Please provide a valid phone number";
    }
    const digitsOnly = value.trim().replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return "Phone number must contain at least 10 digits";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // client-side validation for all required fields
    const newErrors = {};

    // Validate all fields
    const companyNameError = validateName(formData.companyName, "Company name");
    if (companyNameError) newErrors.companyName = companyNameError;

    const firstNameError = validateName(formData.firstName, "First name");
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateName(formData.lastName, "Last name");
    if (lastNameError) newErrors.lastName = lastNameError;

    const jobTitleError = validateName(formData.jobTitle, "Job title");
    if (jobTitleError) newErrors.jobTitle = jobTitleError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    if (!formData.hasUAE) newErrors.hasUAE = "Please select an option";
    if (!formData.multiCountry)
      newErrors.multiCountry = "Please select an option";
    if (
      !Array.isArray(formData.lineOfBusiness) ||
      formData.lineOfBusiness.length === 0
    )
      newErrors.lineOfBusiness = "Select at least one";
    if (
      !Array.isArray(formData.productInterest) ||
      formData.productInterest.length === 0
    )
      newErrors.productInterest = "Select at least one";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setError("Please correct the highlighted fields");
      return;
    }

    setLoading(true);
    try {
      const apiBase = process.env.REACT_APP_API_URL;
      if (!apiBase) {
        throw new Error("API base URL (REACT_APP_API_URL) is not configured");
      }
      const res = await fetch(`${apiBase}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch((fetchErr) => {
        throw new Error(
          "Network error: Unable to connect to server. Please check your connection."
        );
      });

      let body;
      try {
        body = await res.json();
      } catch (parseErr) {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        // Handle database connection errors
        if (res.status === 503 && body.error === "Database not connected") {
          throw new Error(
            "Database connection error. Please check if MongoDB is configured and running."
          );
        }
        // Handle validation errors with field details
        if (body.errors && typeof body.errors === "object") {
          setErrors(body.errors);
          throw new Error(body.error || "Please correct the errors below");
        }
        // Handle other errors
        const errorMsg = body.error || body.details || "Submission failed";
        throw new Error(
          Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg
        );
      }

      setSuccess("Thanks — your registration was submitted.");
      setFormData(initialState);
      setErrors({});
    } catch (err) {
      console.error("Form submission error:", err);
      setError(
        err.message ||
          "There was an error submitting the form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interest-page">
      <div className="interest-container">
        <main className="interest-main">
          <div className="form-header">
            <h2 className="eyebrow">Register Your Interest </h2>
            <p className="intro">
              Complete the form and our team will reach out to discuss
              opportunities.
            </p>
          </div>

          {success && (
            <div className="alert success" role="status">
              {success}
            </div>
          )}
          {error && (
            <div className="alert error" role="alert">
              {error}
            </div>
          )}

          <form className="interest-form" onSubmit={handleSubmit}>
            <div className="row">
              <label className="label">
                Do you have a business in UAE? <span className="req">*</span>
              </label>
              <div className="radio-row">
                <label className="radio">
                  <input
                    type="radio"
                    name="hasUAE"
                    value="Yes"
                    checked={formData.hasUAE === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="hasUAE"
                    value="No"
                    checked={formData.hasUAE === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              {errors.hasUAE && (
                <div className="field-error">{errors.hasUAE}</div>
              )}
            </div>

            <div className="row">
              <label className="label">
                Is your business operating in multiple countries?{" "}
                <span className="req">*</span>
              </label>
              <div className="radio-row">
                <label className="radio">
                  <input
                    type="radio"
                    name="multiCountry"
                    value="Yes"
                    checked={formData.multiCountry === "Yes"}
                    onChange={handleChange}
                  />{" "}
                  Yes
                </label>
                <label className="radio">
                  <input
                    type="radio"
                    name="multiCountry"
                    value="No"
                    checked={formData.multiCountry === "No"}
                    onChange={handleChange}
                  />{" "}
                  No
                </label>
              </div>
              {errors.multiCountry && (
                <div className="field-error">{errors.multiCountry}</div>
              )}
            </div>

            <div className="row">
              <label className="label">
                What is your line of business? <span className="req">*</span>
              </label>
              <div className="checkbox-grid">
                {[
                  "Manufacturer",
                  "Wholesaler/Retailer",
                  "Food Export/Import",
                  "Distributor",
                  "HORECA/Restaurant/Cafe",
                  "Service Provider",
                  "Cloud Kitchen",
                  "Others",
                ].map((item) => (
                  <label
                    key={item}
                    className={`chip ${
                      formData.lineOfBusiness.includes(item) ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="lineOfBusiness"
                      value={item}
                      checked={formData.lineOfBusiness.includes(item)}
                      onChange={() => toggle("lineOfBusiness", item)}
                    />
                    <span className="chip-label">{item}</span>
                  </label>
                ))}
              </div>
              {errors.lineOfBusiness && (
                <div className="field-error">{errors.lineOfBusiness}</div>
              )}
            </div>

            <div className="row">
              <label className="label">
                What is your product of interest in Alvant Export ?{" "}
                <span className="req">*</span>
              </label>
              <div className="checkbox-grid">
                {[
                  "Grains",
                  "Frozen Dried Fruits",
                  "Frozen Dried Fruits(Green peas, Sweet Corns)",
                  "Tea/Coffee",
                  "Herbs",
                  "Spices",
                  "Dry Fruits",
                  "Moringa Infused Products",
                  "Handicraft",
                  "Other Food Products(Honey, Bilona method Ghee)",
                ].map((item) => (
                  <label
                    key={item}
                    className={`chip ${
                      formData.productInterest.includes(item) ? "selected" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="productInterest"
                      value={item}
                      checked={formData.productInterest.includes(item)}
                      onChange={() => toggle("productInterest", item)}
                    />
                    <span className="chip-label">{item}</span>
                  </label>
                ))}
              </div>
              {errors.productInterest && (
                <div className="field-error">{errors.productInterest}</div>
              )}
            </div>

            <div className="row">
              <label className="label">
                Your Company Name <span className="req">*</span>
              </label>
              <input
                className={`input ${errors.companyName ? "error" : ""}`}
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={(e) => {
                  const error = validateName(e.target.value, "Company name");
                  setErrors((prev) => ({
                    ...prev,
                    companyName: error || undefined,
                  }));
                }}
                required
              />
              {errors.companyName && (
                <div className="field-error">{errors.companyName}</div>
              )}
            </div>

            <div className="row two-col">
              <div>
                <label className="label">
                  First Name <span className="req">*</span>
                </label>
                <input
                  className={`input ${errors.firstName ? "error" : ""}`}
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateName(e.target.value, "First name");
                    setErrors((prev) => ({
                      ...prev,
                      firstName: error || undefined,
                    }));
                  }}
                  required
                />
                {errors.firstName && (
                  <div className="field-error">{errors.firstName}</div>
                )}
              </div>
              <div>
                <label className="label">
                  Last Name <span className="req">*</span>
                </label>
                <input
                  className={`input ${errors.lastName ? "error" : ""}`}
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateName(e.target.value, "Last name");
                    setErrors((prev) => ({
                      ...prev,
                      lastName: error || undefined,
                    }));
                  }}
                  required
                />
                {errors.lastName && (
                  <div className="field-error">{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="row two-col">
              <div>
                <label className="label">
                  Job Title <span className="req">*</span>
                </label>
                <input
                  className={`input ${errors.jobTitle ? "error" : ""}`}
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateName(e.target.value, "Job title");
                    setErrors((prev) => ({
                      ...prev,
                      jobTitle: error || undefined,
                    }));
                  }}
                />
                {errors.jobTitle && (
                  <div className="field-error">{errors.jobTitle}</div>
                )}
              </div>
              <div>
                <label className="label">
                  Phone (Whatsapp No.) <span className="req">*</span>
                </label>
                <input
                  className={`input ${errors.phone ? "error" : ""}`}
                  type="tel"
                  name="phone"
                  placeholder="e.g., +91 1234567890"
                  value={formData.phone}
                  onChange={(e) => {
                    handleChange(e);
                    if (errors.phone) {
                      const error = validatePhone(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        phone: error || undefined,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    const error = validatePhone(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      phone: error || undefined,
                    }));
                  }}
                />
                {errors.phone && (
                  <div className="field-error">{errors.phone}</div>
                )}
              </div>
            </div>

            <div className="row">
              <label className="label">
                Work Email <span className="req">*</span>
              </label>
              <input
                className={`input ${errors.email ? "error" : ""}`}
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.email) {
                    const error = validateEmail(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      email: error || undefined,
                    }));
                  }
                }}
                onBlur={(e) => {
                  const error = validateEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: error || undefined }));
                }}
                required
              />
              {errors.email && (
                <div className="field-error">{errors.email}</div>
              )}
            </div>

            <div className="row actions">
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterYourInterest;
