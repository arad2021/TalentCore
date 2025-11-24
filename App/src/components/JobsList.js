import React from 'react';
import JobCard from './JobCard';

const JobsList = ({ jobs, onApplyToJob, applicationsByJobId = {}, isLoading }) => {
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner"></i>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="no-jobs">
        <i className="fas fa-search"></i>
        <h3>No jobs found</h3>
        <p>Try adjusting your search criteria or filters</p>
      </div>
    );
  }

  return (
    <div className="jobs-grid">
      {jobs.map((job, index) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onApplyToJob={onApplyToJob}
          applicationStatus={applicationsByJobId[job.id]}
          index={index}
        />
      ))}
    </div>
  );
};

export default JobsList;
