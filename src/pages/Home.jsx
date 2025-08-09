// src/pages/Home.jsx

import { useState } from 'react';
import PageWrapper from '../components/PageWrapper'; // <-- 1. IMPORT


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
      if (!response.ok) throw new Error('Something went wrong!');
      const data = await response.json();
      setSuggestions(data.suggestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper> {/* <-- 2. WRAP THE CONTENT */}
    <div className="container">
      <h1>AI Travel Planner</h1>
      <p>Click the button to get travel suggestions from your AI assistant!</p>
      
      <button onClick={fetchSuggestions} disabled={isLoading}>
        {isLoading ? 'Getting Suggestions...' : 'Get Suggestions'}
      </button>

      {error && <p className="error">Error: {error}</p>}

      <div className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <div className="suggestion-card" key={index}>
            <h3>{suggestion.title}</h3>
            <p>{suggestion.description}</p>
            <p><strong>Best Time to Visit:</strong> {suggestion.best_time_to_visit}</p>
            <p><strong>Estimated Cost:</strong> {suggestion.estimated_cost}</p>
          </div>
        ))}
      </div>
    </div>
    </PageWrapper> /* <-- 3. CLOSE THE WRAPPER */
  );
}