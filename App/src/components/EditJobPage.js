import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../services/apiService';
import '../index.css';
import '../recruiter.css';

const EditJobPage = ({ onBack, onJobUpdated, recruiterId, jobId, onDeleteJob }) => {
  // Israeli cities list for job editing (single selection)

  // Israeli cities list
  const israeliCities = [
    'Tel Aviv-Yafo',
    'Jerusalem',
    'Haifa',
    'Rishon LeZion',
    'Petah Tikva',
    'Ashdod',
    'Netanya',
    'Beer Sheva',
    'Holon',
    'Ramat Gan',
    'Ashkelon',
    'Rehovot',
    'Herzliya',
    'Kfar Saba',
    'Bat Yam',
    'Ramat HaSharon',
    'Lod',
    'Ness Ziona',
    'Eilat',
    'Nahariya',
    'Acre',
    'Tiberias',
    'Nazareth',
    'Sderot',
    'Dimona',
    'Kiryat Gat',
    'Kiryat Shmona',
    'Ma\'alot-Tarshiha',
    'Ofakim',
    'Arad',
    'Karmiel',
    'Kiryat Bialik',
    'Kiryat Motzkin',
    'Kiryat Yam',
    'Kiryat Ata',
    'Kiryat Tivon',
    'Yokneam Illit',
    'Migdal HaEmek',
    'Nesher',
    'Tirat Carmel',
    'Yokneam',
    'Ma\'ale Adumim',
    'Ma\'alot',
    'Kiryat Malakhi',
    'Kiryat Ono',
    'Givatayim',
    'Rosh HaAyin',
    'Modi\'in',
    'Yavne',
    'Or Yehuda',
    'Kfar Yona',
    'Mazkeret Batya',
    'Gedera',
    'Ra\'anana',
    'Hod HaSharon',
    'Even Yehuda',
    'Tzur Yigal',
    'Kadima-Zoran',
    'Tel Mond',
    'Kfar Hess',
    'Beit Dagan',
    'Gan Yavne',
    'Kfar Menahem',
    'Kfar Bilu',
    'Kfar Malal'
  ];


  const fields = [
    'Software Development', 'Data Science', 'Cybersecurity', 'DevOps', 'UI/UX Design',
    'Product Management', 'Marketing', 'Sales', 'Finance', 'Human Resources',
    'Operations', 'Customer Success', 'Business Development', 'Content Creation',
    'Graphic Design', 'Digital Marketing', 'Project Management', 'Quality Assurance',
    'System Administration', 'Network Engineering', 'Mobile Development', 'Web Development',
    'Game Development', 'Artificial Intelligence', 'Machine Learning', 'Cloud Computing',
    'Database Administration', 'Technical Writing', 'Research & Development', 'Consulting'
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

  const technicalSkillsOptions = [
    'Actix Web',
    'Angular',
    'Ansible',
    'Apache',
    'Apache Kafka',
    'Apache Spark',
    'APM Tools',
    'Apollo',
    'ASP.NET Core',
    'Assembly',
    'AWS',
    'Azure',
    'Bash scripting',
    'Bitbucket',
    'Bitcoin',
    'Blockchain',
    'Bootstrap',
    'C',
    'C# (.NET Core)',
    'C++',
    'Caching Strategies',
    'Capacitor',
    'Cassandra',
    'CDN',
    'Chai',
    'Clojure',
    'Computer Graphics',
    'Cordova',
    'CORS',
    'CouchDB',
    'Cryptocurrency',
    'Cryptography',
    'CSS3',
    'Cypress',
    'Dart',
    'Design Patterns',
    'DirectX',
    'Django',
    'Docker',
    'Docker Compose',
    'Domain-Driven Design',
    'DynamoDB',
    'Elasticsearch',
    'Elixir',
    'Emacs',
    'Entity Framework',
    'Erlang',
    'Ethereum',
    'Event-Driven Architecture',
    'Express.js',
    'FastAPI',
    'Fastify',
    'Fiber',
    'Figma',
    'Firebase',
    'Firestore',
    'Flask',
    'Flutter',
    'Game Development',
    'Gin',
    'Git',
    'GitHub',
    'GitHub Actions',
    'GitLab',
    'GitLab CI',
    'Go (Golang)',
    'Google Cloud Platform',
    'Google Colab',
    'GraphQL',
    'gRPC',
    'Haskell',
    'Hibernate',
    'HTML5',
    'Hugging Face',
    'InfluxDB',
    'Insomnia',
    'IntelliJ IDEA',
    'Ionic',
    'Java',
    'JavaScript',
    'Jenkins',
    'Jest',
    'Jira',
    'jQuery',
    'JUnit',
    'Jupyter',
    'Keras',
    'Kotlin',
    'Kotlin (Android)',
    'Kubernetes',
    'LangChain',
    'Laravel',
    'Linux',
    'Load Balancing',
    'Logging',
    'MariaDB',
    'Material-UI',
    'MATLAB',
    'Microservices',
    'Mocha',
    'Monitoring',
    'Mongoose',
    'MongoDB',
    'MySQL',
    'Neo4j',
    'NestJS',
    'Nginx',
    'Node.js',
    'Notion',
    'NumPy',
    'OAuth2',
    'OpenAI API',
    'OpenCV',
    'OpenGL',
    'OWASP',
    'Pandas',
    'Parcel',
    'Penetration Testing',
    'Performance Optimization',
    'Perl',
    'PHP',
    'PostgreSQL',
    'Postman',
    'PowerShell',
    'Prisma',
    'PyCharm',
    'Python',
    'PyTorch',
    'pytest',
    'RabbitMQ',
    'R',
    'React',
    'React Native',
    'Redis',
    'RESTful APIs',
    'Rocket',
    'RSpec',
    'Ruby',
    'Ruby on Rails',
    'Rust',
    'Sass/SCSS',
    'Scala',
    'Scikit-learn',
    'Selenium',
    'Sequelize',
    'Serverless',
    'Smart Contracts',
    'Socket.io',
    'SOLID Principles',
    'Solidity',
    'SQLAlchemy',
    'SQLite',
    'Spring Boot',
    'Sublime Text',
    'Svelte',
    'Swift',
    'Swift (iOS)',
    'Tailwind CSS',
    'TensorFlow',
    'Terraform',
    'Trello',
    'TypeORM',
    'TypeScript',
    'Unity',
    'Unreal Engine',
    'Vim',
    'Vite',
    'Vue.js',
    'VS Code',
    'Vulkan',
    'Web3',
    'Webpack',
    'WebSockets',
    'WebStorm',
    'Xamarin'
  ];

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    company: '',
    status: 'Active',
    technicalSkills: [],
    ticket: {
      city: '',
      experience: '',
      remote: 'On-Site',
      jobType: '',
      field: '',
      degree: ''
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTechnicalSkill, setSelectedTechnicalSkill] = useState('');

  // Set localStorage flags when component mounts to ensure persistence
  useEffect(() => {
    if (jobId) {
      localStorage.setItem('isOnEditJobPage', 'true');
      localStorage.setItem('editingJobId', jobId);
    }
  }, [jobId]);

  // Load job data when component mounts
  useEffect(() => {
    const loadJobData = async () => {
      if (jobId) {
        try {
          setIsLoading(true);
          // For now, we'll get the job from the recruiter's jobs list
          // In a real implementation, you'd have a specific API endpoint to get a single job
          const result = await recruiterAPI.getMyJobs(recruiterId);
          if (result.success && result.data) {
            const job = result.data.find(j => j.jobId === parseInt(jobId));
            if (job) {
              const parseTechnicalSkills = (value) => {
                if (!value) return [];
                if (Array.isArray(value)) return value.filter(s => typeof s === 'string' && s.trim() !== '').map(s => s.trim());
                if (typeof value === 'string') {
                  return value
                    .split(',')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
                }
                return [];
              };

              setJobData({
                title: job.title || '',
                description: job.description || '',
                company: job.company || '',
                status: job.status || 'Active',
                technicalSkills: parseTechnicalSkills(job.technicalSkills),
                ticket: {
                  city: job.ticket?.city || job.city || '',
                  experience: job.ticket?.experience || job.experience || '',
                  remote: job.ticket?.remote || job.remote || 'On-Site',
                  jobType: job.ticket?.jobType || job.jobType || '',
                  field: job.ticket?.field || job.field || '',
                  degree: job.ticket?.degree || job.degree || ''
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to load job data:', error);
          setErrors({ general: 'Failed to load job data' });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadJobData();
  }, [jobId, recruiterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('ticket.')) {
      const ticketField = name.split('.')[1];
      setJobData(prev => ({
        ...prev,
        ticket: {
          ...prev.ticket,
          [ticketField]: value
        }
      }));
    } else {
      setJobData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTechnicalSkill = () => {
    if (selectedTechnicalSkill && !jobData.technicalSkills.includes(selectedTechnicalSkill)) {
      setJobData(prev => ({
        ...prev,
        technicalSkills: [...prev.technicalSkills, selectedTechnicalSkill]
      }));
      setSelectedTechnicalSkill('');
    }
  };

  const handleRemoveTechnicalSkill = (index) => {
    setJobData(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }));
  };

  const handleTechnicalSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechnicalSkill();
    }
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!jobData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!jobData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (!jobData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    
    if (!jobData.ticket.city) {
      newErrors['ticket.city'] = 'City is required';
    }
    
    if (!jobData.ticket.experience) {
      newErrors['ticket.experience'] = 'Experience level is required';
    }
    
    if (!jobData.ticket.field || jobData.ticket.field.trim() === '') {
      newErrors['ticket.field'] = 'Field is required';
    }
    
    if (!jobData.ticket.jobType || jobData.ticket.jobType.trim() === '') {
      newErrors['ticket.jobType'] = 'Job Type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      const jobToUpdate = {
        jobId: parseInt(jobId),
        recruiterId: parseInt(recruiterId),
        title: jobData.title,
        description: jobData.description,
        company: jobData.company,
        status: jobData.status,
        ticket: {
          ...jobData.ticket
        },
        technicalSkills: jobData.technicalSkills.join(', ')
      };
      
      const result = await recruiterAPI.updateJob(jobToUpdate);
      
      if (result.success) {
        setSuccessMessage('Job updated successfully!');
        // Clear localStorage when job is updated successfully
        localStorage.removeItem('isOnEditJobPage');
        localStorage.removeItem('editingJobId');
        setTimeout(() => {
          onJobUpdated();
        }, 1000); // Reduced timeout for faster navigation
      } else {
        setErrors({ general: result.message || 'Failed to update job' });
      }
    } catch (error) {
      console.error('Failed to update job:', error);
      setErrors({ general: 'Failed to update job' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onBack();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone and will delete all related applications and offers.')) {
      return;
    }

    if (onDeleteJob && jobId) {
      try {
        await onDeleteJob(jobId);
        // The parent component will handle navigation after deletion
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  if (isLoading && !jobData.title) {
    return (
      <div className="create-job-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-job-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleCancel}>
          <i className="fas fa-arrow-left"></i> Go Back to Portal
        </button>
        <h1>Edit Job Posting</h1>
      </div>

      <div className="page-content">
        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {successMessage}
          </div>
        )}

        {errors.general && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {errors.general}
          </div>
        )}

        <div className="form-container">
          <div className="form-section">
            <h2>Job Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  name="title"
                  value={jobData.title}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  className={`form-input ${errors.company ? 'error' : ''}`}
                  name="company"
                  value={jobData.company}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
                {errors.company && <span className="error-message">{errors.company}</span>}
              </div>
            </div>
            

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                name="description"
                value={jobData.description}
                onChange={handleInputChange}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows="6"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Job Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City *</label>
                <select
                  className={`form-select ${errors['ticket.city'] ? 'error' : ''}`}
                  name="ticket.city"
                  value={jobData.ticket.city}
                  onChange={handleInputChange}
                >
                  <option value="">Select City</option>
                  {israeliCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors['ticket.city'] && <span className="error-message">{errors['ticket.city']}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Experience (Years) *</label>
                <input
                  type="number"
                  className={`form-select ${errors['ticket.experience'] ? 'error' : ''}`}
                  name="ticket.experience"
                  value={jobData.ticket.experience}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  required
                />
                {errors['ticket.experience'] && <span className="error-message">{errors['ticket.experience']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Remote Work</label>
                <select
                  className="form-select"
                  name="ticket.remote"
                  value={jobData.ticket.remote}
                  onChange={handleInputChange}
                >
                  <option value="On-Site">On-Site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select
                  className={`form-select ${errors['ticket.jobType'] ? 'error' : ''}`}
                  name="ticket.jobType"
                  value={jobData.ticket.jobType}
                  onChange={handleInputChange}
                >
                  <option value="">Select a job type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
                {errors['ticket.jobType'] && <span className="error-message">{errors['ticket.jobType']}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Field *</label>
                <select
                  className={`form-select ${errors['ticket.field'] ? 'error' : ''}`}
                  name="ticket.field"
                  value={jobData.ticket.field}
                  onChange={handleInputChange}
                >
                  <option value="">Select a field</option>
                  {fields.map((field, index) => (
                    <option key={index} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
                {errors['ticket.field'] && <span className="error-message">{errors['ticket.field']}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Degree</label>
                <select
                  className="form-select"
                  name="ticket.degree"
                  value={jobData.ticket.degree}
                  onChange={handleInputChange}
                >
                  <option value="">Select Degree</option>
                  {degreeOptions.map(degree => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Technical Skills</h2>
            <div className="form-group">
              <label className="form-label">Required Technical Skills</label>
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
              
              {jobData.technicalSkills.length > 0 && (
                <div className="technical-skills-list">
                  <h4>Selected Technical Skills:</h4>
                  <ul className="technical-skills-tags">
                    {jobData.technicalSkills.map((skill, index) => (
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
          </div>

          <div className="form-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              <i className="fas fa-trash"></i> Delete Job
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJobPage;
