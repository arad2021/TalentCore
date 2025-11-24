import React from 'react';

const TestHomePage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Project Portal - Your Career Gateway</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
          Welcome to our React application!
        </p>
      </div>
    </div>
  );
};

export default TestHomePage;
