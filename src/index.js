import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Login from './components/login';
import Signup from './components/signup';
import StartupDashboard from './components/startupDashboard';
import InvestorDashboard from './components/investorDashboard';
import InvestorStartupSales from './components/investorStartupSales';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route index path="/login" element={<Login />} />
        <Route index path="/signup" element={<Signup />} />
        <Route index path="/Dashboard/startup" element={<StartupDashboard />} />
        <Route index path="/Dashboard/investor" element={<InvestorDashboard />} />
        <Route index path="/investorStartupSales" element={<InvestorStartupSales />} />
      </Routes>
    </HashRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
