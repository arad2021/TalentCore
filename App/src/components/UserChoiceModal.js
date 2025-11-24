import React, { useState } from 'react';
import UserTypeSelectionModal from './UserTypeSelectionModal';

const UserChoiceModal = ({ isOpen, onClose, onExistingUser, onNewUser }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  if (!isOpen) return null;

  const handleExistingUserClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userType, email, userId) => {
    setShowLoginModal(false);
    onExistingUser(userType, email, userId);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  const handleNewUserClick = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterSuccess = (userType, email, userId) => {
    setShowRegisterModal(false);
    onNewUser(userType, email, userId);
  };

  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Welcome to Project Portal</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Choose how you'd like to continue:
          </p>
          
          <div className="choice-buttons">
            <button 
              className="choice-btn existing-user-btn"
              onClick={handleExistingUserClick}
            >
              <div className="choice-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="choice-content">
                <h3>I have an account</h3>
                <p>Sign in to your existing account</p>
              </div>
            </button>
            
            <button 
              className="choice-btn new-user-btn"
              onClick={handleNewUserClick}
            >
              <div className="choice-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="choice-content">
                <h3>Create new account</h3>
                <p>Join our community and start your journey</p>
              </div>
            </button>
          </div>
        </div>
        
        <div className="modal-footer">
          <p className="modal-help">
            <i className="fas fa-info-circle"></i>
            You can always change your choice later
          </p>
        </div>
      </div>
      
      <UserTypeSelectionModal 
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onExistingUser={handleLoginSuccess}
        actionType="login"
      />
      
      <UserTypeSelectionModal 
        isOpen={showRegisterModal}
        onClose={handleRegisterModalClose}
        onNewUser={handleRegisterSuccess}
        actionType="register"
      />
    </div>
  );
};

export default UserChoiceModal;
