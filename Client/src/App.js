import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import CuisineSelection from "./pages/CuisineSelection";
import HomePage from "./pages/HomePage";
import ChefPage from "./pages/ChefPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      {/* Route for Sign Up Page */}
      <Route path="/" element={<SignUpPage />} />

      {/* Route for Log In Page */}
      <Route path="/log-in-page" element={<LogInPage />} />

      {/* Route for Cuisine Selection */}
      <Route path="/cuisine-selection" element={<CuisineSelection />} />

      {/* Route for Home Page */}
      <Route path="/home-page1" element={<HomePage />} />

      {/* Route for Chef Page */}
      <Route path="/chef-page1" element={<ChefPage />} />

      <Route path="/profile" element={< ProfilePage/>} />
    </Routes>
  );
}

export default App;
