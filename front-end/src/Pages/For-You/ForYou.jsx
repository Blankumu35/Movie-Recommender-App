import { useState, useEffect } from 'react';
import axios from 'axios'

const ForYou = () => {
const [recommendations, setRecommendations] = useState([]);

const userId = localStorage.getItem("ID")

useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/recommendations/${userId}`, { userId });
      console.log(response.data.recommendations)
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  fetchRecommendations();
}, [userId]);

    return (
        <div>
          {recommendations.map(item => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
    );
}
export default ForYou;