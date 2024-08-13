import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;


const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('null');

    const currentUser =  localStorage.getItem('ID');


 useEffect(() => {
    const fetchBookmarkedItems = async () => {
      if (currentUser) {
        try {
        const response = await axios.get(`http://localhost:5000/bookmarked-items/${currentUser}`);
          console.log((response.data.bookmarkedItems))
          setWatchlist((response.data.bookmarkedItems));
        } catch (error) {
          console.error('Error fetching liked items:', error);
          setError('Error')

        }
      }
    };

    fetchBookmarkedItems();
    setLoading(false)
  }, []);


  if (loading) {
    return <p>Loading...</p>;
  }

 

  return (
    <div className='flex-start'>
      <h1>Your Watchlist</h1>
     <div className="flex flex-wrap justify-start gap-4 p-4">
  {watchlist.map((item) => (
    <div
      key={item.itemId.id}
      className="w-48 text-center bg-white shadow-md rounded-lg transform hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      <Link
        to={`/${item.itemType}/${item.itemId.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <img
          src={`${IMAGE_BASE_URL}/${item.itemId.poster_path}`}
          alt={item.itemType}
          className="w-48 h-60 object-cover rounded-t-lg"
        />
        <div className="p-2">
          <p className="text-sm font-semibold text-gray-800">
            {item.itemId.title}
          </p>
          <p className="text-xs text-gray-600">
            {item.itemType === 'movie' ? 'Movie' : 'TV Show'}
          </p>
        </div>
      </Link>
    </div>
  ))}
</div>
    </div>
  );
};

export default Watchlist;