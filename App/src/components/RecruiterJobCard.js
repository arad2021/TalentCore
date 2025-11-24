import React, { useState } from 'react';
import JobDetailsModal from './JobDetailsModal';

const RecruiterJobCard = ({ job, index }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div 
      className="job-card fade-in-up" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="job-header">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <p className="job-company">{job.company}</p>
        </div>
        <span className="job-type-badge">{job.type}</span>
      </div>
      
      <div className="job-details">
        <div className="job-detail">
          <i className="fas fa-city"></i>
          <span>{job.city}</span>
        </div>
        <div className="job-detail">
          <i className="fas fa-home"></i>
          <span>Remote: {job.remote}</span>
        </div>
        <div className="job-detail">
          <i className="fas fa-tag"></i>
          <span>Field: {job.field}</span>
        </div>
        <div className="job-detail">
          <i className="fas fa-briefcase"></i>
          <span>Experience: {job.experience}</span>
        </div>
        <div className="job-detail">
          <i className="fas fa-clock"></i>
          <span>Job Type: {job.jobType}</span>
        </div>
        <div className="job-detail">
          <i className="fas fa-user-graduate"></i>
          <span>Degree: {job?.ticket?.degree || '—'}</span>
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
        <div className="job-actions-right"></div>
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

export default RecruiterJobCard;
