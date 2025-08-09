// client/src/pages/Dashboard.jsx

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';

// --- SKELETON COMPONENT ---
// This component is shown while the real data is loading.
const DashboardSkeleton = () => {
  return (
    <div className="container">
      <h1><Skeleton width={200} /></h1>
      <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2><Skeleton width={250} /></h2>
        <div className="form-group">
          <Skeleton height={40} />
        </div>
        <Skeleton height={48} />
      </div>
      <div className="trips-list">
        <h2><Skeleton width={150} /></h2>
        <ul className="trip-item-list">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="trip-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton height={24} width="60%" />
              <Skeleton height={36} width="80px" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTripName, setNewTripName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authToken } = useContext(AuthContext);

  // Animation Variants for the list
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    const fetchTrips = async () => {
      // Set loading to true every time we fetch
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/trips', {
          headers: { 'x-auth-token': authToken },
        });
        if (!response.ok) throw new Error('Could not fetch trips');
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (authToken) fetchTrips();
  }, [authToken]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken },
        body: JSON.stringify({ name: newTripName }),
      });
      if (!response.ok) throw new Error('Failed to create trip.');
      const newTrip = await response.json();
      setTrips([newTrip, ...trips]);
      setNewTripName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': authToken },
      });
      if (!response.ok) throw new Error('Failed to delete trip.');
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (err) {
      setError(err.message);
    }
  };

  // If the page is loading, show the skeleton.
  if (isLoading) {
    return (
      <PageWrapper>
        <DashboardSkeleton />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container">
        <h1>My Dashboard</h1>
        
        <div className="form-container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h2>Create a New Trip</h2>
          <form onSubmit={handleCreateTrip}>
            <div className="form-group">
              <label htmlFor="tripName">Trip Name</label>
              <input
                type="text"
                id="tripName"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                placeholder="e.g., Wayanad Adventure"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </motion.button>
          </form>
        </div>

        <div className="trips-list">
          <h2>My Trips</h2>
          {error && <p className="error">Error: {error}</p>}
          
          <motion.ul
            className="trip-item-list"
            variants={containerVariant}
            initial="hidden"
            animate="visible"
          >
            {!isLoading && trips.length === 0 && <p>You have no trips yet. Time to plan one!</p>}
            {trips.map((trip) => (
              <motion.li key={trip._id} className="trip-item" variants={itemVariant}>
                <Link to={`/trip/${trip._id}`} className="trip-link">
                  {trip.name}
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteTrip(trip._id)}
                  className="delete-button"
                >
                  Delete
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </PageWrapper>
  );
}