import React from 'react';
import '../index.css';
import '../recruiter.css';

const PublicJobsHeader = ({ onGoToHome }) => {
  return (
    <header className="recruiter-header">
      <div className="header-content">
        <div className="logo" onClick={onGoToHome} style={{ cursor: 'pointer' }}>
          <i className="fas fa-briefcase"></i>
          <span>Project Portal</span>
        </div>
        
        <nav className="header-nav">
        </nav>
      </div>
    </header>
  );
};

export default PublicJobsHeader;
