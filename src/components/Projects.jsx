import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import './Projects.css';

const DEFAULT_PROJECTS = [
    {
      _id: '1',
      title: 'She Leads Africa Website Clone',
      description: 'A static website clone showcasing modern HTML & CSS design principles. This project demonstrates responsive layout design, semantic HTML structure, and clean CSS styling. Perfect example of frontend fundamentals implementation.',
      image: 'https://sheleadsafrica.org/wp-content/uploads/elementor/thumbs/2015-2025-IMPACT-REPORT-rexzrcx5hwzztzthy7zcj1jh8q1jd7cumpqhlelme8.jpg',
      liveLink: 'https://wavy91.github.io/project/',
      githubLink: 'https://github.com/WAVY91/project',
      technologies: ['HTML', 'CSS', 'Bootstrap'],
      featured: false,
    },
    {
      _id: '2',
      title: 'Airbnb Website Clone',
      description: 'A responsive booking platform clone that replicates key features of Airbnb. Built with focus on responsive design, intuitive user interface, and modern web standards. Showcases expertise in creating beautiful and functional layouts.',
      image: 'https://www.shutterstock.com/image-photo/stuttgart-germany-11302022-person-holding-260nw-2261860477.jpg',
      liveLink: 'https://wavy91.github.io/bnb/',
      githubLink: 'https://github.com/WAVY91/bnb',
      technologies: ['HTML', 'CSS', 'Bootstrap'],
      featured: false,
    },
    {
      _id: '3',
      title: 'Artisan Project - Service Connect Platform',
      description: 'A full-stack dynamic web application connecting customers with skilled artisans. Features user authentication, project management, real-time updates, and secure payment integration. Built with modern web technologies and Firebase authentication for secure user management.',
      image: 'https://www.figma.com/community/resource/30ea85e1-e78b-4cd2-b17d-d1b150bd74ec/thumbnail',
      liveLink: 'https://artisan-project-orpin.vercel.app/',
      githubLink: 'https://github.com/WAVY91/artisan-project',
      technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'Firebase'],
      featured: true,
    },
];

const Projects = () => {
  const { darkMode } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (projectId) => {
    setImageErrors(prev => ({
      ...prev,
      [projectId]: true
    }));
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://port-back-wyco.onrender.com/api/projects');
        if (response.data && response.data.length > 0) {
          setProjects(response.data);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(DEFAULT_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <section id="projects" className={`projects ${darkMode ? 'dark' : 'light'}`}>
      <div className="projects-container">
        <h2 className="section-title">Featured Projects</h2>
        <p className="projects-subtitle">Check out some of my recent work and projects</p>
        
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-image">
                {!imageErrors[project._id] ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    onError={() => handleImageError(project._id)}
                  />
                ) : (
                  <div className="image-placeholder">
                    <span>{project.title}</span>
                  </div>
                )}
                {project.featured && <span className="featured-badge">Featured</span>}
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies && project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                    Live Demo
                  </a>
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-small">
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
