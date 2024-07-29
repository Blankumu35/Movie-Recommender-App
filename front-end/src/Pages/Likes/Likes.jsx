import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext/authContext'; // Ensure the path is correct to your AuthContext

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const LikedItems = () => {
  const { currentUser } = useAuth();
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:5000/liked-items/${currentUser.uid}`);
          setLikedItems(response.data);
        } catch (error) {
          console.error('Error fetching liked items:', error);
        }
      }
    };

    fetchLikedItems();
  }, [currentUser]);

  return (
    <div>
      <h1>Liked Items</h1>
      <div className="flex flex-wrap">
        {likedItems.map((item) => (
          <div key={item.itemId} className="m-2 text-center">
            <img
              src={`${IMAGE_BASE_URL}/${item.itemId}`}
              alt={item.itemType}
              className="w-48 h-72 object-cover"
            />
            <p className="text-sm">{item.itemType === 'movie' ? 'Movie' : 'TV Show'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedItems;