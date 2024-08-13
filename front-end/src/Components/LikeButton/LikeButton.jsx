import React, { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import axios from 'axios';
import { auth } from '../../firebase/firebase';

const LikeButton = ({ id, type }) => {
  const [liked, setLiked] = useState(false);
   const [size, setSize] = useState('medium');

  useEffect(() => {
    // Example condition to determine the size
    const handleSize = window.innerWidth < 600 ? 'small' : 'medium';
    setSize(handleSize);
  }, []);


  const userId = localStorage.getItem('ID');

 useEffect(() => {
  const fetchIsLikedItem = async () => {
            console.log(userId,id,type);

    if (userId) {
      try {
        // Make a POST request to check if the item is liked
        const response = await axios.post('http://localhost:5000/is-liked', {
          userId: userId,
          itemId: id,        
          itemType: type,
          like: true    
        });

        // Log the response for debugging
        console.log(response.data.isLiked);

        // Check the `isLiked` property in the response and update the state
        if (response.data.isLiked) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (error) {
        console.error('Error fetching liked items:', error);
      }
    }
  };

  // Call the function
  fetchIsLikedItem();
}, [id]);

  const handleLikeChange = async (event) => {
  const isChecked = event.target.checked; // Get the current checked state

  try {
    if (userId) {
      if (isChecked) {
        // Handle like request
        await axios.post('http://localhost:5000/likes', {
          userId,
          itemId: id,
          itemType: type,
          like: true
        });
      } else {
        // Handle unlike request
        await axios.delete('http://localhost:5000/likes', {
          data: {
            userId,
            itemId: id,
            itemType: type,
            like: true
          }
        });
      }
      
      // Update the state after the request completes
      setLiked(isChecked);
      console.log(liked)
    }
  } catch (error) {
    console.error('Error handling like/unlike:', error);
    // Optionally, revert the state if the request fails
    setLiked(!isChecked);
  }
};

return (
  <Checkbox 
    checked={liked}
    onChange={handleLikeChange}
    icon={<FavoriteBorder />} 
    checkedIcon={<Favorite />} 
    size='large'
  />
)
};

export default LikeButton;