import React, { useState } from 'react';
import JobPortal from './JobPortal';

const JobDescription = ({ description, maxWords = 15 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!description || typeof description !== 'string') {
    return <div className="project-description">No description available</div>;
  }
  
  const words = description.split(' ').filter(word => word.length > 0);
  const shouldTruncate = words.length > maxWords;
  const displayText = isExpanded 
    ? description 
    : words.slice(0, maxWords).join(' ') + '...';
  
  return (
    <div className="project-description">
      {displayText}
      {shouldTruncate && (
        <button 
          className="show-more-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  );
};

const JobsManagementSection = ({ 
  jobs, 
  onAddJob, 
  onEditJob, 
  onToggleJobStatus, 
  onViewCandidates,
  recruiterId,
  onCreateJob,
  onOpenJobPortal
}) => {
  const handleCreateJob = () => {
    onCreateJob();
  };

  const handleEditJob = (jobId) => {
    onEditJob(jobId);
  };

  const handleJobPortal = (job) => {
    onOpenJobPortal(job);
  };

  const handleToggleStatus = (jobId) => {
    onToggleJobStatus(jobId);
  };

  const handleViewCandidates = (jobTitle) => {
    onViewCandidates(jobTitle);
  };


  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">
          <i className="fas fa-briefcase"></i> Job Posting
        </h3>
        <button className="edit-btn" onClick={handleCreateJob}>
          <i className="fas fa-plus"></i> Post New Job
        </button>
      </div>
      
      <div id="projectsDisplay">
        {jobs.map((job, index) => (
          <div key={job.id || index} className="project-item" data-job-id={job.id || index}>
            <div className="project-header">
              <div className="project-title">{job.title}</div>
            </div>
            <div className="project-links">
              <span className="job-applications">
                <i className="fas fa-users"></i> {job.applications} applications
              </span>
              <button 
                className="edit-job-btn" 
                onClick={() => handleJobPortal(job)} 
                title="Job Portal"
              >
                <i className="fas fa-edit"></i> JobPortal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsManagementSection;
