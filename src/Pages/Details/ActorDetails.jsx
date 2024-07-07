import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const ActorDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingShows, setLoadingShows] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/person/${id}`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setDetails(response.data);
      } catch (error) {
        console.error('Error fetching actor details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/person/${id}/movie_credits`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setMovies(response.data.cast);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, [id]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/person/${id}/tv_credits`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setShows(response.data.cast);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      } finally {
        setLoadingShows(false);
      }
    };

    fetchShows();
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : details ? (
        <div style={{ textAlign: 'center' }}>
          <h1>{details.name}</h1>
          <img 
            src={`${IMAGE_BASE_URL}${details.profile_path}`} 
            alt={details.name} 
            style={{ width: '300px', height: '450px', objectFit: 'cover' }} 
          />
          <p>{details.biography}</p>
          <p>Birthday: {details.birthday}</p>
          <p>Place of Birth: {details.place_of_birth}</p>
        </div>
      ) : (
        <p>Actor not found</p>
      )}
      {loadingMovies ? (
        <p>Loading movies...</p>
      ) : (
        <div>
          <h2>Movies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {movies.map((movie, index) => (
              <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                  />
                  <p>{movie.title}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      {loadingShows ? (
        <p>Loading TV shows...</p>
      ) : (
        <div>
          <h2>TV Shows</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {shows.map((show, index) => (
              <div key={show.id} style={{ margin: '10px', textAlign: 'center' }}>
                <Link to={`/show/${show.id}`}>
                  <img
                    src={`${IMAGE_BASE_URL}${show.poster_path}`}
                    alt={show.name}
                    style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                  />
                  <p>{show.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorDetails;