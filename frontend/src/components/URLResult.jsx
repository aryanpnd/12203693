import React from 'react';
import { Log } from '../services/logger.js';

const URLResult = ({ results, errors }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Log('frontend', 'info', 'component', 'Short URL copied to clipboard');
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="url-results">
      <h2>Results</h2>
      
      {results.map((result, index) => (
        <div key={index} className="result-card">
          {result.success ? (
            <div className="success-result">
              <div className="result-header">
                <h3>URL {index + 1} - Success</h3>
                <span className="success-badge">✓</span>
              </div>
              
              <div className="result-content">
                <div className="result-item">
                  <label>Short URL:</label>
                  <div className="url-display">
                    <a href={result.data.shortLink} target="_blank" rel="noopener noreferrer">
                      {result.data.shortLink}
                    </a>
                    <button 
                      onClick={() => copyToClipboard(result.data.shortLink)}
                      className="copy-btn"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                
                <div className="result-item">
                  <label>Expires:</label>
                  <span>{formatDate(result.data.expiry)}</span>
                </div>
                
                <div className="result-item">
                  <label>Original URL:</label>
                  <span className="original-url">{result.originalUrl}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="error-result">
              <div className="result-header">
                <h3>URL {index + 1} - Error</h3>
                <span className="error-badge">✗</span>
              </div>
              
              <div className="result-content">
                <div className="result-item">
                  <label>Original URL:</label>
                  <span className="original-url">{result.originalUrl}</span>
                </div>
                
                <div className="result-item">
                  <label>Error:</label>
                  <span className="error-message">{result.error}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default URLResult;