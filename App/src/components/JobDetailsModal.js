import React from 'react';
import ReactDOM from 'react-dom';
import '../modal.css';

const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  const ticket = job.ticket || {};

  return ReactDOM.createPortal(
    <div className="job-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="job-modal-content" style={{maxWidth: 720, width: 'min(90%, 720px)'}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{fontSize: '2rem', fontWeight: 800}}>
            {job.title} {job.company ? `— ${job.company}` : ''}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="job-details">
            <div className="job-detail"><i className="fas fa-building"></i>{job.company || '—'}</div>
            <div className="job-detail"><i className="fas fa-map-marker-alt"></i>{ticket.city || job.city || '—'}</div>
            <div className="job-detail">
              <i className="fas fa-briefcase"></i>
              {ticket.jobType || job.jobType ? (
                typeof (ticket.jobType || job.jobType) === 'string' ? (
                  (ticket.jobType || job.jobType).split(',').map(j => j.trim()).filter(j => j).length > 0 ? (
                    (ticket.jobType || job.jobType).split(',').map(j => j.trim()).filter(j => j).join(', ')
                  ) : '—'
                ) : (
                  (ticket.jobType || job.jobType).length > 0 ? (
                    (ticket.jobType || job.jobType).join(', ')
                  ) : '—'
                )
              ) : '—'}
            </div>
            <div className="job-detail"><i className="fas fa-user-graduate"></i>Experience: {ticket.experience || job.experience || '—'}</div>
            <div className="job-detail"><i className="fas fa-certificate"></i>Degree: {ticket.degree || '—'}</div>
            <div className="job-detail">
              <i className="fas fa-tags"></i>
              {ticket.field || job.field ? (
                typeof (ticket.field || job.field) === 'string' ? (
                  (ticket.field || job.field).split(',').map(f => f.trim()).filter(f => f).length > 0 ? (
                    (ticket.field || job.field).split(',').map(f => f.trim()).filter(f => f).join(', ')
                  ) : '—'
                ) : (
                  (ticket.field || job.field).length > 0 ? (
                    (ticket.field || job.field).join(', ')
                  ) : '—'
                )
              ) : '—'}
            </div>
            <div className="job-detail"><i className="fas fa-home"></i>Remote: {ticket.remote || job.remote || '—'}</div>
          </div>

          <div className="job-description" style={{marginTop: 16}}>
            <strong>Description</strong>
            <p style={{marginTop: 8}}>{job.description || 'No description provided.'}</p>
          </div>

          {job.technicalSkills && job.technicalSkills.length > 0 && (
            <div className="job-technical-skills" style={{marginTop: 16}}>
              <strong>Required Technical Skills</strong>
              <ul style={{marginTop: 8, paddingLeft: 20}}>
                {(typeof job.technicalSkills === 'string' 
                  ? job.technicalSkills.split(', ').filter(skill => skill.trim() !== '')
                  : job.technicalSkills
                ).map((skill, index) => (
                  <li key={index} style={{marginBottom: 4}}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default JobDetailsModal;


