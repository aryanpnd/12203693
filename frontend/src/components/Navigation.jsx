import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Log } from '../services/logger.js';

const Navigation = () => {
  const location = useLocation();

  const handleNavClick = (path) => {
    Log('frontend', 'info', 'component', `Navigation clicked: ${path}`);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" onClick={() => handleNavClick('/')}>
            URL Shortener
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => handleNavClick('/')}
          >
            Home
          </Link>
          <Link 
            to="/stats" 
            className={location.pathname === '/stats' ? 'active' : ''}
            onClick={() => handleNavClick('/stats')}
          >
            Statistics
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;