import React, { useState, useEffect } from 'react';
import PublicJobsHeader from './PublicJobsHeader';
import RecruiterJobsFilterSection from './RecruiterJobsFilterSection';
import PublicJobsList from './PublicJobsList';
import UserChoiceModal from './UserChoiceModal';
import { jobsAPI } from '../services/apiService';
import '../recruiter-jobs.css';

const PublicJobs = ({ onGoToHome, hideApplyButton = false, onLoginSuccess }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserChoiceModal, setShowUserChoiceModal] = useState(false);


  useEffect(() => {
    // Load jobs from API
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const result = await jobsAPI.getAllJobs();
      
      if (result.success) {
        // Transform backend data to frontend format and filter only active jobs
        const jobs = result.data
          .filter(job => job.status === 'Active') // Only show active jobs
          .map(job => ({
            id: job.jobId,
            title: job.title,
            company: job.company,
            description: job.description,
            status: job.status,
            city: job.ticket?.city || '',
            experience: job.ticket?.experience || '',
            remote: job.ticket?.remote || '',
            jobType: job.ticket?.jobType || '',
            field: job.ticket?.field || ''
          }));
        
        setAllJobs(jobs);
        setFilteredJobs(jobs);
      } else {
        console.error('Failed to load jobs:', result.message);
        setAllJobs([]);
        setFilteredJobs([]);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      setAllJobs([]);
      setFilteredJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = (filters) => {
    let jobs = [...allJobs];

    // Apply location filter
    if (filters.location) {
      jobs = jobs.filter(job => job.location === filters.location);
    }

    // Apply experience filter
    if (filters.experience) {
      const candidateExperience = parseInt(filters.experience);
      jobs = jobs.filter(job => {
        const jobExperience = parseInt(job.experience);
        // Match jobs where candidate experience is greater than or equal to job requirement
        return !isNaN(jobExperience) && candidateExperience >= jobExperience;
      });
    }

    // Apply remote filter
    if (filters.remote) {
      jobs = jobs.filter(job => job.remote === filters.remote);
    }

    // Apply job type filter
    if (filters.jobType) {
      jobs = jobs.filter(job => job.type === filters.jobType);
    }

    // Apply field filter
    if (filters.field) {
      jobs = jobs.filter(job => job.field === filters.field);
    }

    // Apply degree filter
    if (filters.degree) {
      jobs = jobs.filter(job => job.degree === filters.degree);
    }

    setFilteredJobs(jobs);
  };

  const handleClearFilters = () => {
    setFilteredJobs([...allJobs]);
  };

  const handleSignInClick = () => {
    setShowUserChoiceModal(true);
  };

  const handleExistingUser = (userType, email, userId) => {
    setShowUserChoiceModal(false);
    if (onLoginSuccess) {
      onLoginSuccess(userType, email, userId);
    }
  };

  const handleNewUser = (userType, email, userId) => {
    setShowUserChoiceModal(false);
    if (onLoginSuccess) {
      onLoginSuccess(userType, email, userId);
    }
  };

  const handleModalClose = () => {
    setShowUserChoiceModal(false);
  };

  return (
    <div>
      <PublicJobsHeader onGoToHome={onGoToHome} />
      
      <div className="container">
        <h1 className="page-title fade-in-up">Available Job List</h1>
        <p className="page-subtitle">Browse all available job opportunities. Sign in to apply for positions.</p>

        <RecruiterJobsFilterSection 
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        <div id="filteredIndicator" className="filtered-indicator" style={{ display: 'block' }}>
          <i className="fas fa-filter"></i> Showing all available job opportunities
        </div>

        <div id="jobsContainer">
          <PublicJobsList 
            jobs={filteredJobs}
            isLoading={isLoading}
            hideApplyButton={hideApplyButton}
            onSignInClick={handleSignInClick}
          />
        </div>
      </div>

      <UserChoiceModal 
        isOpen={showUserChoiceModal}
        onClose={handleModalClose}
        onExistingUser={handleExistingUser}
        onNewUser={handleNewUser}
      />
    </div>
  );
};

export default PublicJobs;
