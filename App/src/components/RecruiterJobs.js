import React, { useState, useEffect } from 'react';
import RecruiterJobsHeader from './RecruiterJobsHeader';
import RecruiterJobsFilterSection from './RecruiterJobsFilterSection';
import RecruiterJobsList from './RecruiterJobsList';
import { jobsAPI } from '../services/apiService';
import '../index.css';
import '../recruiter-jobs.css';

const RecruiterJobs = ({ onGoToProfile, onGoToHome, onLogout }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recruiterName, setRecruiterName] = useState('Recruiter');


  useEffect(() => {
    // Load recruiter data
    const recruiterData = localStorage.getItem('recruiterData');
    if (recruiterData) {
      try {
        const recruiter = JSON.parse(recruiterData);
        if (recruiter.name) {
          setRecruiterName(recruiter.name);
        }
      } catch (error) {
        console.warn('Failed to load recruiter data:', error);
      }
    }

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
            field: job.ticket?.field || '',
            technicalSkills: job.technicalSkills || '',
            // Include ticket data for degree and other fields
            ticket: job.ticket ? {
              city: job.ticket.city || '',
              experience: job.ticket.experience || '',
              remote: job.ticket.remote || '',
              jobType: job.ticket.jobType || '',
              field: job.ticket.field || '',
              degree: job.ticket.degree || ''
            } : null
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

    // Apply city filter
    if (filters.city) {
      jobs = jobs.filter(job => job.city === filters.city);
    }

    // Apply experience filter
    if (filters.experience) {
      jobs = jobs.filter(job => job.experience === filters.experience);
    }

    // Apply remote filter
    if (filters.remote) {
      jobs = jobs.filter(job => job.remote === filters.remote);
    }

    // Apply job type filter
    if (filters.jobType) {
      jobs = jobs.filter(job => job.jobType === filters.jobType);
    }

    // Apply field filter
    if (filters.field) {
      jobs = jobs.filter(job => job.field === filters.field);
    }

    // Apply degree filter
    if (filters.degree) {
      jobs = jobs.filter(job => (job.ticket && job.ticket.degree) === filters.degree);
    }

    setFilteredJobs(jobs);
  };

  const handleClearFilters = () => {
    setFilteredJobs([...allJobs]);
  };

  return (
    <div>
      <RecruiterJobsHeader 
        onGoToProfile={onGoToProfile}
        onGoToHome={onGoToHome}
        onLogout={onLogout}
        recruiterName={recruiterName}
      />
      
      <div className="container">
        <h1 className="page-title fade-in-up">Available Job List for Recruiters</h1>

        <RecruiterJobsFilterSection 
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        <div id="filteredIndicator" className="filtered-indicator" style={{ display: 'block' }}>
          <i className="fas fa-filter"></i> Showing job opportunities for recruiters
        </div>

        <div id="jobsContainer">
          <RecruiterJobsList 
            jobs={filteredJobs}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobs;
