import React, { useState } from 'react';
import axios from 'axios';
import './SummaryGenerator.css';

const SummaryGenerator = ({ content, onSummaryGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/summary/generate',
        { content },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      onSummaryGenerated(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError(error.response?.data?.message || 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summary-generator">
      <button 
        onClick={generateSummary}
        disabled={loading || !content}
        className={`generate-button ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SummaryGenerator;
