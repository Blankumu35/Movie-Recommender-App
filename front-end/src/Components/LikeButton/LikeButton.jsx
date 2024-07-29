import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import axios from 'axios';
import { auth } from '../../firebase/firebase';

const LikeButton = ({ id, type }) => {
  const [liked, setLiked] = useState(false);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchLikedItems = async () => {
      if (userId) {
        const response = await axios.get(`/liked-items/${userId}`);
        setLiked(response.data);
      }
    console.log(liked)
    };

    fetchLikedItems();
  }, [id, type, userId]);

  const handleLikeChange = async (event) => {
    setLiked(event.target.checked);

    if (userId) {
      await axios.post('http://localhost:5000/Users/User', {
        userId,
        itemId: id,
        itemType: type
      });
    }
  };

  return (
    <Checkbox 
      checked={liked}
      onChange={handleLikeChange}
      icon={<FavoriteBorder />} 
      checkedIcon={<Favorite />} 
    />
  );
};

export default LikeButton;