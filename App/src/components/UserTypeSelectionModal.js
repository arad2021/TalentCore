import React from 'react';
import LoginModal from './LoginModal';
import RecruiterLoginModal from './RecruiterLoginModal';
import RegisterModal from './RegisterModal';
import RecruiterRegisterModal from './RecruiterRegisterModal';

const UserTypeSelectionModal = ({ 
  isOpen, 
  onClose, 
  onExistingUser, 
  onNewUser, 
  actionType // 'login' or 'register'
}) => {
  const [showCandidateModal, setShowCandidateModal] = React.useState(false);
  const [showRecruiterModal, setShowRecruiterModal] = React.useState(false);

  if (!isOpen) return null;

  const handleCandidateClick = () => {
    // Open candidate modal (login or register based on actionType)
    setShowCandidateModal(true);
  };

  const handleRecruiterClick = () => {
    // Open recruiter modal (login or register based on actionType)
    setShowRecruiterModal(true);
  };

  const handleCandidateSuccess = (userType, email, userId) => {
    setShowCandidateModal(false);
    onExistingUser(userType, email, userId);
  };

  const handleRecruiterSuccess = (userType, email, userId) => {
    setShowRecruiterModal(false);
    onExistingUser(userType, email, userId);
  };

  const handleCandidateModalClose = () => {
    setShowCandidateModal(false);
  };

  const handleRecruiterModalClose = () => {
    setShowRecruiterModal(false);
  };

  const actionText = actionType === 'login' ? 'Login' : 'Register';

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{actionText} to Project Portal</h2>
            <button className="modal-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="modal-body">
            <p className="modal-description">
              Choose your account type to {actionText.toLowerCase()}:
            </p>
            
            <div className="choice-buttons">
              <button 
                className="choice-btn candidate-btn"
                onClick={handleCandidateClick}
              >
                <div className="choice-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="choice-content">
                  <h3>{actionText} as Candidate</h3>
                  {actionType === 'register' && <p>I'm looking for work</p>}
                </div>
              </button>
              
              <button 
                className="choice-btn recruiter-btn"
                onClick={handleRecruiterClick}
              >
                <div className="choice-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="choice-content">
                  <h3>{actionText} as Recruiter</h3>
                  {actionType === 'register' && <p>I'm looking for talent</p>}
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
      </div>
      
      {actionType === 'login' ? (
        <>
          <LoginModal 
            isOpen={showCandidateModal}
            onClose={handleCandidateModalClose}
            onLoginSuccess={handleCandidateSuccess}
          />
          
          <RecruiterLoginModal 
            isOpen={showRecruiterModal}
            onClose={handleRecruiterModalClose}
            onLoginSuccess={handleRecruiterSuccess}
          />
        </>
      ) : (
        <>
          <RegisterModal 
            isOpen={showCandidateModal}
            onClose={handleCandidateModalClose}
            onRegisterSuccess={handleCandidateSuccess}
          />
          
          <RecruiterRegisterModal 
            isOpen={showRecruiterModal}
            onClose={handleRecruiterModalClose}
            onRegisterSuccess={handleRecruiterSuccess}
          />
        </>
      )}
    </>
  );
};

export default UserTypeSelectionModal;
