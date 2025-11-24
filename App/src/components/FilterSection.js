import React, { useState, useEffect } from 'react';

const FilterSection = ({ onApplyFilters, onClearFilters, isPersonalized, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    city: '',
    experience: '',
    remote: '',
    jobType: '',
    field: '',
    degree: ''
  });

  // Update filters when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      console.log('FilterSection updating filters with initialFilters:', initialFilters);
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  // Apply filters automatically when filters state changes (for initial load)
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).some(key => initialFilters[key] !== '')) {
      console.log('FilterSection auto-applying initial filters:', initialFilters);
      onApplyFilters(initialFilters);
    }
  }, [initialFilters, onApplyFilters]);

  // Israeli cities list for filtering
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
    'Umm al-Fahm',
    'Rahat',
    'Sderot',
    'Dimona',
    'Kiryat Gat',
    'Kiryat Shmona',
    'Ma\'alot-Tarshiha',
    'Ofakim',
    'Arad',
    'Karmiel',
    'Tayibe',
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
    'Tira',
    'Kafr Qasim',
    'Qalansawe',
    'Ar\'ara',
    'Kafr Manda',
    'Kafr Kanna',
    'Iksal',
    'Baqa al-Gharbiyye',
    'Jisr az-Zarqa',
    'Fureidis',
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


  const remoteOptions = ['Remote', 'On-Site', 'Hybrid'];

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('FilterSection handleInputChange:', name, value);
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    console.log('FilterSection handleApplyFilters called with filters:', filters);
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      city: '',
      experience: '',
      remote: '',
      jobType: '',
      field: '',
      degree: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  return (
    <div className="filter-section slide-in-left">
      <div className="filter-header">
        <h2 className="filter-title">Filter Job List</h2>
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          <i className="fas fa-times"></i> Clear Filters
        </button>
      </div>

      <div className="advanced-filters">
        <div className="filter-row">
          <div className="form-group">
            <label className="form-label">City:</label>
            <select 
              className="form-input" 
              id="filterCity"
              name="city"
              value={filters.city}
              onChange={handleInputChange}
            >
              <option value="">Select City</option>
              {israeliCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Experience (Years):</label>
            <input 
              type="number" 
              className="form-input" 
              id="filterExperience"
              name="experience"
              value={filters.experience}
              onChange={handleInputChange}
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div className="filter-row">
          <div className="form-group">
            <label className="form-label">Remote Work:</label>
            <select 
              className="form-input" 
              id="filterRemote"
              name="remote"
              value={filters.remote}
              onChange={handleInputChange}
            >
              <option value="">Any</option>
              {remoteOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Job Type:</label>
            <select 
              className="form-input" 
              id="filterJobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleInputChange}
            >
              <option value="">Any Type</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="form-group">
            <label className="form-label">Field:</label>
            <select 
              className="form-input" 
              id="filterField"
              name="field"
              value={filters.field}
              onChange={handleInputChange}
            >
              <option value="">Select Field</option>
              {fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Degree:</label>
            <select 
              className="form-input" 
              id="filterDegree"
              name="degree"
              value={filters.degree}
              onChange={handleInputChange}
            >
              <option value="">Select Degree</option>
              {degreeOptions.map(degree => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-row">
          <div className="form-group" style={{ display: 'flex', alignItems: 'end', paddingTop: '25px', gridColumn: '1 / -1', justifyContent: 'center' }}>
            <button className="filter-btn" onClick={handleApplyFilters}>
              <i className="fas fa-filter"></i> Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
