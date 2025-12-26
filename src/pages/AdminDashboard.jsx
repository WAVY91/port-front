import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    liveLink: '',
    githubLink: '',
    technologies: '',
    featured: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    } else {
      fetchProjects();
      fetchMessages();
    }
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://port-back-jrb3.onrender.com/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://port-back-jrb3.onrender.com/api/contact/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`https://port-back-jrb3.onrender.com/api/contact/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedMessage(null);
        fetchMessages();
      } catch {
        alert('Error deleting message');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const techArray = formData.technologies.split(',').map(t => t.trim());
      const payload = {
        ...formData,
        technologies: techArray,
      };

      if (editingId) {
        await axios.put(`https://port-back-jrb3.onrender.com/api/projects/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('https://port-back-jrb3.onrender.com/api/projects', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setFormData({
        title: '',
        description: '',
        image: '',
        liveLink: '',
        githubLink: '',
        technologies: '',
        featured: false,
      });
      setShowForm(false);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      alert('Error saving project: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      liveLink: project.liveLink,
      githubLink: project.githubLink,
      technologies: project.technologies.join(', '),
      featured: project.featured,
    });
    setEditingId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`https://port-back-jrb3.onrender.com/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProjects();
      } catch {
        alert('Error deleting project');
      }
    }
  };

  const updateMessageStatus = async (id, attended) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`https://port-back-jrb3.onrender.com/api/contact/${id}`, { attended }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedMessage = { ...selectedMessage, attended };
      setSelectedMessage(updatedMessage);
      fetchMessages();
    } catch {
      alert('Error updating message status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark' : 'light'}`}>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            if (showForm) {
              setFormData({
                title: '',
                description: '',
                image: '',
                liveLink: '',
                githubLink: '',
                technologies: '',
                featured: false,
              });
            }
          }}
        >
          {showForm ? 'Cancel' : 'Add New Project'}
        </button>

        {showForm && (
          <form className="project-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>

            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your project"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="image">Image URL *</label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="liveLink">Live Link *</label>
              <input
                type="url"
                id="liveLink"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleChange}
                required
                placeholder="https://project.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="githubLink">GitHub Link *</label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                required
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies (comma-separated) *</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <label htmlFor="featured">Mark as featured</label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
            </button>
          </form>
        )}

        <div className="projects-list">
          <h2>Your Projects ({projects.length})</h2>
          
          {projects.length === 0 ? (
            <p className="no-projects">No projects yet. Add your first project above!</p>
          ) : (
            <div className="projects-table">
              {projects.map((project) => (
                <div key={project._id} className="project-item">
                  <div className="project-details">
                    <h3>{project.title}</h3>
                    <p>{project.description.substring(0, 100)}...</p>
                    <div className="project-links-admin">
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live</a>
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                  </div>
                  <div className="project-actions">
                    <button className="btn btn-edit" onClick={() => handleEdit(project)}>Edit</button>
                    <button className="btn btn-delete" onClick={() => handleDelete(project._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-section">
          <h2>Contact Messages ({messages.length})</h2>
          
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet.</p>
          ) : selectedMessage ? (
            <div className="message-detail">
              <button className="btn btn-secondary" onClick={() => setSelectedMessage(null)}>← Back to Messages</button>
              <div className="message-content">
                <h3>{selectedMessage.subject}</h3>
                <div className="message-status">
                  <span className={`status-badge ${selectedMessage.attended ? 'attended' : 'pending'}`}>
                    {selectedMessage.attended ? '✓ Attended' : '○ Not Attended'}
                  </span>
                </div>
                <div className="message-info">
                  <p><strong>From:</strong> {selectedMessage.name}</p>
                  <p><strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
                  {selectedMessage.phone && <p><strong>Phone:</strong> {selectedMessage.phone}</p>}
                  <p><strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <div className="message-body">
                  <h4>Message:</h4>
                  <p>{selectedMessage.message}</p>
                </div>
                <div className="message-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => updateMessageStatus(selectedMessage._id, !selectedMessage.attended)}
                  >
                    {selectedMessage.attended ? 'Mark as Not Attended' : 'Mark as Attended'}
                  </button>
                  <button className="btn btn-delete" onClick={() => deleteMessage(selectedMessage._id)}>Delete Message</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg._id} className="message-item" onClick={() => setSelectedMessage(msg)}>
                  <div className="message-preview">
                    <div className="message-header">
                      <h4>{msg.subject}</h4>
                      <span className={`status-badge ${msg.attended ? 'attended' : 'pending'}`}>
                        {msg.attended ? '✓' : '○'}
                      </span>
                    </div>
                    <p className="sender"><strong>{msg.name}</strong> ({msg.email})</p>
                    <p className="message-text">{msg.message.substring(0, 100)}...</p>
                    <p className="date">{new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
