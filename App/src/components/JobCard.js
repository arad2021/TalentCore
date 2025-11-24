import React, { useState } from 'react';
import JobDetailsModal from './JobDetailsModal';

const JobCard = ({ job, onApplyToJob, applicationStatus, index }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleApply = () => {
    if (!applicationStatus) {
      onApplyToJob(job.id);
    }
  };

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

      {applicationStatus && (
        <div className="status-top-center">
          <span className="status-badge" style={{
            background: applicationStatus === 'PENDING' ? '#fff3cd' : '#e2e3e5',
            color: '#856404',
            padding: '6px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid #ffeeba'
          }}>
            {`STATUS APPLICATION: ${String(applicationStatus).toUpperCase()}`}
          </span>
        </div>
      )}
      
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
          <i className="fas fa-certificate"></i>
          <span>Degree: {job.degree || job.ticket?.degree || '—'}</span>
        </div>
      </div>
      
      {/* Description removed to keep layout clean */}
      
      <div className="job-footer">
        <div className="job-actions-left">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsDetailsOpen(true)}
          >
            <i className="fas fa-eye"></i> View Details
          </button>
        </div>
        <div className="job-actions-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleApply}
            disabled={!!applicationStatus}
            style={applicationStatus ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
          >
            <i className="fas fa-paper-plane"></i> {applicationStatus ? 'Applied' : 'Apply Now'}
          </button>
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

export default JobCard;
