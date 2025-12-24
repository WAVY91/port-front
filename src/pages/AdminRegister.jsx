import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import "./AdminLogin.css";

const AdminRegister = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const ADMIN_EMAIL = "timetomisin@gmail.com";
    if (formData.email !== ADMIN_EMAIL) {
      setError("Only authorized email can access the admin dashboard");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const API_BASE = import.meta.env.VITE_API_URL || "https://port-back-wyco.onrender.com";

    try {
      await axios.post(`${API_BASE}/api/admin/register`, {
        email: formData.email,
        password: formData.password,
      });
      navigate("/admin");
    } catch (err) {
      const status = err.response?.status;
      const serverMessage =
        err.response?.data?.message || err.response?.data?.error;
      if (status === 404) {
        setError(
          "Register endpoint not found. Is the backend running and URL correct?"
        );
      } else {
        setError(
          serverMessage
            ? `Server error (${status || "500"}): ${serverMessage}`
            : "Error registering"
        );
      }
      console.error("Admin register failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`admin-login ${darkMode ? "dark" : "light"}`}>
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Register</h1>
          <p>Create your admin account</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@portfolio.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="register-link">
            Already have an account? <a href="/admin">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
