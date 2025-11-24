import React, { useState, useEffect } from 'react';
import { recruiterAPI } from '../services/apiService';
import '../index.css';
import '../recruiter.css';

// Israeli cities list for job creation (single selection)
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
  'Kfar Malal',
  'Kfar Saba',
  'Hod HaSharon',
  'Rosh HaAyin',
  'Elad',
  'Kiryat Ekron',
  'Mazkeret Batya',
  'Gedera',
  'Yavne',
  'Nes Ziona',
  'Rehovot',
  'Rishon LeZion',
  'Holon',
  'Bat Yam',
  'Ramat Gan',
  'Givatayim',
  'Or Yehuda',
  'Lod',
  'Ramla',
  'Modi\'in',
  'Modi\'in Illit',
  'Beit Shemesh',
    'Ma\'ale Adumim',
    'Abu Ghosh',
    'Kiryat Yearim',
    'Mevaseret Zion',
    'Har Adar',
    'Giv\'at Ze\'ev'
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

const CreateJobPage = ({ onBack, onJobCreated, recruiterId }) => {
  console.log('CreateJobPage rendered with props:', { onBack, onJobCreated, recruiterId });
  
  // Check if recruiterId is valid
  if (!recruiterId) {
    console.error('CreateJobPage: recruiterId is missing or invalid');
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>Recruiter ID is missing. Please go back and try again.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Load data from localStorage on component mount
  const loadSavedData = () => {
    const savedData = localStorage.getItem('createJobFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        return null;
      }
    }
    return null;
  };

  const [jobData, setJobData] = useState(() => {
    const savedData = loadSavedData();
    return savedData || {
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
    };
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedTechnicalSkill, setSelectedTechnicalSkill] = useState('');

  // Save data to localStorage whenever jobData changes
  useEffect(() => {
    localStorage.setItem('createJobFormData', JSON.stringify(jobData));
  }, [jobData]);

  // Note: We don't clean up localStorage on page unload
  // because we want to preserve data on refresh
  // Data will only be cleared when user explicitly cancels or creates job successfully

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
    
    // Clear error when user starts typing
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
    
    
    if (!jobData.ticket.city.trim()) {
      newErrors['ticket.city'] = 'City is required';
    }
    
    if (!jobData.ticket.field || jobData.ticket.field.trim() === '') {
      newErrors['ticket.field'] = 'Field is required';
    }
    
    if (!jobData.ticket.jobType || jobData.ticket.jobType.trim() === '') {
      newErrors['ticket.jobType'] = 'Job Type is required';
    }
    
    if (!jobData.ticket.experience.trim()) {
      newErrors['ticket.experience'] = 'Experience is required';
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
      const jobToSave = {
        ...jobData,
        recruiterId: parseInt(recruiterId),
        technicalSkills: jobData.technicalSkills.join(', '),
        ticket: {
          ...jobData.ticket
        }
      };
      
      const result = await recruiterAPI.createJob(jobToSave);
      
      if (result.success) {
        setSuccessMessage('Job created successfully!');
        // Clear localStorage and reset form
        localStorage.removeItem('createJobFormData');
        setJobData({
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
        setErrors({});
        
        // Auto redirect immediately after successful job creation
        localStorage.removeItem('isOnCreateJobPage');
        // Use the onJobCreated prop instead of direct navigation
        if (onJobCreated) {
          onJobCreated();
        }
      } else {
        setErrors({ general: result.message || 'Failed to create job' });
      }
    } catch (error) {
      console.error('Failed to create job:', error);
      setErrors({ general: 'Failed to create job' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Clear localStorage when canceling
    localStorage.removeItem('createJobFormData');
    localStorage.removeItem('isOnCreateJobPage');
    // Use the onBack prop instead of direct navigation
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="create-job-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleCancel}>
          <i className="fas fa-arrow-left"></i> Go Back to Portal
        </button>
        <h1>Create New Job Posting</h1>
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

        <div className="auto-save-indicator">
          <i className="fas fa-save"></i>
          <span>Your progress is automatically saved</span>
        </div>

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
                placeholder="Describe the job position, responsibilities, and requirements"
                rows="6"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Job Status</label>
              <select
                className="form-select"
                name="status"
                value={jobData.status}
                onChange={handleInputChange}
              >
                <option value="Active">ACTIVE</option>
                <option value="Closed">NOT ACTIVE</option>
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Job Requirements</h2>
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
                  {israeliCities && israeliCities.map(city => (
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
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
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
                  {fields && fields.map((field, index) => (
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
                  {degreeOptions && degreeOptions.map(degree => (
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
              
              {jobData.technicalSkills && jobData.technicalSkills.length > 0 && (
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
        </div>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={handleCancel} disabled={isLoading}>
            <i className="fas fa-times"></i> Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Creating...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Create Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;
