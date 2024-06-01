import React from 'react';
import './Body.css';

const Body = () => {
  return (
    <div className="body">
      <div className="body-header">
        <h1>Dashboard Overview</h1>
      </div>
      <div className="body-content">
        <div className="body-section">
          <h2>Summary</h2>
          <p>Welcome to your dashboard! Here you can find a quick summary of your activities and analytics.</p>
        </div>
        <div className="body-section">
          <h2>Charts</h2>
          <div className="charts-container">
            {/* Placeholder for charts */}
            <div className="chart">Chart 1</div>
            <div className="chart">Chart 2</div>
          </div>
        </div>
        <div className="body-section">
          <h2>Recent Activities</h2>
          <ul className="activity-list">
            {/* Placeholder for recent activities */}
            <li>Activity 1</li>
            <li>Activity 2</li>
            <li>Activity 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Body;
