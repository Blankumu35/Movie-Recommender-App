import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home/Home';
import MovieList from './Components/Lists/List/MovieList';
import ShowList from './Components/Lists/List/ShowList';
import MovieDetails from './Pages/Details/MovieDetails';
import ShowDetails from './Pages/Details/ShowDetails';
import ActorDetails from './Pages/Details/ActorDetails';
import LoginPage from './Pages/Login/Login';
import SignUpPage from './Pages/SignUp/SignUp';
import Watchlist from './Pages/Watchlist/Watchlist'; // Adjust the import path accordingly
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute'; // Adjust the import path accordingly

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/movies" element={<MovieList />} />  
        <Route path="/tvshows" element={<ShowList />} />                
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/signUp" element={<SignUpPage />} /> 
        <Route element={<ProtectedRoute />}>
          <Route path="/watchlist" element={<Watchlist />} />
        </Route> 
      </Routes>
    </Router>
  );
};

export default App;