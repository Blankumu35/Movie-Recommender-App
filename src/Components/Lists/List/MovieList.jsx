import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovies, IMAGE_BASE_URL } from '../../../api/api';
import pagination from '../../PageChanger/PageChange'; // Ensure this is used somewhere if imported

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div>
      <h1>Popular Movies</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {movies.map((movie) => (
              <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                  />
                  <p style={{ fontSize: 10 }}>{movie.title}</p>
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
        </>
      )}
    </div>
  );
};

export default MovieList;