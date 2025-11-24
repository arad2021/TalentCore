import React from 'react';

const HomeHeader = ({ onOpenJobs, onLogout, isLoggedIn }) => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogoKeydown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <div 
          className="logo" 
          role="button" 
          tabIndex="0" 
          onClick={scrollToTop} 
          onKeyDown={handleLogoKeydown} 
          aria-label="Project Portal Home"
        >
          <i className="fas fa-briefcase"></i>
          <span>Project Portal</span>
        </div>
        <nav className="nav-menu" id="navigation" role="navigation" aria-label="Main navigation">
          <a 
            href="#features" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('features');
            }}
            role="menuitem" 
            aria-label="Features section"
          >
            <i className="fas fa-star" aria-hidden="true"></i> Features
          </a>
          <a 
            href="#how-it-works" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('how-it-works');
            }}
            role="menuitem" 
            aria-label="How it works section"
          >
            <i className="fas fa-cogs" aria-hidden="true"></i> How it Works
          </a>
          <a 
            href="#testimonials" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('testimonials');
            }}
            role="menuitem" 
            aria-label="Reviews section"
          >
            * Reviews
          </a>
          <a 
            href="#contact" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
            role="menuitem" 
            aria-label="Contact section"
          >
            <i className="fas fa-envelope" aria-hidden="true"></i> Contact
          </a>
          <a 
            href="#" 
            className="nav-item" 
            onClick={(e) => {
              e.preventDefault();
              if (onOpenJobs) {
                onOpenJobs();
              }
            }}
            role="menuitem" 
            aria-label="View available jobs"
          >
            <i className="fas fa-briefcase" aria-hidden="true"></i> Job List
          </a>
          {isLoggedIn && onLogout && (
            <button 
              className="logout-btn" 
              onClick={onLogout} 
              role="menuitem" 
              aria-label="Logout from portal"
            >
              <i className="fas fa-sign-out-alt" aria-hidden="true"></i> Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HomeHeader;
