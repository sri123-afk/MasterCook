import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch, isAuthenticated } from '../auth'; // Ensure this path is correct
import "./ChefPage.css";
import "./HomePage.css";

const ChefPage = () => {
 const navigate = useNavigate();
 const [recipeData, setRecipeData] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [selectedOptions, setSelectedOptions] = useState({ vegetables: [], meat: [] });

 const vegetables = ['asparagus', 'broccoli', 'carrot', 'celery', 'cucumber', 'eggplant', 'green bean', 'lettuce', 'mushroom', 'onion', 'potato', 'spinach', 'tomato', 'zucchini'];
 const meat = ['fish', 'beef', 'chicken', 'pork', 'lamb', 'turkey', 'duck', 'bacon', 'sausage', 'ham', 'salami', 'pepperoni', 'tuna', 'anchovies'];

 if (!isAuthenticated()) {
  // If not authenticated, redirect to the login page
  navigate('/log-in-page');
  return;
}
 const groupIntoPairs = (items) => {
    const pairs = [];
    for (let i = 0; i < items.length; i += 2) {
      pairs.push(items.slice(i, i + 2));
    }
    return pairs;
 };

 const handleOptionSelect = (type, option) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [type]: prevState[type].includes(option)
        ? prevState[type].filter(item => item !== option)
        : [...prevState[type], option]
    }));
 };

 const handleGetRecommendations = async () => {
  if (selectedOptions.vegetables.length === 0 && selectedOptions.meat.length === 0) {
     alert('Please select at least one option.');
     return;
  }
 
  setIsLoading(true);
  try {
     // Directly use the data returned by authFetch
     const data = await authFetch('http://127.0.0.1:5000/chef', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: { ingredients: [...selectedOptions.vegetables, ...selectedOptions.meat] },
     });
 
     // Since authFetch returns the data directly, you can use it directly
     setRecipeData(data.recommendations);
  } catch (error) {
     console.error('Error fetching recommendations:', error);
     setRecipeData([]); // Clear previous data
 
     // Check for specific error conditions related to authentication and token expiration
     if (error.response && (error.response.status === 401 || error.response.data.message === "Token expired")) {
       navigate('/log-in-page');
     }
  } finally {
     setIsLoading(false);
  }
 };
 
 const processInstructions = (instructions) => {
    const words = instructions.split(' ');
    return words.map((word, index) => {
      if (word.startsWith('http')) {
        return <a key={index} href={word} target="_blank" rel="noopener noreferrer">{word}</a>;
      } else {
        return <span key={index}>{word + ' '}</span>;
      }
    });
 };

 if (isLoading) {
    return <div>Loading...</div>;
 }

 return (
    <div className="chef-page1">
      <section className="top-bar2">
        <header className="top-bar3">
          <div className="title9">
            <h2 className="title10">MasterCook</h2>
          </div>
          <nav className="container2">
            <nav className="icons-option">
              <div className="tab6" onClick={() => navigate('/home-page1')}>Home</div>
              <div className="tab7" onClick={() => navigate('/chef-page1')}>Chef</div>
              <div className="tab8" onClick={() => navigate('/profile')}>Profile</div>
            </nav>
          </nav>
        </header>
      </section>
      <section className="frame-parent">
        <div className="frame-parent2">
          {/* Meat options */}
          <div className="section2">
            <div className="container3">
              <h1 className="title11">Meat</h1>
            </div>
            <div className="list">
              {groupIntoPairs(meat).map((pair, index) => (
                <div key={index} className="button">
                 {pair.map((item, itemIndex) => (
                    <div key={itemIndex} className="icons-group">
                      <input
                        className="icons"
                        type="checkbox"
                        checked={selectedOptions.meat.includes(item)}
                        onChange={() => handleOptionSelect('meat', item)}
                      />
                      <div className="option">{item}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Vegetable options */}
          <div className="section3">
            <div className="container3">
              <h1 className="title11">Vegetables</h1>
            </div>
            <div className="list">
              {groupIntoPairs(vegetables).map((pair, index) => (
                <div key={index} className="button">
                 {pair.map((item, itemIndex) => (
                    <div key={itemIndex} className="icons-group">
                      <input
                        className="icons"
                        type="checkbox"
                        checked={selectedOptions.vegetables.includes(item)}
                        onChange={() => handleOptionSelect('vegetables', item)}
                      />
                      <div className="option">{item}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="section-container">
          <div className="section4">
            <div className="container5">
              <h1 className="title13">Select Ingredients</h1>
              <div className="description">
                Tick the checkboxes for meat and vegetables
              </div>
              <button className="button8" onClick={handleGetRecommendations}>
                <div className="primary3">
                 <div className="title14">Get Recommendations</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
        <section className="frame-parent24">
          {recipeData.map((recipe) => (
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

export default ChefPage;
