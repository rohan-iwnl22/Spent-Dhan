import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import DashBoard from "./pages/dashBoard";
import HomePage from "./pages/HomePage";
import RecurringPaymentsAlerts from "./pages/RecurringPayment";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/payment" element={<RecurringPaymentsAlerts/>}></Route>
          <Route path="*" element={<HomePage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
