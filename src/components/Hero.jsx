import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Hero.css';

const Hero = () => {
  const { darkMode } = useContext(ThemeContext);

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/resume/CV.pdf';
    link.download = 'CV.pdf';
    link.click();
  };

  return (
    <section className={`hero ${darkMode ? 'dark' : 'light'}`}>
      <div className="hero-content">
        <h1 className="hero-title">Hi, I'm Ajakaiye Oluwatomisin</h1>
        <p className="hero-subtitle">Full-Stack Developer | Building beautiful and functional web experiences</p>
        <p className="hero-description">
          I specialize in creating responsive, scalable web applications using modern technologies.
          With expertise in React, Node.js, and MongoDB, I turn ideas into reality with clean, 
          efficient code and a passion for excellence.
        </p>
        <div className="hero-buttons">
          <a href="#projects" className="btn btn-primary">View My Work</a>
          <a href="#contact" className="btn btn-secondary">Get In Touch</a>
          <button onClick={downloadCV} className="btn btn-primary">📥 Download CV</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
