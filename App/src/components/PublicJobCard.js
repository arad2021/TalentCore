import React, { useState } from 'react';
import JobDetailsModal from './JobDetailsModal';
import '../recruiter-jobs.css';

const PublicJobCard = ({ job, hideApplyButton = false, onSignInClick }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Description removed from card to keep layout clean

  const getRemoteIcon = (remote) => {
    switch (remote) {
      case 'Yes':
        return <i className="fas fa-home"></i>;
      case 'No':
        return <i className="fas fa-building"></i>;
      case 'Hybrid':
        return <i className="fas fa-laptop-house"></i>;
      default:
        return <i className="fas fa-map-marker-alt"></i>;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Full-time':
        return '#28a745';
      case 'Part-time':
        return '#ffc107';
      case 'Contract':
        return '#17a2b8';
      case 'Internship':
        return '#6f42c1';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="job-card">
      <div className="job-header">
        <div className="job-title-section">
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <div className="job-type-badge" style={{ backgroundColor: getTypeColor(job.type) }}>
          {job.type}
        </div>
      </div>

      <div className="job-details">
        <div className="job-city">
          <i className="fas fa-city"></i>
          <span>{job.city}</span>
        </div>
        <div className="job-remote">
          {getRemoteIcon(job.remote)}
          <span>{job.remote === 'Remote' ? 'Remote' : job.remote === 'On-Site' ? 'On-Site' : 'Hybrid'}</span>
        </div>
        <div className="job-field">
          <i className="fas fa-tag"></i>
          <span>{job.field}</span>
        </div>
        <div className="job-experience">
          <i className="fas fa-briefcase"></i>
          <span>Experience: {job.experience}</span>
        </div>
        <div className="job-type">
          <i className="fas fa-clock"></i>
          <span>Job Type: {job.jobType}</span>
        </div>
      </div>

      {/* Description removed */}

      <div className="job-footer">
        <div className="job-actions-left">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsDetailsOpen(true)}
          >
            <i className="fas fa-eye"></i> View Details
          </button>
        </div>
        <div className="job-actions-right">
          {!hideApplyButton && (
            <button 
              className="btn btn-primary" 
              onClick={onSignInClick}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-sign-in-alt"></i>
              Apply
            </button>
          )}
        </div>
      </div>

      {isDetailsOpen && (
        <JobDetailsModal 
          job={job}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </div>
  );
};

export default PublicJobCard;
