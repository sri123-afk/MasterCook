import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import CuisineSelection from "./pages/CuisineSelection";
import HomePage from "./pages/HomePage";
import ChefPage from "./pages/ChefPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />

      <Route path="/log-in-page" element={<LogInPage />} />

      <Route path="/cuisine-selection" element={<CuisineSelection />} />

      <Route path="/home-page1" element={<HomePage />} />

      <Route path="/search" element={<SearchPage />} />

      <Route path="/chef-page1" element={<ChefPage />} />

      <Route path="/profile" element={< ProfilePage/>} />
    </Routes>
  );
}

export default App;
