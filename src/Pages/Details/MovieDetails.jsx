import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const MovieDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setDetails(response.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        const response2 = await axios.get(`${BASE_URL}/movie/${id}/similar`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setSimilarMovies(response2.data.results);
      } catch (error) {
        console.error('Error fetching similar movies:', error);
      } finally {
        setLoading2(false);
      }
    };

    fetchSimilarMovies();
  }, [id]);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}/credits`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setCast(response.data.cast);
      } catch (error) {
        console.error('Error fetching cast:', error);
      }
    };

    fetchCast();
  }, [id]);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        const trailerData = response.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        setTrailer(trailerData);
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

    fetchTrailer();
  }, [id]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}/images`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        setImages(response.data.backdrops);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : details ? (
        <div style={{ textAlign: 'center' }}>
          <h1>{details.title}</h1>
          <img 
            src={`${IMAGE_BASE_URL}${details.poster_path}`} 
            alt={details.title} 
            style={{ width: '300px', height: '450px', objectFit: 'cover' }} 
          />
          <p>{details.overview}</p>
          <p>Release Date: {details.release_date}</p>
          <p>Rating: {details.vote_average}</p>
          {trailer && (
            <div>
              <h2>Trailer</h2>
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          )}
          <h2>Cast</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cast.map(actor => (
              <div key={actor.id} style={{ margin: '10px', textAlign: 'center' }}>
                <Link to={`/actor/${actor.id}`}>
                  <img
                    src={`${IMAGE_BASE_URL}${actor.profile_path}`}
                    alt={actor.name}
                    style={{ width: '150px', height: '225px', objectFit: 'cover' }}
                  />
                  <p>{actor.name}</p>
                  <p>{actor.character}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Movie not found</p>
      )}
      {loading2 ? (
        <p>Loading similar movies...</p>
      ) : (
        <div>
          <h2>Similar Movies</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {similarMovies.map((movie, index) => (
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
    </div>
  );
};

export default MovieDetails;