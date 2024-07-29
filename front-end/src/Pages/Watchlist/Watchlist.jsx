import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/firebase'; // Adjust the import path accordingly

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      setError('');
      try {
        const user = auth.currentUser;
        if (user) {
          const watchlistRef = db.collection('watchlists').doc(user.uid);
          const watchlistDoc = await watchlistRef.get();
          if (watchlistDoc.exists) {
            setWatchlist(watchlistDoc.data().items); // Adjust based on Firestore structure
          } else {
            console.log('No watchlist found');
          }
        } else {
          console.log('User is not logged in');
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Failed to fetch watchlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Watchlist</h1>
      <ul>
        {watchlist.map((item, index) => (
          <li key={index}>{item.title}</li> // Adjust this based on your Firestore structure
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;