import React from 'react';
import './App.css'
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
import SearchResults from './Pages/SearchResult/SearchResults';
import ForYou from './Pages/For-You/ForYou';
import Watchlist from './Pages/Watchlist/Watchlist';
import LikedItems from './Pages/Likes/Likes';
import ProtectedRoute from './utils/ProtectedRoute/ProtectedRoute'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<ShowDetails />} />
          <Route path="/person/:id" element={<ActorDetails />} />
          <Route path="/movies" element={<MovieList />} />  
          <Route path="/tvshows" element={<ShowList />} />                
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/signUp" element={<SignUpPage />} /> 
          <Route path="/search" element={<SearchResults />} />
          <Route path="/forYou" element={<ForYou />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path='/likedItems' element={<LikedItems />} />
          </Route> 
        </Routes>
      </main>
    </Router>
  );
};

export default App;