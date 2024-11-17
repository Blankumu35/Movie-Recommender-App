import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchItems, IMAGE_BASE_URL } from '../../api/api';
import { Link } from 'react-router-dom';
import Text from 'react-lines-ellipsis';
import LikeButton from '../../Components/LikeButton/LikeButton';
import Bookmark from '../../Components/Bookmark/Bookmark';
import Rating from '../../Components/Rating/Rating' 

import fakeImage from '../../assets/default-movie.png';
import fakeMan from '../../assets/default-man.jpg';
import fakeWoman from '../../assets/default-woman.jpg';

import Pagination from '../../Components/PageChanger/Pagination';
import { Divider } from '@mui/material';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const searchQuery = query.get('q');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const searchData = await searchItems(searchQuery, currentPage);
        setResults(searchData.results);
        setTotalPages(searchData.total_pages);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

const image = (item) => {
  return item.media_type === 'tv' 
    ? (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : `${fakeImage}`)
    : item.media_type === 'movie' 
      ? (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : `${fakeImage}`)
      : item.profile_path 
        ? `${IMAGE_BASE_URL}${item.profile_path}` 
        : item.gender === 1 ? `${fakeWoman}` : `${fakeMan}`;
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
          <h1 style={{fontSize: 25, marginBottom: 10, marginTop: 10}}>Search Results for: <span className='text-[orange]/[0.9]'>{searchQuery}</span></h1>
          <Divider />
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          
            {results.map((item) => (
              <div key={item.id} style={{ margin: '10px', textAlign: 'center', maxWidth: 150 }}>
                  <img
                    src={image(item)} 
                    alt={item.title || item.name}
                    style={{ maxWidth: '150px', height: '250px', objectFit: 'cover' }}
                  />
                  <div className='bg-[#000000]/[0.5] rounded-b-[20px] mb-[20px]'>
                  <div className='bg-[#000000] rounded-b-[10px] mb-[20px]'>
                      <div className='flex justify-center'>
                      <LikeButton id={item} type={item.media_type} className=':hover' size={'small'} color={'red'} colorBorder={'rgba(255,255,255,0.6)'}/>
                        <div style={{ border: 'solid', borderColor:(10>item.vote_average && item.vote_average>7) ? 'green': (7>item.vote_average && item.vote_average>5)?'orange':'red' , display: 'inline-block', padding: 7, marginBottom:7,borderRadius: '50%', borderWidth: '2px' }}>
                          <p className='text-[12px]'>{((Math.floor(item.vote_average * 10)) / 10)}</p>
                        </div>
                        <Bookmark id={item} type={item.media_type} className=':hover mb-[10px]' size={'medium'} color={'gold'} colorBorder={'rgba(255,255,255,0.6)'} /> 
                        </div>   
                        <Link to={`/${item.media_type}/${item.id}`}>     
                        <p style={{ fontSize: 11, marginBottom: 5 }}><Text text={`${item.title || item.name}`} maxLine='1' /></p>
                        </Link>
                      </div>
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

export default SearchResults;