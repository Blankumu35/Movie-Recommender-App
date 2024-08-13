import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Text from 'react-lines-ellipsis';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../../App.css';
import LikeButton from '../../Components/LikeButton/LikeButton';
import { Icon } from '@iconify/react';

import fakeImage from '../../assets/default-movie.png'
import fakeMan from '../../assets/default-man.jpg';
import fakeWoman from '../../assets/default-woman.jpg';

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
    const [showFullOverview, setShowFullOverview] = useState(false);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/person/${id}`, {
          params: { api_key: API_KEY, language: 'en-US' }
        });
                console.log(response.data);

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
          params: { api_key: API_KEY, language: 'en-US' }
        });
        console.log(response.data.cast)
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
          params: { api_key: API_KEY, language: 'en-US' }
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

   const image = (item) => {
  return item.media_type === 'tv' 
    ? (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : `${fakeImage}`)
    : item.media_type === 'movie' 
      ? (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : `${fakeImage}`)
      : item.profile_path 
        ? `${IMAGE_BASE_URL}${item.profile_path}` 
        : item.gender === 1 ? `${fakeWoman}` : `${fakeMan}`;
};

  useEffect(() => {
    if (showFullOverview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [showFullOverview]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 2000, min: 1024 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '50px' }}>
          <div className="loader" />
          <p>Loading actor details...</p>
        </div>
      ) : details ? (
        <div style={{ margin: '20px', display:'flex' }}>
          <div className='backdrop-image-overshadow' />
          <div style={{ textAlign: 'center', marginBottom: '160px' }}>
            <img 
                    src={image(details)} 
              alt={details.name} 
              style={{ width: '300px', height: '450px', objectFit: 'cover', borderRadius: '10px' }} 
            />
          </div>
          <div style={{ margin: '0 auto', maxWidth: '800px', textAlign: 'center' }}>
            <h1 className='mb-[70px] text-start text-[#000] font-semibold'>{details.name}</h1>
          <div className='buttons flex mb-[25px] gap-[8px]'>
              <LikeButton id={details}  type="person" className=':hover ' />
            </div>
       <h2 className='text-[25px] text-start text-[#000] font-semibold'>Overview</h2>
              <Text
                className={`overview text-[15px] text-start text-[#000]/[0.9] mb-0`}
                text={details.biography || 'No biography available.'}
                maxLine={4}
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
              {!showFullOverview && (
                <button className='read-more-button' onClick={() => setShowFullOverview(true)}>
                  Read More
                </button>
              )}         
                 <p className='text-start text-[#000] font-semibold mb-3'><strong>Birthday:</strong> {details.birthday || 'N/A'}</p>
            <p className='text-start  text-[#000] font-semibold'><strong>Place of Birth:</strong> {details.place_of_birth || 'N/A'}</p>
            <div>

            </div>
          </div>
        </div>
        
      ) : (
        <p>Actor not found</p>
      )}
      {loadingMovies ? (
        <p>Loading movies...</p>
      ) : (
        <div>
          <h2 className='text-[20px] text-start text-[white] ml-10'>Movies <span className='font-light text-[white]/[0.8]'>{`(${movies.length})`}</span></h2>
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Carousel
              responsive={responsive}
              containerClass="carousel-container"
              itemClass="carousel-item"
              infinite={true}
              autoPlay={true}
              keyBoardControl={true}
              customTransition="transform 300ms ease-in-out"
              transitionDuration={300}
              removeArrowOnDeviceType={["tablet", "mobile"]}
            >
              {movies.map((movie) => (
                <div key={movie.id} style={{ margin: '10px', textAlign: 'center' }}>
                  <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                    src={(movie.poster_path) ? `${IMAGE_BASE_URL}${movie.poster_path}` : `${fakeImage}` }
                      alt={movie.title}
                      style={{ width: '200px', height: '300px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '14px' }}>{movie.title}</p>
                  </Link>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
      {loadingShows ? (
        <p>Loading TV shows...</p>
      ) : (
        <div>
          <h2 className='text-[20px] text-start text-[white] ml-10'>TV Shows <span className='font-light text-[white]/[0.8]'>{`(${shows.length})`}</span></h2>
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <Carousel
              responsive={responsive}
              containerClass="carousel-container"
              itemClass="carousel-item"
              infinite={true}
              autoPlay={true}
              keyBoardControl={true}
              customTransition="transform 300ms ease-in-out"
              transitionDuration={300}
              removeArrowOnDeviceType={["tablet", "mobile"]}
            >
              {shows.map((show) => (
                <div key={show.id} style={{ margin: '10px', textAlign: 'center' }}>
                  <Link to={`/tv/${show.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                    src={(show.poster_path)?`${IMAGE_BASE_URL}${show.poster_path}`: `${fakeImage}`}
                      alt={show.name}
                      style={{ width: '200px', height: '300px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '14px' }}>{show.name}</p>
                  </Link>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
      {showFullOverview && (
        <div className='modal-overlay z-1001'>
          <div className='modal-content'>
            <p className='text-[20px] font-semibold mb-5'>Full Overview</p>
            <p className='text-[white]/[0.8] leading-[30px]	'>{details.biography || 'No biography available.'}</p>
            <button className='close-modal' onClick={() => setShowFullOverview(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

    

export default ActorDetails;