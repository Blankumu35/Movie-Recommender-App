import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import MovieDetails from './Pages/MovieDetails';
import ShowDetails from './Pages/ShowDetails';
import ActorDetails from './Pages/ActorDetails'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
      </Routes>
    </Router>
  );
};

export default App;