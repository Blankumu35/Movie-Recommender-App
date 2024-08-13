import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const LikedItems = () => {
  const [likedItems, setLikedItems] = useState([]);

  const currentUser =  localStorage.getItem('ID');

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:5000/liked-items/${currentUser}`);
          console.log((response.data.likedItems))
          setLikedItems((response.data.likedItems));
        } catch (error) {
          console.error('Error fetching liked items:', error);

        }
      }
    };

    fetchLikedItems();
  }, []);

  return (
    <div>
      <h1>Liked Items</h1>
      <div className="flex flex-wrap">
        {likedItems.map((item) => (
          <div key={item.itemId.id} className="m-2 text-center">
             <Link to={`/${item.itemType}/${item.itemId.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
              src={`${IMAGE_BASE_URL}/${item.itemId.poster_path}`}
              alt={item.itemType}
              className="w-48 h-72 object-cover"
            />            
            <p className="text-sm">{item.itemId.title}</p>
            <p className="text-[7px]">{item.itemType === 'movie' ? 'Movie' : 'TV Show'}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedItems;