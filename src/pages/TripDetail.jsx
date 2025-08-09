// client/src/pages/TripDetail.jsx

import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion'; // <-- IMPORT

// ActivityForm component with animated button
const ActivityForm = ({ destinationId, onActivityAdded }) => {
  const [activityName, setActivityName] = useState('');
  const { tripId } = useParams();
  const { authToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${tripId}/destinations/${destinationId}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
        body: JSON.stringify({ name: activityName }),
      });
      if (!res.ok) throw new Error('Failed to add activity');
      const updatedTrip = await res.json();
      onActivityAdded(updatedTrip);
      setActivityName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="activity-form">
      <input
        type="text"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        placeholder="e.g., Go trekking"
        required
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
      >
        Add Activity
      </motion.button>
    </form>
  );
};

export default function TripDetail() {
  // ... (All the state and functions are the same as before)
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);
  const [destinationName, setDestinationName] = useState('');
  const [activityInputs, setActivityInputs] = useState({});

  useEffect(() => {
    const fetchTrip = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
          headers: { 'x-auth-token': authToken },
        });
        if (!response.ok) throw new Error('Could not fetch trip details');
        const data = await response.json();
        setTrip(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (authToken) fetchTrip();
  }, [tripId, authToken]);
  
  const handleAddDestination = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${tripId}/destinations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
        body: JSON.stringify({ name: destinationName }),
      });
      const updatedDestinations = await res.json();
      setTrip({ ...trip, destinations: updatedDestinations });
      setDestinationName('');
    } catch (err) { console.error(err); }
  };

  const handleDeleteDestination = async (destinationId) => {
    if (!window.confirm('Delete this destination?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/trips/${tripId}/destinations/${destinationId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': authToken },
      });
      const updatedDestinations = await res.json();
      setTrip({ ...trip, destinations: updatedDestinations });
    } catch (err) { console.error(err); }
  };

  const handleDeleteActivity = async (destinationId, activityId) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
        const res = await fetch(`http://localhost:5000/api/trips/${tripId}/destinations/${destinationId}/activities/${activityId}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': authToken },
        });
        const updatedTrip = await res.json();
        setTrip(updatedTrip);
    } catch (err) { console.error(err); }
  };

  if (isLoading) return <p className="container">Loading trip details...</p>;
  if (error) return <p className="container error">Error: {error}</p>;
  if (!trip) return <p className="container">Trip not found.</p>;
  
  return (
    <PageWrapper>
      <div className="container">
        <Link to="/dashboard">&larr; Back to Dashboard</Link>
        <h1>{trip.name}</h1>
        
        <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h3>Add a Destination</h3>
          <form onSubmit={handleAddDestination}>
            <div className="form-group">
              <input type="text" value={destinationName} onChange={(e) => setDestinationName(e.target.value)} placeholder="e.g., Fort Kochi" required />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
            >
              Add Destination
            </motion.button>
          </form>
        </div>

        <div className="destinations-list">
          <h2>Itinerary</h2>
          {trip.destinations.length === 0 ? <p>No destinations added yet.</p> : (
            trip.destinations.map((dest) => (
              <div key={dest._id} className="destination-card">
                <div className="destination-header">
                  <h3>{dest.name}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteDestination(dest._id)}
                    className="delete-button-small"
                  >
                    Delete Destination
                  </motion.button>
                </div>
                <ul className="activity-list">
                  {dest.activities.map((activity) => (
                      <li key={activity._id}>
                          <span>{activity.name}</span>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteActivity(dest._id, activity._id)}
                            className="delete-button-tiny"
                          >
                              X
                          </motion.button>
                      </li>
                  ))}
                </ul>
                <ActivityForm destinationId={dest._id} onActivityAdded={setTrip} />
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}