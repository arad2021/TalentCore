import React from 'react';
import PublicJobCard from './PublicJobCard';
import '../recruiter-jobs.css';

const PublicJobsList = ({ jobs, isLoading, hideApplyButton = false, onSignInClick }) => {
  if (isLoading) {
    return (
      <div className="jobs-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading job opportunities...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="no-jobs">
        <div className="no-jobs-icon">
          <i className="fas fa-search"></i>
        </div>
        <h3>No jobs found</h3>
        <p>Try adjusting your search criteria or check back later for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="jobs-grid">
      {jobs.map((job) => (
        <PublicJobCard key={job.id} job={job} hideApplyButton={hideApplyButton} onSignInClick={onSignInClick} />
      ))}
    </div>
  );
};

export default PublicJobsList;
