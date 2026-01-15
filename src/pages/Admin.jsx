import React, { useState, useEffect, useCallback } from "react";
import "./Admin.css";

const Admin = () => {
  const [section, setSection] = useState("registered");
  const [contactFilter, setContactFilter] = useState("all");
  const [registered, setRegistered] = useState([]);
  const [contacted, setContacted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [remember, setRemember] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const API_BASE_URL = import.meta.env.REACT_APP_API_URL + "/api";

  // Fetch registered users
  const fetchRegistered = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch registered users");
      const data = await res.json();
      setRegistered(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE_URL]);

  // Fetch contacted users
  const fetchContacted = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch contacted users");
      const data = await res.json();
      setContacted(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE_URL]);

  // Load data on component mount and when section changes
  useEffect(() => {
    if (!isAuthenticated) return;
    if (section === "registered") {
      fetchRegistered();
    } else {
      fetchContacted();
    }
  }, [section, isAuthenticated, fetchRegistered, fetchContacted]);

  // On mount, check stored token
  useEffect(() => {
    const saved =
      localStorage.getItem("admin_token") ||
      sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/admin/verify-token`, {
            headers: { Authorization: `Bearer ${saved}` },
          });

          // Check if response is JSON
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            if (res.ok) {
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("admin_token");
              sessionStorage.removeItem("admin_token");
            }
          } else {
            // Server returned non-JSON response, likely an error page
            localStorage.removeItem("admin_token");
            sessionStorage.removeItem("admin_token");
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem("admin_token");
          sessionStorage.removeItem("admin_token");
        }
      })();
    }
  }, [API_BASE_URL]);

  // Filter contacted users based on date range
  const getFilteredContacted = () => {
    const now = new Date();
    let filtered = [...contacted];

    if (contactFilter !== "all") {
      filtered = contacted.filter((c) => {
        const createdDate = new Date(c.createdAt);
        const daysAgo = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

        if (contactFilter === "today") return daysAgo === 0;
        if (contactFilter === "week") return daysAgo <= 7;
        if (contactFilter === "month") return daysAgo <= 30;
        return true;
      });
    }

    return filtered;
  };

  // Filter registered users based on search
  const getFilteredRegistered = () => {
    if (!searchTerm) return registered;

    return registered.filter(
      (r) =>
        r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredRegistered = getFilteredRegistered();
  const filteredContacted = getFilteredContacted();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
    setRegistered([]);
    setContacted([]);
    setEmail("");
    setOtpInput("");
  };

  const handleSendOTP = async () => {
    setError(null);
    if (!email) return setError("Enter your email address");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return setError("Please enter a valid email address");
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Server error: ${res.status} ${res.statusText}. Please check if the server is running.`
        );
      }

      const j = await res.json();
      if (!res.ok) {
        const errorMsg = j.error || "Failed to request OTP";
        throw new Error(errorMsg);
      }
      alert(
        "OTP sent to your email address. Check your inbox or the server console for the OTP code."
      );
    } catch (err) {
      // Handle network errors
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError(
          "Cannot connect to server. Please make sure the backend server is running."
        );
      } else {
        setError(
          err.message ||
            "Failed to request OTP. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    if (!email || !otpInput) return setError("Provide email address and OTP");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput, remember }),
      });

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
          `Server error: ${res.status} ${res.statusText}. Please check if the server is running.`
        );
      }

      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to verify OTP");
      const t = j.token;
      if (remember) localStorage.setItem("admin_token", t);
      else sessionStorage.setItem("admin_token", t);
      setToken(t);
      setIsAuthenticated(true);
      setEmail("");
      setOtpInput("");
      setTimeout(() => {
        if (section === "registered") fetchRegistered();
        else fetchContacted();
      }, 300);
    } catch (err) {
      setError(
        err.message ||
          "Failed to verify OTP. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
        </div>
        {isAuthenticated && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading data...</div>}

      <div className="admin-content">
        {!isAuthenticated ? (
          <section className="panel admin-login-panel">
            <h2>Admin Login</h2>

            <div className="login-form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-actions">
              <button className="btn" onClick={handleSendOTP}>
                Send OTP
              </button>
            </div>

            <div className="otp-section">
              <div className="login-form-group">
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength="6"
                />
              </div>

              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">Keep me logged in for 30 days</label>
              </div>

              <div className="login-actions">
                <button className="btn" onClick={handleVerifyOTP}>
                  Verify & Login
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <div className="admin-controls">
              <label className="select-wrap">
                View:
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                >
                  <option value="registered">
                    Registered Users ({registered.length})
                  </option>
                  <option value="contacted">
                    Contacted Users ({contacted.length})
                  </option>
                </select>
              </label>
            </div>

            {section === "registered" ? (
              <section className="panel">
                <div className="panel-header">
                  <h2>Registered Users</h2>
                  <div className="panel-actions">
                    <input
                      placeholder="Search by name, company or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn" onClick={fetchRegistered}>
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>First</th>
                        <th>Last</th>
                        <th>Job</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Has UAE</th>
                        <th>Multi Country</th>
                        <th>Line of Business</th>
                        <th>Product Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistered.length === 0 ? (
                        <tr className="empty-row">
                          <td colSpan="10">
                            {searchTerm
                              ? "No results found."
                              : "No registered users found."}
                          </td>
                        </tr>
                      ) : (
                        filteredRegistered.map((r, i) => (
                          <tr key={i}>
                            <td>{r.companyName}</td>
                            <td>{r.firstName}</td>
                            <td>{r.lastName}</td>
                            <td>{r.jobTitle}</td>
                            <td>{r.phone}</td>
                            <td>{r.email}</td>
                            <td>{r.hasUAE}</td>
                            <td>{r.multiCountry}</td>
                            <td>{(r.lineOfBusiness || []).join(", ")}</td>
                            <td>{(r.productInterest || []).join(", ")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : (
              <section className="panel">
                <div className="panel-header">
                  <h2>Contacted Users</h2>
                  <div className="panel-actions">
                    <div className="filters">
                      <label>
                        Filter:
                        <select
                          value={contactFilter}
                          onChange={(e) => setContactFilter(e.target.value)}
                        >
                          <option value="today">Today</option>
                          <option value="week">Last 7 days</option>
                          <option value="month">Last 30 days</option>
                          <option value="all">All</option>
                        </select>
                      </label>
                    </div>
                    <button className="btn" onClick={fetchContacted}>
                      Refresh
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Categories</th>
                        <th>Message</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacted.length === 0 ? (
                        <tr className="empty-row">
                          <td colSpan="6">No contacted users found.</td>
                        </tr>
                      ) : (
                        filteredContacted.map((c, i) => (
                          <tr key={i}>
                            <td>{c.name}</td>
                            <td>{c.email}</td>
                            <td>{c.phone || "—"}</td>
                            <td>{(c.categories || []).join(", ") || "—"}</td>
                            <td className="message-cell">{c.message || "—"}</td>
                            <td className="date-cell">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
