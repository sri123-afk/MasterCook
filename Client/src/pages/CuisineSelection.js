import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch, isAuthenticated } from '../auth'; // Adjust the path as necessary
import './CuisineSelection.css'; // Ensure this CSS file exists

const CuisineSelection = () => {
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const navigate = useNavigate();

    const cuisines = [
      "American", "Italian", "French", "Mexican", "Japanese",
      "Indian", "Central American", "Greek", "Korean",
      "Southern", "Eastern European", "European", "Cajun", 
      "South American", "British", "Barbeque", "Jewish", "Thai",
      "Mediterranean", "Chinese"
    ];

    useEffect(() => {
        const fetchCuisinePreferences = async () => {
            try {
              if (!isAuthenticated()) {
                // If not authenticated, redirect to the login page
                navigate('/log-in-page');
                return;
            }
                const response = await authFetch('http://127.0.0.1:5000/cuisine_preferences', {
                    method: 'GET'
                });
                if (response && response.cuisines && response.cuisines.length > 0) {
                    console.log('User already has cuisine preferences.');
                    navigate('/home-page1');
                }
            } catch (error) {
                console.error('Error checking cuisine preferences:', error);
                if (error.response && (error.response.status === 401 || error.response.data.message === "Token expired")) {
                    navigate('/log-in-page');
                }
            }
        };
        fetchCuisinePreferences();
    }, [navigate]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedCuisines([...selectedCuisines, value]);
        } else {
            setSelectedCuisines(selectedCuisines.filter((cuisine) => cuisine !== value));
        }
    };

    const handleSubmit = async () => {
        try {
          if (!isAuthenticated()) {
            // If not authenticated, redirect to the login page
            navigate('/log-in-page');
            return;
        }
            const response = await authFetch('http://127.0.0.1:5000/cuisine_preferences', {
                method: 'POST',
                body: { cuisines: selectedCuisines } // Pass the body as an object
            });
            console.log(response.message);
            navigate('/home-page1');
        } catch (error) {
            console.error('Error updating cuisine preferences:', error);
            if (error.response && (error.response.status === 401 || error.response.data.message === "Token expired")) {
                navigate('/log-in-page');
            }
        }
    };

    return (
        <section className="hero">
            <h1>What type of cuisines do you like the most?</h1>
            <div className="cuisine-filter">
                {cuisines.map(cuisine => (
                    <label key={cuisine}>
                        <input type="checkbox" value={cuisine} onChange={handleCheckboxChange} /> {cuisine}
                    </label>
                ))}
            </div>
            <button className="login-button" onClick={handleSubmit}>Save Preferences</button>
        </section>
    );
};

export default CuisineSelection;
