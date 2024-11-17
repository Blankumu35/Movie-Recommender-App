import React, { useEffect, useState } from 'react';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { searchItems, IMAGE_BASE_URL } from '../../api/api';
import { Link } from 'react-router-dom';

export const SearchComponent = ({ searchQuery, handleSearchChange }) => {
  const navigate = useNavigate();
  const [searchQueryInternal, setSearchQueryInternal] = useState(searchQuery || '');
  const [miniResults, setMiniResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setMiniResults(false);

    if (searchQueryInternal.trim()) {
      navigate(`/search?q=${searchQueryInternal}`);
    }
  };

  useEffect(() => {
    const fetchMiniResults = async () => {
      if (searchQueryInternal.trim()) {
        const results = await searchItems(searchQueryInternal); // Assuming searchItems is an async function
        const filteredResults = results.results.slice(0, 5); // Limit the results to a maximum of 5 items
        setMiniResults(filteredResults);
        console.log(results)
      } else {
        setMiniResults([]); // Clear mini results when the query is empty
      }
              console.log(miniResults)

    };

    fetchMiniResults();
  }, [searchQueryInternal]);

  const handleInputChange = (e) => {
    setSearchQueryInternal(e.target.value);
    handleSearchChange(e.target.value); // Update the parent component's searchQuery if needed
  };

  const Enter = () =>{
    setMiniResults(false);
  }

  return (
    <form onSubmit={handleSearchSubmit} className="search flex-row">
      <div className="search-wrapper">
        <FaMagnifyingGlass className="absolute top-3.5 left-3" />
        <input
          type="text"
          placeholder="Search movies and shows"
          value={searchQueryInternal}
          onChange={handleInputChange}
          className="search-input"
        />
        {(miniResults.length > 0) && (
          <form onSubmit={handleSearchSubmit} >
          <div className="mini-results justify-around">
            {miniResults.map((result, index) => (
              <Link to={`/${result.media_type}/${result.id}`} onClick={Enter}>
              <div key={index} className="mini-result-item">
                <img
                  src={(result.media_type ==='person')?`${IMAGE_BASE_URL}${result.profile_path}`:`${IMAGE_BASE_URL}${result.poster_path}`}
                  alt={result.title}
                  className="mini-result-image"
                />
                <span>{result.media_type ==='movie' ? result.title : result.name}</span>
              </div>
              </Link>
            ))}
            <div className='justify-around'>
              <button type='submit' className='search-button' onClick={Enter}>View all results</button>
            </div>
          </div>
          </form>
        )}
      </div>
    </form>
  );
};