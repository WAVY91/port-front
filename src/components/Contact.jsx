import { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import './Contact.css';

const Contact = () => {
  const { darkMode } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    setSuccess(false);

    try {
      await axios.post('https://port-back-wyco.onrender.com/api/contact/send', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className={`contact ${darkMode ? 'dark' : 'light'}`}>
      <div className="contact-container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-subtitle">Have a question or want to work together? Feel free to reach out!</p>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          {success && <div className="success-message">✓ Message sent successfully!</div>}
          {error && <div className="error-message">✗ {error}</div>}

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone (Optional)"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
