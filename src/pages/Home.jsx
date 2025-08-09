// client/src/pages/Home.jsx

import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

// SVG Icons for our cards
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const RupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="M6 13h12"></path><path d="M6 18h12"></path><path d="M8.67 3L18 18"></path></svg>;

export default function Home() {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Suggest a 3-day trip for a history lover in your area of Kerala, Thrikkodithanam`,
        }),
      });
      if (!response.ok) throw new Error('Something went wrong with the AI!');
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="container">
        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Your Next Adventure Awaits</h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Let our AI assistant craft the perfect itinerary for you. Get started by generating some ideas.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchSuggestions}
            disabled={isLoading}
            style={{ padding: '16px 32px', fontSize: '1.1rem' }}
          >
            {isLoading ? 'Generating Ideas...' : '✨ Generate AI Suggestions'}
          </motion.button>
        </div>

        {error && <p className="error">Error: {error}</p>}

        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <motion.div
              className="ai-suggestion-card"
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="ai-suggestion-card-icon">💡</div>
              <h3>{suggestion.title}</h3>
              <p>{suggestion.description}</p>
              <div className="details">
                <span><ClockIcon /> {suggestion.best_time_to_visit}</span>
                <span><RupeeIcon /> {suggestion.estimated_cost}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}