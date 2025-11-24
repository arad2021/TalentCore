import React, { useState, useEffect } from 'react';
import JobsHeader from './JobsHeader';
import FilterSection from './FilterSection';
import JobsList from './JobsList';
import { jobsAPI } from '../services/apiService';
import '../jobs.css';

const PersonalizedJobs = ({ onGoToProfile, onGoToHome, onLogout, onOpenJobs, ticketData }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(true);
  
  // Filter state - always initialized with ticketData
  const [filters, setFilters] = useState({
    city: ticketData?.city || '',
    experience: ticketData?.experience || '',
    remote: ticketData?.remoteWork || '',
    jobType: ticketData?.jobType || '',
    field: ticketData?.field || '',
    degree: ticketData?.degree || ''
  });


  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const result = await jobsAPI.getAllJobs();
        if (result.success && Array.isArray(result.data)) {
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
          // Immediately apply personalized filters if we have ticketData
          if (ticketData) {
            const initial = {
              city: ticketData.city || '',
              experience: ticketData.experience || '',
              remote: ticketData.remoteWork || '',
              jobType: ticketData.jobType || '',
              field: ticketData.field || '',
              degree: ticketData.degree || ''
            };
            setFilters(initial);
            handleApplyFilters(initial, jobs);
          } else {
            setFilteredJobs(jobs);
          }
        } else {
          setAllJobs([]);
          setFilteredJobs([]);
        }
      } catch (e) {
        setAllJobs([]);
        setFilteredJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, [ticketData]);

  // Apply filters immediately when component mounts or ticketData changes
  useEffect(() => {
    if (ticketData && allJobs.length > 0) {
      console.log('PersonalizedJobs - Applying filters with ticketData:', ticketData);
      const newFilters = {
        city: ticketData.city || '',
        experience: ticketData.experience || '',
        remote: ticketData.remoteWork || '',
        jobType: ticketData.jobType || '',
        field: ticketData.field || '',
        degree: ticketData.degree || ''
      };
      setFilters(newFilters);
      
      // Apply filters immediately
      setTimeout(() => {
        handleApplyFilters(newFilters);
      }, 100);
    }
  }, [ticketData, allJobs]);

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
      
      if (userTicket.remoteWork && userTicket.remoteWork !== '') {
        const userRemoteOptions = Array.isArray(userTicket.remoteWork) 
          ? userTicket.remoteWork 
          : typeof userTicket.remoteWork === 'string' 
            ? userTicket.remoteWork.split(',').map(r => r.trim()).filter(r => r)
            : [userTicket.remoteWork];
        
        if (userRemoteOptions.length > 0) {
          matches = matches && userRemoteOptions.some(userRemote => {
            if (userRemote === 'Remote') {
              return job.remote === 'Remote' || job.remote === 'Hybrid';
            } else if (userRemote === 'On-Site') {
              return job.remote === 'On-Site';
            } else if (userRemote === 'Hybrid') {
              return job.remote === 'Hybrid' || job.remote === 'Remote' || job.remote === 'On-Site';
            }
            return job.remote === userRemote;
          });
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

  const handleApplyFilters = (filtersToApply, baseJobs) => {
    let jobs = [...(baseJobs || allJobs)];

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
      const remoteOptions = Array.isArray(filtersToApply.remote) 
        ? filtersToApply.remote 
        : typeof filtersToApply.remote === 'string' 
          ? filtersToApply.remote.split(',').map(r => r.trim()).filter(r => r)
          : [filtersToApply.remote];
      
      if (remoteOptions.length > 0) {
        jobs = jobs.filter(job => {
          return remoteOptions.some(remoteOption => {
            if (remoteOption === 'Remote') {
              return job.remote === 'Remote' || job.remote === 'Hybrid';
            } else if (remoteOption === 'On-Site') {
              return job.remote === 'On-Site';
            } else if (remoteOption === 'Hybrid') {
              return job.remote === 'Hybrid' || job.remote === 'Remote' || job.remote === 'On-Site';
            }
            return job.remote === remoteOption;
          });
        });
      }
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

    console.log('PersonalizedJobs filtered jobs count:', jobs.length);
    setFilteredJobs(jobs);
  };

  const handleClearFilters = () => {
    setFilteredJobs([...allJobs]);
    if (isPersonalized && ticketData) {
      const initial = {
        city: ticketData.city || '',
        experience: ticketData.experience || '',
        remote: ticketData.remoteWork || '',
        jobType: ticketData.jobType || '',
        field: ticketData.field || '',
        degree: ticketData.degree || ''
      };
      setFilters(initial);
      handleApplyFilters(initial);
    }
  };

  const handleApplyToJob = (jobId) => {
    console.log('Applying to job:', jobId);
    // Add application logic here
  };

  return (
    <div>
      <JobsHeader 
        onGoToProfile={onGoToProfile}
        onGoToHome={onGoToHome}
        onLogout={onLogout}
        onOpenJobs={onOpenJobs}
      />
      
      <div className="container">
        <h1 className="page-title fade-in-up">Personalized Job Recommendations</h1>

        {/* Show filter criteria but not editable */}
        {isPersonalized && (
          <div className="personalized-filters-display">
            <h3>Your Job Preferences:</h3>
            <div className="filter-criteria">
              <div className="criteria-item">
                <strong>Location:</strong> {filters.location || 'Any'}
              </div>
              <div className="criteria-item">
                <strong>Experience:</strong> {filters.experience || 'Any'}
              </div>
              <div className="criteria-item">
                <strong>Remote Work:</strong> {
                  filters.remote 
                    ? (Array.isArray(filters.remote) 
                        ? filters.remote.join(', ') 
                        : typeof filters.remote === 'string' 
                          ? filters.remote.split(',').map(r => r.trim()).filter(r => r).join(', ')
                          : filters.remote)
                    : 'Any'
                }
              </div>
              <div className="criteria-item">
                <strong>Job Type:</strong> {filters.jobType || 'Any'}
              </div>
              <div className="criteria-item">
                <strong>Field:</strong> {filters.field || 'Any'}
              </div>
            </div>
            <div className="filtered-indicator">
              <i className="fas fa-filter"></i> Showing personalized job recommendations based on your profile
            </div>
          </div>
        )}

        <JobsList 
          jobs={filteredJobs}
          onApplyToJob={handleApplyToJob}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default PersonalizedJobs;
