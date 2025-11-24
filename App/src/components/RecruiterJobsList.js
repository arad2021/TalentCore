import React from 'react';
import RecruiterJobCard from './RecruiterJobCard';

const RecruiterJobsList = ({ jobs, isLoading }) => {
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
        <RecruiterJobCard 
          key={job.id} 
          job={job} 
          index={index}
        />
      ))}
    </div>
  );
};

export default RecruiterJobsList;
