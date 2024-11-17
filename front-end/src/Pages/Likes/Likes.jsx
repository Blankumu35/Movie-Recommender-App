import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const LikedItems = () => {
  const [likedItems, setLikedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter state

  const currentUser = localStorage.getItem('ID');

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:5000/liked-items/${currentUser}`);
          setLikedItems(response.data.likedItems);
          setFilteredItems(response.data.likedItems); // Initialize filtered items
        } catch (error) {
          console.error('Error fetching liked items:', error);
        }
      }
    };

    fetchLikedItems();
  }, [currentUser]);

  // Update filtered items when search query or filter changes
  useEffect(() => {
    let results = likedItems;

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
  }, [searchQuery, likedItems, filter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 ">
      <h1 className="text-3xl font-bold text-center mb-8">Liked Items</h1>
      
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
        <button
          onClick={() => handleFilterChange('person')}
          className={`px-4 py-2 rounded-lg ${filter === 'person' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          Person
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search liked items..."
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
                  src={item.itemType === 'person'? `${IMAGE_BASE_URL}/${item.itemId.profile_path}`: `${IMAGE_BASE_URL}/${item.itemId.poster_path}`}
                  alt={item.itemType}
                  className="w-full h-72 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.itemType === 'movie' ? item.itemId.title : item.itemId.name }
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.itemType === 'movie' ? 'Movie' :
                    item.itemType==='tv'? 'TV Show': 'Person'}
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No liked items found.</p>
        )}
      </div>
    </div>
  );
};

export default LikedItems;