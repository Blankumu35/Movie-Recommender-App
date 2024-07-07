import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY; 
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL; 

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [filteredActors, setFilteredActors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMovies = async (page) => {
      try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
          params: {
            api_key: API_KEY,
            language: 'en-US',
            page: page
          }
        });
        console.log(response.data.results)
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const fetchShows = async (page) => {
      try {
        const response = await axios.get(`${BASE_URL}/discover/tv`, {
          params: {
            api_key: API_KEY,
            language: 'en-US',
            page: page
          }
        });
        setShows(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchShows(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchActors = async (page) => {
      try {
        const response = await axios.get(`${BASE_URL}/person/popular`, {
          params: {
            api_key: API_KEY,
            language: 'en-US',
            page: page
          }
        });
        setActors(response.data.results);
        setFilteredActors(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    fetchActors(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setFilteredActors(
      actors.filter(actor =>
        actor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, actors]);

  return (
    <>
      <div>
        <h1>Popular Movies</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {movies.map(movie => (
            <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
              <Link to={`/movie/${movie.id}`}>
                <img 
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                  alt={movie.title} 
                  style={{ width: '200px', height: '300px', objectFit: 'cover' }} 
                />
                <p style={{fontSize:10}}>{movie.title}</p>
              </Link>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      <div>
        <h1>Popular TV Shows</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {shows.map(show => (
            <div key={show.id} style={{ margin: '10px', textAlign: 'center' }}>
              <Link to={`/show/${show.id}`}>
                <img 
                  src={`${IMAGE_BASE_URL}${show.poster_path}`} 
                  alt={show.title} 
                  style={{ width: '200px', height: '300px', objectFit: 'cover' }} 
                />
                <p>{show.title}</p>
              </Link>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>

      <div>
        <h1>Popular Actors</h1>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search for an actor..." 
            style={{ padding: '10px', width: '300px', fontSize: '16px' }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredActors.map(actor => (
            <Link to={`/actor/${actor.id}`}>
            <div key={actor.id} style={{ margin: '10px', textAlign: 'center' }}>
              <img 
                src={`${IMAGE_BASE_URL}${actor.profile_path}`} 
                alt={actor.name} 
                style={{ width: '200px', height: '300px', objectFit: 'cover' }} 
              />
              <p>{actor.name}</p>
            </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default MovieList;