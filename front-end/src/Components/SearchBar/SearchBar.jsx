import React, { useState } from 'react';
import './SearchBar.css'
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export const SearchComponent = ({ searchQuery, handleSearchChange }) => {
  const navigate = useNavigate();
  const [showBar, setShowBar] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
<form onSubmit={handleSearchSubmit} className='search flex-row'>
  <div className="search-wrapper" >
    <input
      type="text"
      placeholder="Search movies and shows"
      value={searchQuery}
      onChange={handleSearchChange}
      className="search-input"
    />
    <button type="submit" className="search-button">Search</button>
  </div>
</form>

  );
};