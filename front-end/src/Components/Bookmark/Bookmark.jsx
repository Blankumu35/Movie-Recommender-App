import * as React from 'react';
import {useState, useEffect} from 'react'
import Checkbox from '@mui/material/Checkbox';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from 'axios';


export default function Bookmark({id, type, size, color, colorBorder}) {

   const [bookmark, setBookmark] = useState(false);
  


  const userId = localStorage.getItem('ID');

 useEffect(() => {
    const fetchBookmarkItems = async () => {
          //console.log(userId,id,type);

      if (userId) {
        const response = await axios.post(`http://localhost:5000/is-liked`,
        {
          userId,
          itemId: id,
          itemType: type,
          like: false
        });
         console.log(response.data.isLiked)
        if(response.data.isLiked === true ){
        setBookmark(true);
        }else{
        setBookmark(false);
        }

        
      }
    };

    fetchBookmarkItems();
  }, [id]); 

  const handleBookmarkChange = async (event) => {
  const isChecked = event.target.checked; // Get the current checked state
      console.log(bookmark)

  try {
    if (userId) {
      if (isChecked) {
        // Handle like request
        await axios.post('http://localhost:5000/likes', {
          userId,
          itemId: id,
          itemType: type,
          like: false  // This is a bookmark checkbox, not a like checkbox
        });
      } else {
        // Handle unlike request
        await axios.delete('http://localhost:5000/likes', {
          data: {
            userId,
            itemId: id,
            itemType: type,
            like: false // This is a bookmark checkbox, not a like checkbox
          }
        });
      }
      
                  console.log(isChecked)

      // Update the state after the request completes
      setBookmark(isChecked);
      console.log(bookmark)
    }
  } catch (error) {
    console.error('Error handling like/unlike:', error);
    // Optionally, revert the state if the request fails
    setBookmark(!isChecked);
  }
};
  return (
    <div>
      <Checkbox
        checked={bookmark}
        onChange={handleBookmarkChange}
        icon={<BookmarkBorderIcon style={{color: colorBorder || ''}} />}
        checkedIcon={<BookmarkIcon style={{color:color || ''}}/>}
        size={size || 'large'}

      />
    </div>
  );
}