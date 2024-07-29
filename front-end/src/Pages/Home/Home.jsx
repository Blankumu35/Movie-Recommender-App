import React, { useEffect, useState } from 'react';
import '../../App.css'
import Text from 'react-lines-ellipsis'
import axios from 'axios';
import LikeButton from '../../Components/LikeButton/LikeButton';
import Pagination from '../../Components/PageChanger/Pagination';
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent:'center', alignItems:'center' }}>
          {movies.map(movie => (
            <div key={movie.id} style={{ margin: '10px', textAlign: 'center', maxWidth:150 }}>
                <LikeButton id={movie.id} type="movie" className=':hover ' />
              <Link to={`/movie/${movie.id}`}>
                <img 
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                  alt={movie.title} 
                  style={{ maxWidth: '150px', height: '250px', objectFit: 'cover' }} 
                />
                <div className='bg-[#000000]/[0.5] rounded-b-[20px] mb-[20px]'>
                <div style={{border:'solid', borderColor:'orange', display:'inline-block', padding:7, borderRadius:'16px', borderWidth:'2px'}}>
                <p className='text-[12px]'>{(Math.floor(movie.vote_average*10))/10}</p>
                </div>
                <p style={{fontSize:11, marginBottom:5}}><Text text={`${movie.title}`} maxLine='1' /></p>
                </div>
              </Link>
            </div>
          ))}
        </div>
          <div style={{color:'white'}}>
            <Pagination size='large' currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
            </div>
      </div>

      <div>
        <h1>Popular TV Shows</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', }}>
          {shows.map(show => (
            <div key={show.id} style={{ margin: '10px', textAlign: 'center', maxWidth:150  }}>
                <LikeButton id={show.id} type="show" />
              <Link to={`/show/${show.id}`}>
                <img 
                  src={`${IMAGE_BASE_URL}${show.poster_path}`} 
                  alt={show.title} 
                  style={{ width: '150px', height: '250px', objectFit: 'cover' }} 
                />
                <div className='bg-[#000000]/[0.5] rounded-b-[20px] mb-[20px]'>
                <div style={{border:'solid', borderColor:'orange', display:'inline-block', padding:7, borderRadius:'16px', borderWidth:'2px'}}>
                <p className='text-[12px]'>{(Math.floor(show.vote_average*10))/10}</p>
                </div>
                <p className='text-[12px]'><Text text={show.name} maxLine='1' ellipses='...' trimRight/></p>
                </div>
              </Link>
            </div>
          ))}
        </div>
            <Pagination size='large' currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
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
                style={{ width: '150px', height: '250px', objectFit: 'cover' }} 
              />
              <LikeButton id={actor.id} type="movie" />
              <p>{actor.name}</p>
            </div>
            </Link>
          ))}
        </div>
            <Pagination size='large' currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      </div>
    </>
  );
};

export default MovieList;