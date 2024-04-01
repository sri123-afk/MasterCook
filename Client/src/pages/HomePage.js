import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../auth';
import "./HomePage.css";

const HomePage = () => {
    const [recipeData, setRecipeData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await authFetch('http://127.0.0.1:5000/home', {
                    method: 'GET'
                });
                console.log('Response data:', response);
                setRecipeData(response.recommendations);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && (error.response.status === 401 || error.response.data.message === "Token expired")) {
                    navigate('/log-in-page');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            // Cleanup function
        };
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-page1">
            {/* Navigation Bar */}
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
            {/* Search Bar */}
            <section className="frame-section">
                <header className="section-parent">
                    <div className="section">
                        <div className="container">
                            <div className="textfield7">
                                <input
                                    className="text6"
                                    placeholder="Search Recipes"
                                    type="text"
                                />
                                <img className="ic-search-icon1" alt="" src="/icsearch.svg" />
                            </div>
                        </div>
                        <img
                            className="section-item"
                            loading="lazy"
                            alt=""
                            src="/vector-200.svg"
                        />
                    </div>
                </header>
                <div className="frame-wrapper2">
                    <div className="title-parent">
                        <h1 className="title7">Popular Recipes</h1>
                    </div>
                </div>
            </section>
            {/* Recipes */}
            <section className="frame-parent24">
                {recipeData.map((recipe, index) => (
                    <div key={recipe.id} className="rectangle-parent">
                        <div className="frame-child" />
                        <div className="title-wrapper">
                            <div className="title8">
                                <h1 className="title-fried-container1">
                                    <span>{recipe.title}</span>
                                </h1>
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
                                    <span>{recipe.formatted_instructions}</span>
                                </div>
                            </div>
                        </div>
                        <img
                            className="card1"
                            src={recipe.image}
                            alt={recipe.title}
                            loading="lazy"
                        />
                    </div>
                ))}
            </section>
        </div>
    );
};

export default HomePage;
