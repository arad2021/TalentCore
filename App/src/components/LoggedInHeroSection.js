import React from 'react';

const LoggedInHeroSection = ({ onGoToPortal, userType }) => {

  const getPortalButtonText = () => {
    return userType === 'recruiter' ? 'Go to My Profile' : 'Go to My Portal';
  };

  const getPortalButtonIcon = () => {
    return userType === 'recruiter' ? 'fas fa-building' : 'fas fa-user';
  };

  return (
    <section id="hero" className="hero" role="banner">
      <div className="hero-background">
        <div className="hero-particles"></div>
        <div className="hero-gradient"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome Back to <span className="highlight">Project Portal</span>
            </h1>
            <p className="hero-subtitle">
              {userType === 'recruiter' 
                ? 'Manage your recruitment activities and discover top talent for your company.'
                : 'Continue your job search journey and discover amazing career opportunities.'
              }
            </p>
            
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={onGoToPortal}
                aria-label={getPortalButtonText()}
              >
                <i className={getPortalButtonIcon()}></i>
                {getPortalButtonText()}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default LoggedInHeroSection;
