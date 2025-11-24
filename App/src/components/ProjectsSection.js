import React, { useState } from 'react';
import { technicalSkillsOptions } from '../constants/technicalSkills';
import { isValidGitHubUrl, getGitHubUrlValidationError } from '../utils/stringUtils';
import { toast } from './ToastContainer';

const ProjectsSection = ({ projects, onAddProject, onEditProject, onDeleteProject }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedTechnicalSkill, setSelectedTechnicalSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    projectName: '',
    githubLink: '',
    technicalSkills: []
  });

  const toggleProjectsEdit = () => {
    setIsAdding(!isAdding);
    if (!isAdding) {
      setFormData({
        projectName: '',
        githubLink: '',
        technicalSkills: []
      });
      setSelectedTechnicalSkill('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation for GitHub URL
    if (name === 'githubLink') {
      if (!value || !value.trim()) {
        setErrors(prev => ({ ...prev, githubLink: null })); // Clear error when empty
      } else {
        const errorMsg = getGitHubUrlValidationError(value);
        if (errorMsg) {
          setErrors(prev => ({ ...prev, githubLink: errorMsg }));
        } else {
          setErrors(prev => ({ ...prev, githubLink: null })); // Clear error if valid
        }
      }
    } else {
      // Clear error for other fields when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate project name
    if (!formData.projectName || !formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (formData.projectName.trim().length < 2) {
      newErrors.projectName = 'Project name must be at least 2 characters';
    } else if (formData.projectName.trim().length > 100) {
      newErrors.projectName = 'Project name must be less than 100 characters';
    }

    // Validate GitHub URL with detailed error messages
    if (!formData.githubLink || !formData.githubLink.trim()) {
      newErrors.githubLink = 'GitHub link is required';
    } else {
      const urlError = getGitHubUrlValidationError(formData.githubLink);
      if (urlError) {
        newErrors.githubLink = urlError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleAddTechnicalSkill = () => {
    if (selectedTechnicalSkill && !formData.technicalSkills.includes(selectedTechnicalSkill)) {
      setFormData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, selectedTechnicalSkill]
      }));
      setSelectedTechnicalSkill('');
    }
  };

  const handleRemoveTechnicalSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before adding the project');
      return;
    }
    
    onAddProject(formData);
    setFormData({
      projectName: '',
      githubLink: '',
      technicalSkills: []
    });
    setSelectedTechnicalSkill('');
    setErrors({});
    setIsAdding(false);
    toast.success('Project added successfully');
  };

  const handleCancel = () => {
      setFormData({
        projectName: '',
        githubLink: '',
        technicalSkills: []
      });
      setSelectedTechnicalSkill('');
      setIsAdding(false);
      setIsEditing(false);
      setEditingProject(null);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      githubLink: project.githubLink,
      technicalSkills: project.technicalSkills || []
    });
    setErrors({});
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleDeleteProject = (projectName) => {
    if (window.confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
      onDeleteProject(projectName);
    }
  };

  const handleUpdateProject = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before updating the project');
      return;
    }
    
    onEditProject(editingProject.projectName, formData);
    setFormData({
      projectName: '',
      githubLink: '',
      technicalSkills: []
    });
    setSelectedTechnicalSkill('');
    setErrors({});
    setIsEditing(false);
    setEditingProject(null);
    toast.success('Project updated successfully');
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">My Projects</h3>
        <button className="edit-btn" onClick={toggleProjectsEdit}>
          <i className="fas fa-plus"></i> Add Project
        </button>
      </div>
      {!isAdding && !isEditing ? (
        <div id="projectsDisplay">
          {projects.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <p>No projects added yet. Click "Add Project" to get started!</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-header">
                  <div className="project-title">{project.projectName}</div>
                  <div className="project-actions">
                    <button 
                      className="btn btn-sm btn-secondary" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      title="Edit Project"
                      style={{ 
                        backgroundColor: '#6c757d', 
                        color: 'white', 
                        border: 'none',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        zIndex: 1000,
                        position: 'relative'
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDeleteProject(project.projectName)}
                      title="Delete Project"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                {project.technicalSkills && project.technicalSkills.length > 0 && (
                  <div className="project-languages">
                    <i className="fas fa-code"></i> {project.technicalSkills.join(', ')}
                  </div>
                )}
                <div className="project-links">
                  {project.githubLink && (
                    <a href={project.githubLink} className="project-link" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-github"></i> View on GitHub
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div id="projectsEdit">
          {isEditing && <h4>Edit Project: {editingProject?.projectName}</h4>}
          <div className={`form-group ${errors.projectName ? 'error' : ''}`}>
            <label className="form-label">Project Name:</label>
            <input 
              type="text" 
              className={`form-input ${errors.projectName ? 'error' : ''}`}
              id="projectNameInput" 
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Enter project name"
              required
            />
            {errors.projectName && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.projectName}
              </div>
            )}
          </div>
          <div className={`form-group ${errors.githubLink ? 'error' : formData.githubLink && isValidGitHubUrl(formData.githubLink) ? 'success' : ''}`}>
            <label className="form-label">GitHub Repository Link:</label>
            <input 
              type="url" 
              className={`form-input ${errors.githubLink ? 'error' : formData.githubLink && isValidGitHubUrl(formData.githubLink) ? 'success' : ''}`}
              id="projectGithubInput" 
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              placeholder="https://github.com/username/project"
              required
            />
            {errors.githubLink && (
              <div className="form-error show">
                <i className="fas fa-exclamation-circle"></i>
                {errors.githubLink}
              </div>
            )}
            {formData.githubLink && !errors.githubLink && isValidGitHubUrl(formData.githubLink) && (
              <div className="form-success show">
                <i className="fas fa-check-circle"></i>
                Valid GitHub URL
              </div>
            )}
            <small className="form-hint" style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Example: https://github.com/username/repository-name
            </small>
          </div>
          <div className="form-group">
            <label className="form-label">Technologies:</label>
            <div className="technical-skills-input">
              <select
                className="form-input"
                value={selectedTechnicalSkill}
                onChange={(e) => setSelectedTechnicalSkill(e.target.value)}
              >
                <option value="">Select a technical skill</option>
                {technicalSkillsOptions.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleAddTechnicalSkill}
                disabled={!selectedTechnicalSkill}
              >
                <i className="fas fa-plus"></i> Add
              </button>
            </div>
            
            {formData.technicalSkills && formData.technicalSkills.length > 0 && (
              <div className="technical-skills-list">
                <h4>Selected Technologies:</h4>
                <ul className="technical-skills-tags">
                  {formData.technicalSkills.map((skill, index) => (
                    <li key={index} className="technical-skill-tag">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="remove-technical-skill"
                        onClick={() => handleRemoveTechnicalSkill(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="form-actions">
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleUpdateProject}>Update Project</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleAddProject}>Add Project</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;




