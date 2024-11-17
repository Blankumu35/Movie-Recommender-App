import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchShows, IMAGE_BASE_URL } from '../../../api/api'; // Replace with correct path
import Pagination from '../../PageChanger/Pagination'; // Ensure this is used somewhere if imported
import Text from 'react-lines-ellipsis';
import { Icon } from '@iconify/react';
import fakeImage from '../../../assets/default-movie.png'
import LikeButton from '../../../Components/LikeButton/LikeButton';
import Bookmark from '../../../Components/Bookmark/Bookmark';
import Rating from '../../../Components/Rating/Rating' 


const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [options, setOptions] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('Popular TV Shows');

  useEffect(() => {
    const getShows = async () => {
      setLoading(true);
      try {
        const showData = await fetchShows(currentPage, selectedGenre);
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
  }, [currentPage, selectedGenre]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleOptions = () => {
    setOptions(!options);
  };

  const handleGenreClick = (genre, title) => {
    setSelectedGenre(genre);
    setTitle(title);
    setCurrentPage(1);
    setOptions(false);
  };


  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 110 }}>
          <div className="loader" />
          <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'center' }}>Loading...</p>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className='genre-selector'>
            <ul>
              <li onClick={() => handleGenreClick(10759, 'Action & Adventure')}>Action & Adventure</li>
              <li onClick={() => handleGenreClick(16, 'Animation')}>Animation</li>
              <li onClick={() => handleGenreClick(35, 'Comedy')}>Comedy</li>
              <li onClick={() => handleGenreClick(80, 'Crime')}>Crime</li>
              <li onClick={() => handleGenreClick(99, 'Documentary')}>Documentary</li>
              <li style={{ marginLeft: 0, marginTop: 3 }}>
                <Icon icon="mingcute:down-line" width="1.2em" height="1.2em" onClick={handleOptions} />
              </li>
              {options &&
                <div className='options'>
                  <ul>
                    <li onClick={() => handleGenreClick(10759, 'Action & Adventure')}>Action & Adventure</li>
                    <li onClick={() => handleGenreClick(16, 'Animation')}>Animation</li>
                    <li onClick={() => handleGenreClick(35, 'Comedy')}>Comedy</li>
                    <li onClick={() => handleGenreClick(80, 'Crime')}>Crime</li>
                    <li onClick={() => handleGenreClick(99, 'Documentary')}>Documentary</li>
                  </ul>
                </div>
              }

            </ul>
          </div>
          <h1 style={{ marginTop: 30, marginBottom: 20, textAlign: 'left', marginLeft: 15, fontSize: 25 }}>{title}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {shows.map((show) => (
              <div key={show.id} style={{ margin: '10px', textAlign: 'center', maxWidth: 150 }}>
                <Link to={`/tv/${show.id}`}>
                  <img
                    src={(show.poster_path)?`${IMAGE_BASE_URL}${show.poster_path}`: `${fakeImage}`}
                    alt={show.title}
                    style={{width:'100%', maxWidth: '150px', height: '250px', objectFit: 'cover' }}
                  />
                </Link>
                   <div className='bg-[#000000] rounded-b-[10px] mb-[20px]'>
                      <div className='flex justify-center'>
                      <LikeButton id={show} type="tv" className=':hover' size={'small'} color={'red'} colorBorder={'rgba(255,255,255,0.6)'}/>
                        <div style={{ border: 'solid', borderColor: 'orange', display: 'inline-block', padding: 7, marginBottom:7,borderRadius: '50%', borderWidth: '2px' }}>
                          <p className='text-[12px]'>{((Math.floor(show.vote_average * 10)) / 10)}</p>
                        </div>
                        <Bookmark id={show} type="tv" className=':hover mb-[10px]' size={'medium'} color={'gold'} colorBorder={'rgba(255,255,255,0.6)'} /> 
                        </div>   
                        <Link to={`/tv/${show.id}`}>     
                        <p style={{ fontSize: 11, marginBottom: 5 }}><Text text={`${show.name}`} maxLine='1' /></p>
                        </Link>
                      </div>
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

export default ShowList;