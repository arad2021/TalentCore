import React from 'react';

const FeaturesSection = () => {

  const features = [
    {
      icon: 'fas fa-search',
      title: 'Smart Matching',
      description: 'Our AI-powered algorithm matches you with the perfect opportunities based on your skills, experience, and preferences.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security. Control your privacy settings and share information on your terms.'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Fast Results',
      description: 'Get matched with opportunities in minutes, not weeks. Our streamlined process gets you results quickly.'
    },
    {
      icon: 'fas fa-users',
      title: 'Expert Network',
      description: 'Connect with industry professionals, mentors, and like-minded individuals to grow your network.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Analytics Dashboard',
      description: 'Track your application progress, profile views, and career growth with detailed analytics and insights.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Ready',
      description: 'Access your opportunities anywhere, anytime with our fully responsive mobile-optimized platform.'
    }
  ];


  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Project Portal?</h2>
          <p className="section-subtitle">Powerful features designed to streamline your career journey</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
