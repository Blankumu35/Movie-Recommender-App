import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LikeButton from '../../Components/LikeButton/LikeButton';
import Bookmark from '../../Components/Bookmark/Bookmark';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../../App.css'
import 'react-icons'
import { Icon } from '@iconify/react';
import { LiaClosedCaptioningSolid, LiaDoorClosedSolid, LiaGithub, LiaLinkedin, LiaPlayCircle, LiaWindowClose, LiaWindowCloseSolid } from 'react-icons/lia';

import fakeImage from '../../assets/default-movie.png'
import fakeMan from '../../assets/default-man.jpg';
import fakeWoman from '../../assets/default-woman.jpg';
import Rating from '../../Components/Rating/Rating';


const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const BACKGROUND_IMAGE_BASE_URL = import.meta.env.VITE_BACKGROUND_IMAGE_BASE_URL;

const MovieDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
     const [size, setSize] = useState('medium');


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
        console.log(response.data)
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
        console.log(response2.data.results)
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
        console.log(response.data.cast);
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

  useEffect(() => {
    if (showTrailer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Reset overflow on unmount
    };
  }, [showTrailer]);

  const image = (item) => {
  return item.media_type === 'tv' 
    ? (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : `${fakeImage}`)
    : item.media_type === 'movie' 
      ? (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : `${fakeImage}`)
      : item.profile_path 
        ? `${IMAGE_BASE_URL}${item.profile_path}` 
        : item.gender === 1 ? `${fakeWoman}` : `${fakeMan}`;
};

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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 110 }}>
          <div className="loader" />
          <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'center' }}>Loading...</p>
        </div>
      ) : details ? (
        <div className='main-overview' style={{ margin: '20px', display:'flex', flexDirection:'column', height:'100%', width:'100%'}}>
        <img src={`${BACKGROUND_IMAGE_BASE_URL}${details.backdrop_path}`} className='backdrop-image' />
        <div className='backdrop-image-overshadow' />
          <div className='media-overview items-center sm:flex-row'>
            <img 
              src={`${IMAGE_BASE_URL}${details.poster_path}`} 
              alt={details.title} 
              className='order-1 sm:order-1'
              style={{ width: '300px', height: '450px', objectFit: 'cover', marginRight:10, borderRadius:8 , marginBottom:100}} 
            />
          <div className='media-details mt-[0px] ml-[15px] order-2 sm:order2' >
            <h1 className='mb-2 text-start text-[#000] font-semibold'>{details.title}</h1>
           <div className='media-mini-details'>
            <ul className='ml-5 text-[#000]'>
              <li>
                <p className='text-[#000]/[0.9]'>{details.release_date}</p>
              </li>
              <li>
                <div className='flex gap-[10px]'>
                 {details.genres.map((genre,index) => (
                   <p className='text-[#000]/[0.9]' key={genre.id}>{genre.name}{index < details.genres.length-1? ",":""}</p>
                 ))}
                 </div>
              </li>
              <li>
                <p className='text-[#000]/[0.9]'> {`${(Math.floor(details.runtime/60))}h ${details.runtime-(Math.floor(details.runtime/60)*60)}m `}</p>
              </li>
            </ul>
            </div>
            <div className='w-20 h-20 text-[20px] mb-5'>
            <Rating value={Math.floor(details.vote_average * 10)} maxValue={100} text={Math.floor(details.vote_average * 10)}  textSize='21px'
                             pathColor='#00ff00' trailColor='#bbbfb' textColor='#fff' backgroundColor='#000000' backgroundPadding={4}  />
              </div>
                 <div className='buttons flex mb-[25px] gap-[8px]'>
                   <LikeButton id={details}  type="movie" className=':hover' color={'red'} />
                   <Bookmark id={details} type="movie" className=':hover ' color={'gold'}/>
                 {(trailer !== undefined) && (
                         <p className='flex gap-[5px] text-[30px] justify-center items-center cursor-pointer' onClick={() => setShowTrailer(true)}>
                           <LiaPlayCircle /> Play trailer
                         </p>  )}            
                 </div>
                 
            <h2 className='text-[25px] text-start text-[#000] font-semibold'>Overview</h2>
            <p className='overview text-[15px] text-start text-[#000]/[0.9]'>{details.overview}</p>
            <div className='flex-row mt-10'>
              <ul className='flex text-start gap-[45px]'>
                <li className='flex gap-[45px]'>{cast.map((person, index) => (
                  person.known_for_department === 'Directing' ? (
                    <div key={index}>
                    <>
                      <p className='text-[#000] font-semibold'>{person.name}</p>
                      <p className='text-[#000]/[0.9] font-light'>Director</p>
                      </>
                    </div>
                  ) : null
                ))}
                </li>
                <li className='flex gap-[45px]'>{cast.map((person, index) => (
                  person.known_for_department === 'Writing' ? (
                    <div key={index}>
                    <>
                      <p className='text-[#000] font-semibold' >{person.name}</p>
                      <p className='text-[#000]/[0.9] font-light'>Writer</p>
                      </>
                    </div>
                  ) : null
                ))}</li>
              </ul>
            </div>
            </div>
          </div>
          {showTrailer && (
            <div className='flex fixed top-0 bottom-0 left-0 right-0 bg-[#000000]/[0.96] justify-center items-center z-1000'>
            <div className='flex-column'>
            <div className='flex justify-between bg-[#000000]/[0.96] mt-[10px] mb-[10px] items-end text-[20px]'>
              <p className='ml-[20px]'>Play Trailer</p>
              <p className='cursor-pointer text-[2rem] text-end mr-[20px]' onClick={() => setShowTrailer(false)}><LiaWindowCloseSolid/></p>
            </div>  
              <iframe
                width="800"
                height="480"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Trailer"
              ></iframe>
              </div>
            </div>
          )}
          <div>
           <div style={{ width: '100%', marginTop: '50px', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <h1 style={{ textAlign: 'start', marginBottom: '20px', fontSize:25, marginLeft:25 }}>Cast</h1>
          <Carousel 
            responsive={responsive}
            containerClass="carousel-container"
            infinite={true}
            autoPlay={false}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={300}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-10-px"
          >
            {cast.map(actor => (
              <div key={actor.id} style={{ margin: '10px', textAlign: 'center', width: '150px' }}>
                <Link to={`/person/${actor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={image(actor)} 
                    alt={actor.name}
                    style={{ width: '150px', height: '225px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                  <p style={{ fontWeight: 'bold', marginTop: '10px', fontSize: '14px' }}>{actor.name}</p>
                  <p className='font-light text-[12px]' style={{ color: '#555' }}>{actor.character}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
</div>
      ) : (
        <p>Movie not found</p>
      )}
      {loading2 ? (
        <p>Recommendations...</p>
      ) : (
                <div>
          <h2 className='text-[20px] text-start ml-10 text-[white]'>Recommendations</h2>
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
              {similarMovies.map(movie => (
                <div key={movie.id} style={{ margin: '10px', textAlign: 'center', width: '200px' }}>
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
    </div>
  );
};

export default MovieDetails;