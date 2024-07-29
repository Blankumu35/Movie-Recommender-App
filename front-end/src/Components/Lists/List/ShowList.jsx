import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchShows, IMAGE_BASE_URL } from '../../../api/api'; // Replace with correct path
import pagination from '../../PageChanger/Pagination'; // Ensure this is used somewhere if imported

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getShows = async () => {
      setLoading(true);
      try {
        const showData = await fetchShows(currentPage);
        console.log(showData.data);
        setShows(showData.data);
        setTotalPages(showData.totalPages);
      } catch (error) {
        console.error('Error fetching shows:', error);
        setError('Failed to fetch shows.');
      } finally {
        setLoading(false);
      }
    };
    getShows();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Popular Shows</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {shows.map((show) => (
              <div key={show.id} style={{ margin: '10px', textAlign: 'center' }}>
                <Link to={`/show/${show.id}`}>
                  <img
                    src={`${IMAGE_BASE_URL}${show.poster_path}`}
                    alt={show.title}
                    style={{ width: '200px', height: '300px', objectFit: 'cover' }}
                  />
                  <p style={{ fontSize: 10 }}>{show.title}</p>
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

export default ShowList;