import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../services/apiService';
import { toast } from './ToastContainer';
import { parseCommaSeparated } from '../utils/stringUtils';

const CandidateProfileView = ({ candidateId, onClose }) => {
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (candidateId) {
      loadCandidateProfile();
    }
  }, [candidateId]);

  const loadCandidateProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await recruiterAPI.getCandidateProfile(candidateId);
      if (result.success) {
        setCandidate(result.data);
      } else {
        setError(result.message || 'Failed to load candidate profile');
      }
    } catch (err) {
      const errorMessage = 'Failed to load candidate profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCV = async () => {
    try {
      const result = await recruiterAPI.getCandidateCV(candidateId);
      if (result.success) {
        // Open CV in new tab
        const url = window.URL.createObjectURL(result.blob);
        window.open(url, '_blank');
        toast.success('CV opened in new tab');
      } else {
        toast.error(result.message || 'Failed to load CV');
      }
    } catch (err) {
      toast.error('Failed to load CV');
    }
  };

  const handleDownloadCV = async () => {
    try {
      const result = await recruiterAPI.getCandidateCV(candidateId);
      if (result.success) {
        // Create download link
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `candidate_${candidateId}_cv.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('CV downloaded successfully');
      } else {
        toast.error(result.message || 'Failed to download CV');
      }
    } catch (err) {
      toast.error('Failed to download CV');
    }
  };

  if (loading) {
    return (
      <div className="candidate-profile-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="loading-container">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading candidate profile...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-profile-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="error-container">
              <div className="error-message">
                <i className="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Profile</h3>
                <p>{error}</p>
                <div className="error-actions">
                  <button className="btn btn-primary" onClick={loadCandidateProfile}>
                    Retry
                  </button>
                  <button className="btn btn-secondary" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="candidate-profile-modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="error-container">
              <div className="error-message">
                <i className="fas fa-user-times"></i>
                <h3>Candidate Not Found</h3>
                <p>The candidate profile could not be found.</p>
                <button className="btn btn-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-profile-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{candidate.firstName} {candidate.lastName}</h2>
            <button className="close-btn" onClick={onClose} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="candidate-profile-content">
            {/* Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <i className="fas fa-user"></i> Personal Info
              </button>
              <button 
                className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
                onClick={() => setActiveTab('ticket')}
              >
                <i className="fas fa-ticket-alt"></i> Job Preferences
              </button>
              <button 
                className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <i className="fas fa-code"></i> Projects
              </button>
              <button 
                className={`tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
                onClick={() => setActiveTab('cv')}
              >
                <i className="fas fa-file-alt"></i> CV
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'personal' && (
                <div className="personal-info-section">
                  <h4>Personal Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name:</label>
                      <span>{candidate.firstName} {candidate.lastName}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{candidate.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone:</label>
                      <span>{candidate.phoneNumber}</span>
                    </div>
                    <div className="info-item">
                      <label>Field:</label>
                      <span>{candidate.ticket?.field || 'Not specified'}</span>
                    </div>
                    {(candidate.linkedinUrl || candidate.facebookUrl) && (
                      <>
                        {candidate.linkedinUrl && (
                          <div className="info-item">
                            <label>LinkedIn:</label>
                            <span>
                              <a 
                                href={candidate.linkedinUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-url-link"
                              >
                                {candidate.linkedinUrl}
                              </a>
                            </span>
                          </div>
                        )}
                        {candidate.facebookUrl && (
                          <div className="info-item">
                            <label>Facebook:</label>
                            <span>
                              <a 
                                href={candidate.facebookUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-url-link"
                              >
                                {candidate.facebookUrl}
                              </a>
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'ticket' && (
                <div className="ticket-section">
                  <h4>Job Preferences</h4>
                  {candidate.ticket ? (
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Location:</label>
                        <span>{candidate.ticket.city || 'Not specified'}</span>
                      </div>
                      <div className="info-item">
                        <label>Field & Experience:</label>
                        <span>
                          {(() => {
                            const fields = candidate.ticket.field 
                              ? candidate.ticket.field.split(',').map(f => f.trim()).filter(f => f)
                              : [];
                            const experiences = candidate.ticket.experience 
                              ? candidate.ticket.experience.split(',').map(e => e.trim()).filter(e => e)
                              : [];
                            
                            if (fields.length === 0 && experiences.length === 0) {
                              return 'Not specified';
                            }
                            
                            const pairs = [];
                            const maxLength = Math.max(fields.length, experiences.length);
                            
                            for (let i = 0; i < maxLength; i++) {
                              pairs.push({
                                field: fields[i] || 'Not specified',
                                experience: experiences[i] || 'Not specified'
                              });
                            }
                            
                            return (
                              <table className="field-experience-table">
                                <thead>
                                  <tr>
                                    <th>Field</th>
                                    <th>Experience (Years)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pairs.map((pair, index) => (
                                    <tr key={index}>
                                      <td>{pair.field}</td>
                                      <td>{pair.experience}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            );
                          })()}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Remote Work:</label>
                        <span>
                          {(() => {
                            const remoteOptions = parseCommaSeparated(candidate.ticket.remote);
                            return remoteOptions && remoteOptions.length > 0 
                              ? remoteOptions.join(', ') 
                              : 'Not specified';
                          })()}
                        </span>
                      </div>
                      <div className="info-item">
                        <label>Job Type:</label>
                        <span>
                          {(() => {
                            const jobTypes = parseCommaSeparated(candidate.ticket.jobType);
                            return jobTypes && jobTypes.length > 0 
                              ? jobTypes.join(', ') 
                              : 'Not specified';
                          })()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data">No job preferences specified</p>
                  )}
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="projects-section">
                  <h4>GitHub Projects</h4>
                  {candidate.projects && candidate.projects.getAllGitHubProjects ? (
                    (() => {
                      const githubProjects = candidate.projects.getAllGitHubProjects();
                      const projectEntries = Object.entries(githubProjects);
                      
                      if (projectEntries.length > 0) {
                        return (
                          <div className="projects-list">
                            {projectEntries.map(([projectName, githubLink]) => (
                              <div key={projectName} className="project-item">
                                <div className="project-info">
                                  <h5>{projectName}</h5>
                                  <a 
                                    href={githubLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="project-link"
                                  >
                                    <i className="fab fa-github"></i> View on GitHub
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return <p className="no-data">No projects available</p>;
                      }
                    })()
                  ) : (
                    <p className="no-data">No projects available</p>
                  )}
                </div>
              )}

              {activeTab === 'cv' && (
                <div className="cv-section">
                  <h4>CV Information</h4>
                  {candidate.cv ? (
                    <div className="cv-info">
                      <div className="cv-status">
                        <i className="fas fa-check-circle"></i>
                        <span>CV is available</span>
                      </div>
                      <div className="cv-actions">
                        <button className="btn btn-primary" onClick={handleViewCV}>
                          <i className="fas fa-eye"></i> View CV
                        </button>
                        <button className="btn btn-secondary" onClick={handleDownloadCV}>
                          <i className="fas fa-download"></i> Download CV
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-cv">
                      <i className="fas fa-exclamation-circle"></i>
                      <span>No CV uploaded</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfileView;
