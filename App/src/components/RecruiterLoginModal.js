import React, { useState } from 'react';
import { recruiterAPI, candidateAPI } from '../services/apiService';

const RecruiterLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Only try recruiter login since this is the recruiter login modal
      const result = await recruiterAPI.signIn(email);

      if (result.success) {
        // User is a recruiter
        onLoginSuccess('recruiter', email, result.userId);
        return;
      } else {
        // Check if the email exists as a candidate to give a helpful error message
        const candidateResult = await candidateAPI.signIn(email);
        if (candidateResult.success) {
          setError('This email is registered as a job seeker. Please use the job seeker login.');
        } else {
          setError('No recruiter account found with this email address');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBack}>
      <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Recruiter Sign In</h2>
          <button className="modal-close" onClick={handleBack}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body">
          <p className="modal-description">
            Enter your email address to sign in to your recruiter account
          </p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email address"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleBack}
                disabled={isLoading}
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Footer removed per request */}
      </div>
    </div>
  );
};

export default RecruiterLoginModal;
