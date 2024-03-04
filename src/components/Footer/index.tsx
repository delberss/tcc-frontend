import React from 'react';
import './index.css';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className='footer-content'>
        <p>&copy; 2024 TCC de Delber Soares. Todos os direitos reservados.</p>
        <div className="social-icons">
        
        <a href="https://www.linkedin.com/in/delberss" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>

        <a href="https://github.com/delberss" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>

        <a href="https://www.instagram.com/delberss" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
