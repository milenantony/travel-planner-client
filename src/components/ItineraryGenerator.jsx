import React, { useState } from 'react';
import axios from 'axios';
import './ItineraryGenerator.css';

function ItineraryGenerator() {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState('mid-range');
    const [isLoading, setIsLoading] = useState(false);
    const [itinerary, setItinerary] = useState([]);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        if (!destination || !startDate || !endDate) {
            setError('Please fill in all the trip details.');
            return;
        }
        setIsLoading(true);
        setItinerary([]);
        setError('');
        try {
            // This is the corrected API path
            const response = await axios.post('/api/ai/generate-plan', {
                destination,
                startDate,
                endDate,
                budget
            });
            setItinerary(response.data.itinerary || []);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'The AI failed to generate a plan. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">AI Travel Planner</h1>
                <p className="mt-2 text-lg text-gray-600">Enter your trip details to create a personalized plan.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                        <input type="text" id="destination" className="input-style" placeholder="e.g., Munnar, Kerala" value={destination} onChange={(e) => setDestination(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget Style</label>
                        <select id="budget" className="input-style" value={budget} onChange={(e) => setBudget(e.target.value)}>
                            <option value="budget">Budget-Friendly</option>
                            <option value="mid-range">Mid-Range</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" id="start-date" className="input-style" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="date" id="end-date" className="input-style" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
                <div className="mt-6">
                    <button onClick={handleGeneratePlan} disabled={isLoading} className="generate-button">
                        {isLoading ? 'Generating Your Plan...' : 'Generate Itinerary'}
                    </button>
                </div>
            </div>
            <div className="mt-8">
                {error && <div className="error-message">{error}</div>}
                {isLoading && <div className="flex justify-center"><div className="spinner"></div></div>}
                {itinerary.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-center">Your Custom Itinerary for {destination}</h2>
                        {itinerary.map((day, index) => (
                            <div key={index} className="day-card">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-800">{day.day}: {day.date}</h3>
                                    <span className="theme-pill">{day.theme}</span>
                                </div>
                                <div className="space-y-4 text-gray-700">
                                    <p><strong className="font-semibold">Morning:</strong> {day.morning}</p>
                                    <p><strong className="font-semibold">Afternoon:</strong> {day.afternoon}</p>
                                    <p><strong className="font-semibold">Evening:</strong> {day.evening}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItineraryGenerator;