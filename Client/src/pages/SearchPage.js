import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authFetch, isAuthenticated } from '../auth';
import "./HomePage.css";

const SearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [recipeData, setRecipeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isAuthenticated()) {
                    navigate('/log-in-page');
                    return;
                }
                const response = await authFetch('http://127.0.0.1:5000/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:{ search: location.state.query }, // Ensure the body is a string
                });
                if (response.recommendations && response.recommendations.Error) {
                    alert(response.recommendations.Error); // Display the error message
                    navigate(-1); // Redirect to homepage
                } else {
                    setRecipeData(response.recommendations);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && (error.response.status === 401 || error.response.data.message === "Token expired")) {
                    navigate('/log-in-page');
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (location.state && location.state.query) {
            fetchData();
        }

        return () => {
            // Cleanup function
        };
    }, [navigate, location.state]);

    const processInstructions = (instructions) => {
        const words = instructions.split(' ');
        return words.map(word => {
            if (word.startsWith('http')) {
                return <a href={word} target="_blank" rel="noopener noreferrer">{word}</a>;
            } else {
                return word + ' ';
            }
        });
    };

    const handleBackButtonClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-page1">
            <button className="back-button" onClick={handleBackButtonClick}>Back</button>
            <section className="frame-parent24">
                {recipeData.map((recipe, index) => (
                    <div key={recipe.id} className="rectangle-parent">
                        <div className="frame-child" />
                        <div className="title-wrapper">
                            <div className="title8">
                                <h1 className="title-fried-container1">
                                    <span>{recipe.title}</span>
                                </h1>
                                <img
                                    className="card1"
                                    src={recipe.image}
                                    alt={recipe.title}
                                    loading="lazy"
                                />
                                <div className="ingredients-anchovies-veget-wrapper">
                                    <div className="ingredients-anchovies-container1">
                                        <b>Ingredients - </b>
                                        <span>
                                            {recipe.ingredients}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="frame-parent25">
                            <div className="recipe-card-image-parent">
                                <div className="recipe-card-image">
                                    <div className="subtitle1">
                                        <p className="blank-line8">&nbsp;</p>
                                        <p className="difficulty-level-easy1">
                                            <b>{`Likes `}</b>
                                            <span className="span6">{`- `}</span>
                                            <b className="easy1">{recipe.aggregateLikes}</b>
                                        </p>
                                        <p className="blank-line9">&nbsp;</p>
                                        <p className="time-to-cook-45-minutes1">
                                            <b className="time-to-cook1">Spoonacular Score</b>
                                            <span className="minutes1"> - {recipe.spoonacularScore}</span>
                                        </p>
                                        <p className="blank-line10">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Cuisines</b>
                                            <span className="american1"> - {recipe.cuisines}</span>
                                        </p>
                                        <p className="blank-line11">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Difficulty Level</b>
                                            <span className="american1"> - {recipe.difficulty_level}</span>
                                        </p>
                                        <p className="blank-line12">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Flavour Profile</b>
                                            <span className="american1"> - {recipe.flavor_profile}</span>
                                        </p>
                                        <p className="blank-line13">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Price Per Serving</b>
                                            <span className="american1"> - {recipe.pricePerServing}</span>
                                        </p>
                                        <p className="blank-line14">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Time Taken To Cook</b>
                                            <span className="american1"> - {recipe.readyInMinutes}</span>
                                        </p>
                                        <p className="blank-line15">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Calories</b>
                                            <span className="american1"> - {recipe.calories}</span>
                                        </p>
                                        <p className="blank-line16">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Vitamin C</b>
                                            <span className="american1"> - {recipe.Vitamin_C}</span>
                                        </p>
                                        <p className="blank-line17">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Protein</b>
                                            <span className="american1"> - {recipe.Protein}</span>
                                        </p>
                                        <p className="blank-line18">&nbsp;</p>
                                        <p className="cuisines-american1">
                                            <b className="cuisines1">Fiber</b>
                                            <span className="american1"> - {recipe.Fiber}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="instructions-if-container1">
                                <p className="blank-line9">&nbsp;</p>
                                    <b>{`Instructions to cook - `}</b>
                                    {processInstructions(recipe.formatted_instructions)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default SearchPage;