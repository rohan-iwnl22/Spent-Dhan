import React from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import DashBoard from "./pages/dashBoard";
import HomePage from "./pages/homePage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar></Navbar>
        </div>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="*" element={<HomePage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
