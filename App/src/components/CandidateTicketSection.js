import React, { useState, useEffect } from 'react';
import { parseCommaSeparated, formatCommaSeparated } from '../utils/stringUtils';
import { israeliCities } from '../constants/israeliCities';
import { toast } from './ToastContainer';

const CandidateTicketSection = ({ 
  ticketData, 
  onSaveTicket
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedJobType, setSelectedJobType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRemoteWork, setSelectedRemoteWork] = useState('');
  const [formData, setFormData] = useState({
    city: [],
    experience: '',
    remoteWork: [],
    jobType: [],
    field: [],
    degree: ''
  });

  // Initialize formData from ticketData
  useEffect(() => {
    setFormData({
      city: parseCommaSeparated(ticketData.city),
      experience: ticketData.experience || '',
      remoteWork: parseCommaSeparated(ticketData.remoteWork),
      jobType: parseCommaSeparated(ticketData.jobType),
      field: parseCommaSeparated(ticketData.field),
      degree: ticketData.degree || ''
    });
  }, [ticketData]);

  // Helper function to render array/list values
  const renderArrayValue = (value, className = '') => {
    const parsed = parseCommaSeparated(value);
    if (!parsed || parsed.length === 0) return 'Not specified';
    return (
      <ul className={className}>
        {parsed.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  // Helper function to combine field and experience into pairs
  const getFieldExperiencePairs = () => {
    const fields = parseCommaSeparated(ticketData.field);
    const experiences = parseCommaSeparated(ticketData.experience);
    
    if (fields.length === 0 && experiences.length === 0) {
      return [];
    }
    
    // Match fields with experiences by index
    const pairs = [];
    const maxLength = Math.max(fields.length, experiences.length);
    
    for (let i = 0; i < maxLength; i++) {
      pairs.push({
        field: fields[i] || 'Not specified',
        experience: experiences[i] || 'Not specified'
      });
    }
    
    return pairs;
  };

  const toggleTicketEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset to original values
      setFormData({
        city: parseCommaSeparated(ticketData.city),
        experience: ticketData.experience || '',
        remoteWork: parseCommaSeparated(ticketData.remoteWork),
        jobType: parseCommaSeparated(ticketData.jobType),
        field: parseCommaSeparated(ticketData.field),
        degree: ticketData.degree || ''
      });
      setErrors({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };


  const handleAddJobType = () => {
    if (selectedJobType && !formData.jobType.includes(selectedJobType)) {
      setFormData(prev => ({
        ...prev,
        jobType: [...prev.jobType, selectedJobType]
      }));
      setSelectedJobType('');
    }
  };

  const handleRemoveJobType = (index) => {
    setFormData(prev => ({
      ...prev,
      jobType: prev.jobType.filter((_, i) => i !== index)
    }));
  };

  const handleAddRemoteWork = () => {
    if (selectedRemoteWork && !formData.remoteWork.includes(selectedRemoteWork)) {
      setFormData(prev => ({
        ...prev,
        remoteWork: [...prev.remoteWork, selectedRemoteWork]
      }));
      setSelectedRemoteWork('');
    }
  };

  const handleRemoveRemoteWork = (index) => {
    setFormData(prev => ({
      ...prev,
      remoteWork: prev.remoteWork.filter((_, i) => i !== index)
    }));
  };

  const handleAddCity = () => {
    if (selectedCity && !formData.city.includes(selectedCity)) {
      setFormData(prev => ({
        ...prev,
        city: [...prev.city, selectedCity]
      }));
      setSelectedCity('');
    }
  };

  const handleRemoveCity = (index) => {
    setFormData(prev => ({
      ...prev,
      city: prev.city.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // No validation needed - Field and Experience are auto-updated from CV

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    // Convert field, jobType, remoteWork, and city arrays to comma-separated strings for backend
    const dataToSave = {
      ...formData,
      field: formatCommaSeparated(formData.field),
      jobType: formatCommaSeparated(formData.jobType),
      remoteWork: formatCommaSeparated(formData.remoteWork),
      city: formatCommaSeparated(formData.city)
    };
    
    await onSaveTicket(dataToSave);
    setIsEditing(false);
    toast.success('Job preferences updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      city: parseCommaSeparated(ticketData.city),
      experience: ticketData.experience || '',
      remoteWork: parseCommaSeparated(ticketData.remoteWork),
      jobType: parseCommaSeparated(ticketData.jobType),
      field: parseCommaSeparated(ticketData.field),
      degree: ticketData.degree || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  const remoteOptions = ['Remote', 'On-Site', 'Hybrid'];

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'
  ];

  const degreeOptions = [
    'No Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD or Doctorate',
    'College Diploma',
    'Professional Certification',
    'Bootcamp Graduate',
    'High School Diploma'
  ];

  return (
    <div className="section-card candidate-ticket-section">
      <div className="section-header">
        <h3 className="section-title">Candidate Ticket</h3>
        <button 
          className="edit-btn" 
          onClick={toggleTicketEdit} 
          aria-label="Edit ticket information" 
          aria-expanded={isEditing} 
          aria-controls="ticketEditArea"
        >
          <i className="fas fa-edit" aria-hidden="true"></i> Edit
        </button>
      </div>
      {!isEditing ? (
        <div id="ticketDisplay">
          <div className="info-item">
            <div className="info-label">Cities:</div>
            <div className="info-value" id="ticketCityValue">
              {renderArrayValue(ticketData.city, 'city-list')}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Field & Experience:</div>
            <div className="info-value" id="ticketFieldExperienceValue">
              {(() => {
                const pairs = getFieldExperiencePairs();
                if (pairs.length === 0) {
                  return 'Not specified';
                }
                return (
                  <table className="field-experience-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Experience (Years)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pairs.map((pair, index) => (
                        <tr key={index}>
                          <td>{pair.field}</td>
                          <td>{pair.experience}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Remote Work:</div>
            <div className="info-value" id="ticketRemoteValue">
              {renderArrayValue(ticketData.remoteWork, 'job-type-list')}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Job Type:</div>
            <div className="info-value" id="ticketJobTypeValue">
              {renderArrayValue(ticketData.jobType, 'job-type-list')}
            </div>
          </div>
          <div className="info-item">
            <div className="info-label">Degree:</div>
            <div className="info-value" id="ticketDegreeValue">{ticketData.degree || 'Not specified'}</div>
          </div>
        </div>
      ) : (
        <div id="ticketEdit">
          <div className="form-group">
            <label className="form-label">Cities:</label>
            <div className="job-type-input">
              <select
                className="form-input"
                id="ticketCityInput"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select City</option>
                {israeliCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddCity}
                disabled={!selectedCity}
              >
                <i className="fas fa-plus"></i> Add
              </button>
            </div>
            
            {formData.city && formData.city.length > 0 && (
              <div className="job-type-list">
                <h4>Selected Cities:</h4>
                <ul className="job-type-tags">
                  {formData.city.map((city, index) => (
                    <li key={index} className="job-type-tag">
                      <span>{city}</span>
                      <button
                        type="button"
                        className="remove-job-type"
                        onClick={() => handleRemoveCity(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Remote Work:</label>
            <div className="job-type-input">
              <select
                className="form-input"
                value={selectedRemoteWork}
                onChange={(e) => setSelectedRemoteWork(e.target.value)}
              >
                <option value="">Select Remote Option</option>
                {remoteOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddRemoteWork}
                disabled={!selectedRemoteWork}
              >
                <i className="fas fa-plus"></i> Add
              </button>
            </div>
            
            {formData.remoteWork && formData.remoteWork.length > 0 && (
              <div className="job-type-list">
                <h4>Selected Remote Work Options:</h4>
                <ul className="job-type-tags">
                  {formData.remoteWork.map((remote, index) => (
                    <li key={index} className="job-type-tag">
                      <span>{remote}</span>
                      <button
                        type="button"
                        className="remove-job-type"
                        onClick={() => handleRemoveRemoteWork(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Job Type:</label>
            <div className="job-type-input">
              <select
                className="form-input"
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
              >
                <option value="">Select a job type</option>
                {jobTypes.map((jobType, index) => (
                  <option key={index} value={jobType}>
                    {jobType}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddJobType}
                disabled={!selectedJobType}
              >
                <i className="fas fa-plus"></i> Add
              </button>
            </div>
            
            {formData.jobType && formData.jobType.length > 0 && (
              <div className="job-type-list">
                <h4>Selected Job Types:</h4>
                <ul className="job-type-tags">
                  {formData.jobType.map((jobType, index) => (
                    <li key={index} className="job-type-tag">
                      <span>{jobType}</span>
                      <button
                        type="button"
                        className="remove-job-type"
                        onClick={() => handleRemoveJobType(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Degree:</label>
            <select 
              className="form-input" 
              id="ticketDegreeInput" 
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
            >
              <option value="">Select Degree</option>
              {degreeOptions.map(degree => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateTicketSection;
