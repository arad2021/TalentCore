import React from 'react';

const HowItWorksSection = () => {

  const steps = [
    {
      number: 1,
      title: 'Create Your Profile',
      description: 'Sign up and build your professional profile with your skills, experience, and career goals.',
      icon: 'fas fa-user-plus'
    },
    {
      number: 2,
      title: 'Get Matched',
      description: 'Our smart algorithm finds the perfect opportunities that match your profile and preferences.',
      icon: 'fas fa-magic'
    },
    {
      number: 3,
      title: 'Land Your Dream Job',
      description: 'Apply to opportunities, connect with employers, and start your new career journey.',
      icon: 'fas fa-trophy'
    }
  ];


  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get started in three simple steps</p>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{step.number}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
