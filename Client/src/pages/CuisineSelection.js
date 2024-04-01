import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../auth'; // Import authFetch from auth.js
import './CuisineSelection.css';

const CuisineSelection = () => {
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCuisinePreferences = async () => {
            try {
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
        <div className="cuisine-selection">
            <h2 className="what-type-of">What type of cuisines do you like the most?</h2>
            <div className="cuisine-selection-inner">
                <div className="frame-parent2">
                    <div className="frame-wrapper">
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Italian"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Italian</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Mexican"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Mexican</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="French"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">French</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Indian"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Indian</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Chinese"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Chinese</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Central American"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Central American</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Asian"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Asian</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Mediterranean"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Mediterranean</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Greek"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Greek</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Eastern European"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Eastern European</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="European"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">European</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Japanese"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Japanese</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Thai"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Thai</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="British"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">British</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Barbecue"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Barbecue</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Cajun"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Cajun</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="South American"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">South American</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="American"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">American</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Jewish"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Jewish</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Korean"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Korean</label>
                        </div>
                        <div className="frame-parent3">
                            <input
                                className="frame-input2"
                                type="checkbox"
                                value="Southern"
                                onChange={handleCheckboxChange}
                            />
                            <label className="option-12">Southern</label>
                        </div>
                        {/* Repeat for other cuisines */}
                    </div>
                </div>
            </div>
            <button className="primary2" onClick={handleSubmit}>
                <div className="title2">Save Preferences</div>
            </button>
        </div>
    );
};

export default CuisineSelection;
