import React, { useState, useEffect } from 'react';
import JobsHeader from './JobsHeader';
import FilterSection from './FilterSection';
import JobsList from './JobsList';
import { jobsAPI, candidateAPI } from '../services/apiService';
import '../jobs.css';

const UserJobs = ({ onGoToProfile, onGoToHome, onLogout, ticketData, isPersonalizedJobs }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applicationsByJobId, setApplicationsByJobId] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    city: '',
    experience: '',
    remote: '',
    jobType: '',
    field: '',
    degree: ''
  });


  useEffect(() => {
    // Load jobs from API
    loadJobs();

    // Load existing applications for current user if logged in
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId) {
      loadApplications(currentUserId);
    }

    // Check for personalized filter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('personalized') === 'true') {
      setIsPersonalized(true);
      applyPersonalizedFilter();
    }
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
            degree: job.ticket?.degree || ''
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

  const loadApplications = async (candidateId) => {
    try {
      const result = await candidateAPI.getMyApplications(candidateId);
      if (result.success && Array.isArray(result.data)) {
        const map = {};
        result.data.forEach(app => {
          map[app.jobId] = app.status || 'PENDING';
        });
        setApplicationsByJobId(map);
      }
    } catch (e) {}
  };

  // Set filters based on ticketData when component mounts or ticketData changes
  useEffect(() => {
    if (ticketData && isPersonalizedJobs) {
      console.log('Setting filters based on ticketData:', ticketData);
      const newFilters = {
        city: ticketData.city || '',
        experience: ticketData.experience || '',
        remote: ticketData.remoteWork || '',
        jobType: ticketData.jobType || '',
        field: ticketData.field || '',
        degree: ticketData.degree || ''
      };
      setFilters(newFilters);
      setIsPersonalized(true);
    } else if (!isPersonalizedJobs) {
      console.log('Resetting filters for regular job list');
      const emptyFilters = {
        city: '',
        experience: '',
        remote: '',
        jobType: '',
        field: '',
        degree: ''
      };
      setFilters(emptyFilters);
      setIsPersonalized(false);
    }
  }, [ticketData, isPersonalizedJobs]);

  const applyPersonalizedFilter = () => {
    const userTicket = JSON.parse(localStorage.getItem('userTicket') || '{}');
    
    if (Object.keys(userTicket).length === 0) {
      setFilteredJobs([...allJobs]);
      return;
    }

    const filtered = allJobs.filter(job => {
      let matches = true;

      if (userTicket.city && userTicket.city !== '') {
        matches = matches && job.city && job.city.toLowerCase().includes(userTicket.city.toLowerCase());
      }

      if (userTicket.experience && userTicket.experience !== '') {
        const candidateExperience = parseInt(userTicket.experience);
        const jobExperience = parseInt(job.experience);
        if (!isNaN(candidateExperience) && !isNaN(jobExperience)) {
          matches = matches && candidateExperience >= jobExperience;
        }
      }

      if (userTicket.remote && userTicket.remote !== '') {
        if (userTicket.remote === 'Remote') {
          matches = matches && (job.remote === 'Remote' || job.remote === 'Hybrid');
        } else if (userTicket.remote === 'On-Site') {
          matches = matches && job.remote === 'On-Site';
        } else if (userTicket.remote === 'Hybrid') {
          matches = matches && (job.remote === 'Hybrid' || job.remote === 'Remote' || job.remote === 'On-Site');
        }
      }

      if (userTicket.jobType && userTicket.jobType !== '') {
        if (job.jobType) {
          const jobTypes = Array.isArray(job.jobType) 
            ? job.jobType 
            : typeof job.jobType === 'string' 
              ? job.jobType.split(',').map(j => j.trim()).filter(j => j)
              : [job.jobType];
          matches = matches && jobTypes.some(jt => jt.toLowerCase() === userTicket.jobType.toLowerCase());
        } else {
          matches = false;
        }
      }

      if (userTicket.field && userTicket.field !== '') {
        if (job.field) {
          const jobFields = Array.isArray(job.field) 
            ? job.field 
            : typeof job.field === 'string' 
              ? job.field.split(',').map(f => f.trim()).filter(f => f)
              : [job.field];
          matches = matches && jobFields.some(jf => jf.toLowerCase().includes(userTicket.field.toLowerCase()));
        } else {
          matches = false;
        }
      }

      if (userTicket.degree && userTicket.degree !== '') {
        matches = matches && job.degree === userTicket.degree;
      }

      return matches;
    });

    setFilteredJobs(filtered);
  };

  const handleApplyFilters = (filtersToApply) => {
    console.log('UserJobs handleApplyFilters called with filters:', filtersToApply);
    console.log('allJobs length:', allJobs.length);
    let jobs = [...allJobs];

    // Apply city filter
    if (filtersToApply.city) {
      jobs = jobs.filter(job => job.city === filtersToApply.city);
    }

    // Apply experience filter
    if (filtersToApply.experience) {
      const candidateExperience = parseInt(filtersToApply.experience);
      jobs = jobs.filter(job => {
        const jobExperience = parseInt(job.experience);
        // Match jobs where candidate experience is greater than or equal to job requirement
        return !isNaN(jobExperience) && candidateExperience >= jobExperience;
      });
    }

    // Apply remote filter
    if (filtersToApply.remote) {
      jobs = jobs.filter(job => job.remote === filtersToApply.remote);
    }

    // Apply job type filter
    if (filtersToApply.jobType) {
      jobs = jobs.filter(job => {
        if (!job.jobType) return false;
        const jobTypes = Array.isArray(job.jobType) 
          ? job.jobType 
          : typeof job.jobType === 'string' 
            ? job.jobType.split(',').map(j => j.trim()).filter(j => j)
            : [job.jobType];
        return jobTypes.some(jt => jt.toLowerCase() === filtersToApply.jobType.toLowerCase());
      });
    }

    // Apply field filter
    if (filtersToApply.field) {
      jobs = jobs.filter(job => {
        if (!job.field) return false;
        const jobFields = Array.isArray(job.field) 
          ? job.field 
          : typeof job.field === 'string' 
            ? job.field.split(',').map(f => f.trim()).filter(f => f)
            : [job.field];
        return jobFields.some(jf => jf.toLowerCase() === filtersToApply.field.toLowerCase());
      });
    }

    // Apply degree filter
    if (filtersToApply.degree) {
      jobs = jobs.filter(job => job.degree === filtersToApply.degree);
    }

    console.log('UserJobs filtered jobs count:', jobs.length);
    setFilteredJobs(jobs);
  };

  const handleClearFilters = () => {
    setFilteredJobs([...allJobs]);
    if (isPersonalized) {
      applyPersonalizedFilter();
    }
  };

  const handleApplyToJob = async (jobId) => {
    const job = allJobs.find(j => j.id === jobId);
    const candidateId = localStorage.getItem('userId');
    if (!job || !candidateId) return;

    // Optimistic update to Pending
    setApplicationsByJobId(prev => ({ ...prev, [jobId]: 'PENDING' }));
    const resp = await candidateAPI.applyToJob({ jobId, candidateId: Number(candidateId) });
    if (!resp.success) {
      // Rollback optimistic update only if it's a hard failure and not duplicate
      if (resp.message && !resp.message.toLowerCase().includes('exists')) {
        setApplicationsByJobId(prev => {
          const { [jobId]: _removed, ...rest } = prev;
          return rest;
        });
      }
    } else {
      // Confirm PENDING (backend default)
      setApplicationsByJobId(prev => ({ ...prev, [jobId]: 'PENDING' }));
    }
  };

  return (
    <div>
      <JobsHeader 
        onGoToProfile={onGoToProfile}
        onGoToHome={onGoToHome}
        onLogout={onLogout}
      />
      
      <div className="container">
        <h1 className="page-title fade-in-up">Available Job List for Users</h1>

        <FilterSection 
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          isPersonalized={isPersonalized}
          initialFilters={filters}
        />

        {isPersonalized && (
          <div id="filteredIndicator" className="filtered-indicator">
            <i className="fas fa-filter"></i> Showing personalized job recommendations based on your profile
          </div>
        )}

        <div id="jobsContainer">
        <JobsList 
            jobs={filteredJobs}
          onApplyToJob={handleApplyToJob}
          applicationsByJobId={applicationsByJobId}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default UserJobs;
