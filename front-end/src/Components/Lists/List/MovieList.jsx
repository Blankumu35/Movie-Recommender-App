import React, { useEffect, useState } from 'react';
import '../../../App.css'
import Text from 'react-lines-ellipsis'
import { Icon } from '@iconify/react';


import { Link } from 'react-router-dom';
import { fetchMovies, IMAGE_BASE_URL } from '../../../api/api';
import Pagination from '../../PageChanger/Pagination'; // Ensure this is used somewhere if imported

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [options, setOptions] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        const movieData = await fetchMovies(currentPage);
        console.log(movieData.data);
        setMovies(movieData.data);
        setTotalPages(movieData.totalPages);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleOptions = () => {
    console.log(options)
    return setOptions(!options);
  }



  return (
    <div>
      {loading ? (
        <>
        <div style={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center', marginLeft:110}}>
        <div className="loader"/>
        <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'center' }}>Loading...</p>
        </div>
        </>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
      <div className='genre-selector'>
        <ul>
          <li>
            Action
          </li>
           <li>
            Adventure
          </li>
           <li>
            Animation
          </li>
           <li>
            Comedy
          </li>
           <li>
            Crime
          </li>
           <li>
            Documentary
          </li>
          <li style={{marginLeft:50,marginTop:3}}>
           <Icon icon="mingcute:down-line" width="1.2em" height="1.2em" onClick={handleOptions} />
          </li>
    {options && 
    <div className='options'>
      <ul>
          <li>
            Action
          </li>
           <li>
            Adventure
          </li>
           <li>
            Animation
          </li>
           <li>
            Comedy
          </li>
           <li>
            Crime
          </li>
        </ul>
      </div>

    }
          <input type='search'></input>
        </ul>
      </div>
      <h1 style={{marginTop:30, marginBottom:20, textAlign:'left', marginLeft:15, fontSize:25}}>Popular Movies</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {movies.map((movie) => (
              <div key={movie.id} style={{ margin: '10px', textAlign: 'center', maxWidth:150  }}>
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    style={{maxWidth: '150px', height: '250px', objectFit: 'cover'}}
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
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Pagination size='large' currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default MovieList;