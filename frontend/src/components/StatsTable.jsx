import React from 'react';
import { Log } from '../services/logger.js';

const StatsTable = ({ stats, loading, error }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatShortUrl = (shortcode) => {
    return `http://localhost:8000/${shortcode}`;
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error">Error loading statistics: {error}</div>;
  }

  if (!stats || stats.length === 0) {
    return <div className="no-data">No URL statistics available</div>;
  }

  return (
    <div className="stats-container">
      <h2>URL Statistics</h2>
      
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-header">
            <h3>URL {index + 1}</h3>
            <span className="click-count">{stat.clicks} clicks</span>
          </div>
          
          <div className="stat-content">
            <div className="stat-row">
              <label>Short URL:</label>
              <a href={formatShortUrl(stat.shortcode)} target="_blank" rel="noopener noreferrer">
                {formatShortUrl(stat.shortcode)}
              </a>
            </div>
            
            <div className="stat-row">
              <label>Original URL:</label>
              <span className="original-url">{stat.originalUrl}</span>
            </div>
            
            <div className="stat-row">
              <label>Created:</label>
              <span>{formatDate(stat.createdAt)}</span>
            </div>
            
            <div className="stat-row">
              <label>Expires:</label>
              <span>{formatDate(stat.expiry)}</span>
            </div>
            
            <div className="stat-row">
              <label>Shortcode:</label>
              <span>{stat.shortcode}</span>
            </div>
          </div>
          
          {stat.clickData && stat.clickData.length > 0 && (
            <div className="click-data">
              <h4>Click Details</h4>
              <div className="click-table">
                <div className="table-header">
                  <span>Timestamp</span>
                  <span>Referrer</span>
                  <span>Location</span>
                </div>
                {stat.clickData.map((click, clickIndex) => (
                  <div key={clickIndex} className="table-row">
                    <span>{formatDate(click.timestamp)}</span>
                    <span>{click.referrer || 'Direct'}</span>
                    <span>{click.location || 'Unknown'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsTable;