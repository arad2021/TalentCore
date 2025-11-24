import React from 'react';

const RecruiterHeader = ({ onRefreshProfile, onLogout, onOpenJobs, onGoToHome, recruiterName = 'Sarah' }) => {
  const handleLogoKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onGoToHome) {
        onGoToHome();
      }
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
          id="recruiterWelcomeName"
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
              onOpenJobs();
            }}
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

export default RecruiterHeader;
