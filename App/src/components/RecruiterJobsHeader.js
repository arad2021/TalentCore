import React from 'react';

const RecruiterJobsHeader = ({ onGoToProfile, onGoToHome, onLogout, recruiterName = 'Recruiter' }) => {
  const handleLogoKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onGoToHome();
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div 
          className="logo" 
          role="button" 
          tabIndex="0" 
          onClick={onGoToHome} 
          onKeyDown={handleLogoKeydown} 
          aria-label="Go to HomePage" 
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-home"></i>
          HomePage
        </div>
        <nav className="nav-menu" id="navigation" role="navigation" aria-label="Main navigation">
          <a 
            href="#" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault();
              onGoToProfile();
            }} 
            role="menuitem" 
            aria-label="Recruiter profile page"
          >
            <i className="fas fa-user" aria-hidden="true"></i> Profile
          </a>
          <a 
            href="#" 
            className="nav-item active" 
            role="menuitem" 
            aria-label="Jobs page"
          >
            <i className="fas fa-briefcase" aria-hidden="true"></i> Job List
          </a>
          <button 
            className="logout-btn" 
            onClick={onLogout} 
            role="menuitem" 
            aria-label="Logout from portal"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default RecruiterJobsHeader;
