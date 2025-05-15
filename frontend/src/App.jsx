// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RecipeList from "./Pages/RecipeList";
import RecipeDetails from "./Pages/RecipeDetails";
import AddRecipe from "./Pages/AddRecipe";
import RecipeTable from "./Pages/RecipeTable";
import UpdateRecipe from "./Pages/UpdateRecipe";
import RecipeManagementLanding from "./Pages/RecipeManagementLanding";
import ChallengesPage from "./Pages/ChallengesPage";
import ChallengeLanding from "./Pages/ChallengeLanding";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CookingTips from "./Pages/CookingTips"; //mayomi
import AddTip from "./Pages/AddTip";//mayomi

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/recipe-table" element={<RecipeTable />} />
        <Route path="/update-recipe/:id" element={<UpdateRecipe />} />
        <Route path="/landing-page" element={<RecipeManagementLanding />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/challenge-landing" element={<ChallengeLanding />} />
        <Route path="/cookingTips" element={<CookingTips />} />
        <Route path="/addtip" element={<AddTip />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
