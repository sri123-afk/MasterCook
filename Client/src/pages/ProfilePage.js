import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch, logout, isAuthenticated } from '../auth'; // Adjust the path as necessary
import './ProfilePage.css';
import './HomePage.css';

const cuisines = [
 "American", "Italian", "French", "Mexican", "Japanese",
 "Indian", "Central American", "Greek", "Korean",
 "Southern", "Eastern European", "European", "Cajun", 
 "South American", "British", "Barbeque", "Jewish", "Thai",
 "Mediterranean", "Chinese"
];

const CuisineSelection = ({ onUpdateCuisines, selectedCuisines }) => {
    const [currentSelectedCuisines, setCurrentSelectedCuisines] = useState(selectedCuisines || []);

    useEffect(() => {
        setCurrentSelectedCuisines(selectedCuisines || []);
    }, [selectedCuisines]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setCurrentSelectedCuisines([...currentSelectedCuisines, value]);
        } else {
            setCurrentSelectedCuisines(currentSelectedCuisines.filter((cuisine) => cuisine !== value));
        }
    };

    const handleSubmit = async () => {
        try {
            await authFetch('http://127.0.0.1:5000/cuisine_preferences', {
                method: 'POST',
                body:{ cuisines: currentSelectedCuisines }
            });
            onUpdateCuisines(currentSelectedCuisines); // Call the callback function to update the parent component's state
        } catch (error) {
            console.error('Error updating cuisine preferences:', error);
            // Handle error, e.g., show a message to the user
        }
    };

    return (
        <section className="hero2">
            <h1>Update Cuisine Preferences</h1>
            <div className="cuisine-filter">
                {cuisines.map(cuisine => (
                    <label key={cuisine}>
                        <input type="checkbox" value={cuisine} checked={currentSelectedCuisines.includes(cuisine)} onChange={handleCheckboxChange} /> {cuisine}
                    </label>
                ))}
            </div>
            <button className="update-button" onClick={handleSubmit}>Save Cuisine Selection</button>
        </section>
    );
};

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndFetchUserData = async () => {
            // Check if the user is authenticated
            if (!isAuthenticated()) {
                // If not authenticated, redirect to the login page
                navigate('/log-in-page');
                return;
            }

            try {
                const response = await authFetch('http://127.0.0.1:5000/user_info', {
                    method: 'GET'
                });
                setUserData(response.user_info);
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error, e.g., show a message to the user
            }
        };
        checkAuthAndFetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        logout(); // Call the logout function from auth.js
        navigate('/log-in-page'); // Redirect to the login page
    };

    const handleDeleteAccount = async () => {
        try {
            await authFetch('http://127.0.0.1:5000/delete_user', { method: 'DELETE' });
            logout(); // Log out the user after deleting their account
            navigate('/log-in-page'); // Redirect to the login page
        } catch (error) {
            console.error('Error deleting account:', error);
            // Handle error, e.g., show a message to the user
        }
    };

    const handleUpdateCuisines = (newCuisines) => {
        // Update the user's cuisine preferences in the state
        setUserData({ ...userData, cuisines: newCuisines });
    };

    return (
        <div>
            <div className="top-bar1">
                <div className="navigation-tabs">
                    <h2 className="title5">MasterCook</h2>
                </div>
                <div className="navigation-wrapper">
                    <div className="navigation">
                        <div className="tab3" onClick={() => navigate('/home-page1')}>Home</div>
                        <div className="tab4" onClick={() => navigate('/chef-page1')}>Chef</div>
                        <div className="tab5" onClick={() => navigate('/profile')}>Profile</div>
                    </div>
                </div>
            </div>
            <main>
                <section className="profile-page">
                    <h1>Profile Page</h1>
                    <div className="user-info">
                        <div className="user-info-text">
                            <h2>User Details</h2>
                            <p>Username: {userData?.username}</p>
                            <p>Email: {userData?.email}</p>
                            <p>Cuisine Preferences: {userData?.cuisines?.join(', ') || 'None'}</p>
                        </div>
                        <div className="user-info-buttons">
                            <button onClick={handleLogout}>Log out</button>

                            <button onClick={handleDeleteAccount}>Delete Account</button>
                        </div>
                    </div>
                    <CuisineSelection onUpdateCuisines={handleUpdateCuisines} selectedCuisines={userData?.cuisines || []} />
                </section>
            </main>
        </div>
    );
}

export default ProfilePage;
