import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span className="footer-text">
          © {currentYear} VestyWinBox | Tous droits réservés
        </span>
      </div>
    </footer>
  );
};

export default Footer; 