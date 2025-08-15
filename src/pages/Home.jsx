// client/src/pages/Home.jsx

import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// SVG Icons
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const RupeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12"></path><path d="M6 8h12"></path><path d="M6 13h12"></path><path d="M6 18h12"></path><path d="M8.67 3L18 18"></path></svg>;
// --- NEW: SVG Icon for the custom dropdown arrow ---
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);

  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(threeDaysFromNow));
  const [budget, setBudget] = useState('mid-range');

  const [itinerary, setItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [userTrips, setUserTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('new');

  const { authToken, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (user && authToken) {
        try {
          const response = await fetch('/api/trips', {
            headers: { 'x-auth-token': authToken },
          });
          if (response.ok) {
            const data = await response.json();
            setUserTrips(data);
          }
        } catch (err) {
          console.error("Failed to fetch user trips:", err);
        }
      }
    };
    fetchUserTrips();
  }, [user, authToken]);


  const handleFetchSuggestions = async (e) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) {
      setError("Please fill in all the trip details.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setItinerary([]);

    const prompt = `Generate travel suggestions for a trip to ${destination} from ${startDate} to ${endDate} on a ${budget} budget.`;

    try {
      const response = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, budget }),
      });
      if (!response.ok) throw new Error('Something went wrong with the AI!');
      const data = await response.json();
      setItinerary(data.itinerary || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuggestions = async () => {
    if (!user) {
      toast.error("You must be logged in to save suggestions.");
      navigate('/login');
      return;
    }
    if (itinerary.length === 0) {
      toast.info("Generate some suggestions before saving!");
      return;
    }

    setIsSaving(true);
    try {
      let tripId;
      let tripName;

      if (selectedTripId === 'new') {
        tripName = `AI Plan for ${destination}`;
        const tripResponse = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
          body: JSON.stringify({ name: tripName }),
        });
        if (!tripResponse.ok) throw new Error("Failed to create a new trip.");
        const newTrip = await tripResponse.json();
        tripId = newTrip._id;
      } else {
        tripId = selectedTripId;
        const selectedTrip = userTrips.find(trip => trip._id === tripId);
        tripName = selectedTrip.name;
      }

      const reversedItinerary = [...itinerary].reverse();

      for (const day of reversedItinerary) {
        const destResponse = await fetch(`/api/trips/${tripId}/destinations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
          body: JSON.stringify({ name: `${day.day}: ${day.date}` }),
        });
        if (!destResponse.ok) throw new Error(`Failed to add destination for ${day.day}.`);
        const destinations = await destResponse.json();
        const destinationId = destinations[0]._id;

        for (const activity of day.activities) {
            await fetch(`/api/trips/${tripId}/destinations/${destinationId}/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
                body: JSON.stringify({ name: `${activity.title} (${activity.price_range})` }),
            });
        }
      }

      toast.success(`Suggestions saved to trip: "${tripName}"!`);
      navigate('/dashboard');

    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Styles for custom form elements ---
  const customFormStyles = `
    .save-options-container, .custom-select-wrapper {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .trip-select, .custom-select {
      flex-grow: 1;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      font-size: 1rem;
      font-weight: 500;
      -webkit-appearance: none; /* Hide default arrow */
      -moz-appearance: none;
      appearance: none;
    }
    .trip-select:focus, .custom-select:focus {
      outline: 2px solid var(--primary);
      border-color: transparent;
    }
    .trip-select:disabled {
      background-color: var(--border);
      cursor: not-allowed;
    }
    .custom-select-wrapper {
        position: relative;
    }
    .custom-select-wrapper .custom-select-arrow {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none; /* So you can click through it */
        color: var(--text-light);
    }
  `;

  return (
    <PageWrapper>
      <style>{customFormStyles}</style>
      <div className="container">
        <div className="hero-section">
          <h1>Your Next Adventure Awaits</h1>
          <p>
            Describe your ideal trip, and let our AI assistant craft the perfect suggestions for you.
          </p>
        </div>

        <div className="form-container">
          <form onSubmit={handleFetchSuggestions}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="destination">Destination</label>
                <input type="text" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Munnar, Kerala" required />
              </div>
              {/* --- EDITED: Custom Dropdown for Budget --- */}
              <div className="form-group">
                <label htmlFor="budget">Budget Style</label>
                <div className="custom-select-wrapper">
                  <select id="budget" className="custom-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                    <option value="budget">Budget-Friendly</option>
                    <option value="mid-range">Mid-Range</option>
                    <option value="luxury">Luxury</option>
                  </select>
                  <div className="custom-select-arrow">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="end-date">End Date</label>
                <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isSaving}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLoading ? 'Generating...' : '✨ Generate AI Suggestions'}
            </motion.button>
          </form>
        </div>

        {error && <p className="error" style={{ textAlign: 'center', marginTop: '1rem' }}>Error: {error}</p>}

        {isLoading && <div className="spinner"></div>}
        
        {itinerary.length > 0 && (
          <div className="results-container" style={{ marginTop: '3rem' }}>
            <div className="form-container" style={{ marginBottom: '3rem' }}>
              <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Save Your Suggestions</h2>
              <div className="save-options-container">
                <select 
                  className="trip-select" 
                  value={selectedTripId} 
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  disabled={!user}
                >
                  <option value="new">Save as a New Trip</option>
                  {userTrips.map(trip => (
                    <option key={trip._id} value={trip._id}>Add to: {trip.name}</option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveSuggestions}
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? 'Saving...' : '💾 Save Plan'}
                </motion.button>
              </div>
              {!user && <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '1rem', textAlign: 'center' }}>Please log in to save your plan.</p>}
            </div>
            
            {itinerary.map((day, dayIndex) => (
              <div key={dayIndex} className="day-group" style={{ marginBottom: '2.5rem' }}>
                <h2 className="day-header">{day.day}: {day.date}</h2>
                <div className="suggestions-grid">
                  {day.activities.map((activity, activityIndex) => (
                    <motion.div
                      className="ai-suggestion-card"
                      key={activityIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: activityIndex * 0.1 }}
                    >
                      <div className="ai-suggestion-card-icon">💡</div>
                      <h3>{activity.title}</h3>
                      <p>{activity.description}</p>
                      <div className="details">
                        <span><ClockIcon /> {activity.best_time_to_visit}</span>
                        <span><RupeeIcon /> {activity.price_range}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
