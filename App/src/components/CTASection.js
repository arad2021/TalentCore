import React, { useState } from 'react';
import UserChoiceModal from './UserChoiceModal';
import RecruiterChoiceModal from './RecruiterChoiceModal';

const CTASection = ({ onLoginSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);

  const handleFindJobsClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleExistingUser = (userType, email, userId) => {
    setShowModal(false);
    // Use the onLoginSuccess callback instead of redirecting
    if (onLoginSuccess) {
      onLoginSuccess(userType, email, userId);
    }
  };

  const handleNewUser = (userType, email, userId) => {
    setShowModal(false);
    // Use the onLoginSuccess callback instead of redirecting
    if (onLoginSuccess) {
      onLoginSuccess(userType, email, userId);
    }
  };

  const handleStartHiringClick = (e) => {
    e.preventDefault();
    setShowRecruiterModal(true);
  };

  const handleRecruiterExistingUser = (userType, email, userId) => {
    setShowRecruiterModal(false);
    // Use the onLoginSuccess callback instead of redirecting
    if (onLoginSuccess) {
      onLoginSuccess(userType, email, userId);
    }
  };

  const handleRecruiterNewUser = (userType, email, userId) => {
    setShowRecruiterModal(false);
    // Use the onLoginSuccess callback instead of redirecting
    if (onLoginSuccess) {
      onLoginSuccess(userType, email, userId);
    }
  };
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Journey?</h2>
          <p className="cta-subtitle">Join thousands of professionals who have found their dream careers with us</p>
          <div className="cta-buttons">
            <a href="#" onClick={handleFindJobsClick} className="btn btn-primary btn-large">
              <i className="fas fa-user"></i>
              Get Started as Job Seeker
            </a>
            <a href="#" onClick={handleStartHiringClick} className="btn btn-secondary btn-large">
              <i className="fas fa-building"></i>
              Start Hiring Talent
            </a>
          </div>
        </div>
      </div>
      
      <UserChoiceModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onExistingUser={handleExistingUser}
        onNewUser={handleNewUser}
      />
      
      <RecruiterChoiceModal 
        isOpen={showRecruiterModal}
        onClose={() => setShowRecruiterModal(false)}
        onExistingUser={handleRecruiterExistingUser}
        onNewUser={handleRecruiterNewUser}
      />
    </section>
  );
};

export default CTASection;
