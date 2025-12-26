import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const ADMIN_EMAIL = 'timetomisin@gmail.com';
    if (formData.email !== ADMIN_EMAIL) {
      setError('Only authorized email can access the admin dashboard');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://port-back-jrb3.onrender.com/api/admin/login', formData);
      localStorage.setItem('adminToken', response.data.token);
      setSuccess('✓ Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error logging in');
      setLoading(false);
    }
  };

  return (
    <div className={`admin-login ${darkMode ? 'dark' : 'light'}`}>
      <div className="login-container">
        <div className="login-card">
          <h1>Admin Login</h1>
          <p>Manage your portfolio projects</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

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
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="register-link">
            Don't have an account? <a href="/admin/register">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
