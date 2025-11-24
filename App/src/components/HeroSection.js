import React, { useState } from 'react';
import UserTypeSelectionModal from './UserTypeSelectionModal';

const HeroSection = ({ onLoginSuccess }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setShowRegisterModal(true);
  };

  const handleLoginSuccess = (userType, email, userId) => {
    setShowLoginModal(false);
    onLoginSuccess(userType, email, userId);
  };

  const handleRegisterSuccess = (userType, email, userId) => {
    setShowRegisterModal(false);
    onLoginSuccess(userType, email, userId);
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-background">
        <div className="hero-particles"></div>
        <div className="hero-gradient"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title fade-in-up">
              Your Career Gateway to 
              <span className="gradient-text"> Success</span>
            </h1>
            <p className="hero-subtitle fade-in-up" style={{ animationDelay: '0.2s' }}>
              Connect talented professionals with top companies. 
              Find your dream job or discover exceptional candidates in our innovative platform.
            </p>
            <div className="hero-buttons fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a href="#" onClick={handleLoginClick} className="btn btn-primary btn-large">
                <i className="fas fa-sign-in-alt"></i>
                Login
              </a>
               <a href="#" onClick={handleRegisterClick} className="btn btn-secondary btn-large">
                 <i className="fas fa-user-plus"></i>
                 Register
               </a>
            </div>
          </div>
        </div>
      </div>
      
      <UserTypeSelectionModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onExistingUser={handleLoginSuccess}
        onNewUser={handleLoginSuccess}
        actionType="login"
      />
      
      <UserTypeSelectionModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onExistingUser={handleRegisterSuccess}
        onNewUser={handleRegisterSuccess}
        actionType="register"
      />
    </section>
  );
};

export default HeroSection;
