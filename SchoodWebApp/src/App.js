import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css';

import LandingPage from "./Public/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<LandingPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
