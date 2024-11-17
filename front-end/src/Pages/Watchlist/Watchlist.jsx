import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter state

  const currentUser = localStorage.getItem('ID');

  useEffect(() => {
    const fetchBookmarkedItems = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:5000/bookmarked-items/${currentUser}`);
          setWatchlist(response.data.bookmarkedItems);
          setFilteredItems(response.data.bookmarkedItems); // Initialize filtered items
        } catch (error) {
          console.error('Error fetching watchlist items:', error);
          setError('Error fetching watchlist items.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookmarkedItems();
  }, [currentUser]);

  // Update filtered items when search query or filter changes
  useEffect(() => {
    let results = watchlist;

    // Apply filter based on the selected filter type
    if (filter !== 'all') {
      results = results.filter(item => item.itemType === filter);
    }

    // Further filter by search query
    results = results.filter(item =>
      item.itemId.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemId.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredItems(results);
  }, [searchQuery, watchlist, filter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 110 }}>
          <div className="loader" />
          <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'center' }}>Loading...</p>
        </div>);
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 ">
      <h1 className="text-3xl font-bold text-center mb-8">Your Watchlist</h1>
      
      {/* Filter Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange('movie')}
          className={`px-4 py-2 rounded-lg ${filter === 'movie' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Movie
        </button>
        <button
          onClick={() => handleFilterChange('tv')}
          className={`px-4 py-2 rounded-lg ${filter === 'tv' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          TV Show
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search your watchlist..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.itemId.id}
              className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 ease-in-out"
            >
              <Link
                to={`/${item.itemType}/${item.itemId.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img
                  src={`${IMAGE_BASE_URL}/${item.itemId.poster_path}`}
                  alt={item.itemType}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {(item.itemType === 'movie') ? item.itemId.title : item.itemId.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.itemType === 'movie' ? 'Movie' : 'TV Show'}
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No items found in your watchlist.</p>
        )}
      </div>
    </div>
  );
};

export default Watchlist;