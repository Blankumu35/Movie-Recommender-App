import React, { useEffect, useState } from 'react';
import '../../App.css';
import Text from 'react-lines-ellipsis';
import axios from 'axios';


import { Link } from 'react-router-dom';
import LikeButton from '../../Components/LikeButton/LikeButton';
import Bookmark from '../../Components/Bookmark/Bookmark';
import Rating from '../../Components/Rating/Rating' 

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const BACKGROUND_IMAGE_BASE_URL = import.meta.env.VITE_BACKGROUND_IMAGE_BASE_URL;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [titleDetails, setTitleDetails] =useState([])
 const [movie,setMovie] = useState()

 /* useEffect(() => {
    const fetchAllMovies = async () => {
  const movies = [];
  
  // Use a for loop to iterate over movie IDs
  for (let id = 1; id <= 10000; id++) {
    try {
      // Make the API call
      const response = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY, language: 'en-US' }
      });
      
      // If the movie is found, push it to the movies array
      if (response.data) {
        movies.push(response.data);
        console.log(`Fetched movie ID ${id}:`, response.data);
      }
    } catch (error) {
      // Handle errors (e.g., if the movie ID does not exist)
      if (error.response && error.response.status === 404) {
        console.log(`Movie ID ${id} not found.`);
      } else {
        console.error('Error fetching details:', error);
      }
    }

    // Optional: Implement a delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  } 

  // Return or process the movies array
  console.log(`Fetched ${movies.length} movies.`);
  return movies;
};

// Call the function
fetchAllMovies();
  })*/

  useEffect(() => {
        let addData = []
    const fetchData = async () => {
      try {
        const [nowPlayingRes, trendingRes, topRatedRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/now_playing`, { params: { api_key: API_KEY, language: 'en-US' } }),
          axios.get(`${BASE_URL}/trending/movie/week`, { params: { api_key: API_KEY, language: 'en-US' } }),
          axios.get(`${BASE_URL}/movie/top_rated`, { params: { api_key: API_KEY, language: 'en-US' } })
        ]);
        console.log(nowPlayingRes.data.results)
        setTrending(trendingRes.data.results);
        setTopRated(topRatedRes.data.results);

        let i = 0;
        for(i = 0; i < 20; i++){
        
        const details = await axios.get(`${BASE_URL}/movie/${nowPlayingRes.data.results[i].id}`,{
          params: {
            api_key: API_KEY,
            language: 'en-US'
          }
        });
         addData.push(details.data) 
        }
          console.log(addData)
        setNowPlaying(addData)

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 2000, min: 1400 },
      items: 7
    },
    largeDesktop: {
      breakpoint: { max: 1400, min: 1020 },
      items: 4
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

 function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none", background: "red" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none", background: "green" }}
      onClick={onClick}
    />
  );
}
 
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: true,


  customPaging: (i) => (

    
    (i < 6 ) ? ( 
      
      <div style={{ position: 'relative' }}>
        <img 
          src={`${BACKGROUND_IMAGE_BASE_URL}${nowPlaying[i].backdrop_path}`} 
          alt={`dot-${(i)}`} 
        />
        <div style={{
          position: 'absolute',
          bottom: '3px',
          left: '3px',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '2px 5px',
          borderRadius: '3px',
          fontSize: '8px'
        }}>
          <p style={{ margin: 0 }}>{nowPlaying[i].title}</p>
        </div>
      </div>
    ) : (
      <div style={{ width: '0px', height: '0px', overflow: 'hidden' }} />
    )
  ),
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        customPaging: (i) => (
          (i < 4) ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={`${BACKGROUND_IMAGE_BASE_URL}${nowPlaying[i].backdrop_path}`} 
                alt={`dot-${i}`} 
              />
              <div style={{
                position: 'absolute',
                bottom: '2px',
                left: '2px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '2px 5px',
                borderRadius: '3px',
                fontSize: '7px'
              }}>
                <p style={{ margin: 0 }}>{nowPlaying[i].title}</p>
              </div>
            </div>
          ) : (
            <div style={{ width: '0px', height: '0px', overflow: 'hidden' }} />
          )
        )
      }
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: (i) => (
          (i < 3) ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={`${BACKGROUND_IMAGE_BASE_URL}${nowPlaying[i].backdrop_path}`} 
                alt={`dot-${i}`} 
              />
              <div style={{
                position: 'absolute',
                bottom: '2px',
                left: '2px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '2px 5px',
                borderRadius: '3px',
                fontSize: '6px'
              }}>
                <p style={{ margin: 0 }}>{nowPlaying[i].title}</p>
              </div>
            </div>
          ) : (
            <div style={{ width: '0px', height: '0px', overflow: 'hidden' }} />
          )
        )
      }
    },
    {
      breakpoint: 464,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
                arrows: true,

        customPaging: (i) => (
          (i < 1) ? (
            <div style={{ position: 'relative' }}>
              <img 
                src={`${BACKGROUND_IMAGE_BASE_URL}${nowPlaying[i].backdrop_path}`} 
                alt={`dot-${i}`} 
              />
              <div style={{
                position: 'absolute',
                bottom: '1px',
                left: '1px',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '1px 3px',
                borderRadius: '2px',
                fontSize: '5px'
              }}>
                <p style={{ margin: 0 }}>{nowPlaying[i].title}</p>
              </div>
            </div>
          ) : (
            <div style={{ width: '0px', height: '0px', overflow: 'hidden' }} />
          )
        )
      }
    },
    {
      breakpoint: 300,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false // Disable dots on very small screens
      }
    }
  ]
};

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 110 }}>
          <div className="loader" />
          <p style={{ display: 'flex', flexWrap: 'wrap', textAlign: 'center' }}>Loading...</p>
        </div>
      ) : (
        <>
          <div className='-mt-[35px] flex-start justify-start items-start m-0' >
            <div style={{ width: '100%', marginLeft:'-10rem' }}>
            <div className="slider-container">
              <Slider {...sliderSettings} className='custom-slick-dots'>
                {nowPlaying.map((movie) => (
                  <div key={movie.id}>
                      <img
                        src={`${BACKGROUND_IMAGE_BASE_URL}${movie.backdrop_path}`}
                        alt={movie.title}
                        style={{  width:'100%',height: "auto", objectFit: "cover", zIndex:-5 }}
                        className='slider-image'
                      />
                      <div className='backdrop-image-overshadow-black' />
                       <div className='media-overview items-center'>

                <div className='media-details absolute top-10 mt-[0px], ml-[85px]' >
                          <Link to={`/movie/${movie.id}`}>
                            <h1 className='mb-2 text-start text-[#fff] font-semibold'>{movie.title}</h1>
                          </Link>
                 <div className='media-mini-details'>
                  <ul className='ml-5 text-[#fff]' style={{listStyle:'none'}}>
                    <li className='flex'>
                      <p className='text-[#fff]/[0.5]'>{movie.release_date[0]}</p>
                      <p className='text-[#fff]/[0.5]'>{movie.release_date[1]}</p>
                      <p className='text-[#fff]/[0.5]'>{movie.release_date[2]}</p>
                      <p className='text-[#fff]/[0.5]'>{movie.release_date[3]}</p>
                    </li>
                    <li>
                      <p className='text-[#fff]/[0.5]'> {`${movie.runtime} min`}</p>
                    </li>
                    <li>
                  <div className='flex gap-[10px]'>
                 {movie.genres.map((genre,index) => (
                    <>
                   <p className='text-[#fff]/[0.9]' key={index}>{genre.name}{index < movie.genres.length-1? <span className='text-[#fff]/[0]'>","</span>:""}</p>
                   </>
                 ))}
                 </div>
                    </li>
                  </ul>
                  </div>
                  <div className='w-20 h-20 text-[20px] mb-5'>
                  <Rating value={Math.floor(movie.vote_average * 10)} maxValue={100} text={Math.floor(movie.vote_average * 10)}  textSize='21px'
                             pathColor='#00ff00' trailColor='#bbbfb' textColor='#fff' backgroundColor='#000000' backgroundPadding={4}  />
                  </div>
                       <div className='buttons flex mb-[25px] gap-[8px]'>
                         <LikeButton id={movie}  type="movie" className=':hover' color={'red'} colorBorder={'rgba(255,255,255,0.6)'}/>
                         <Bookmark id={movie} type="movie" className=':hover' color={'gold'} colorBorder={'rgba(255,255,255,0.6)'}/>         
                       </div>
                  <div className='mb-[100px]'>
                  <h2 className='text-[25px] text-start text-[#fff] font-semibold'>Overview</h2>
                  <p className='overview text-[15px] text-start text-[#fff]/[0.9]' style={{height:130, width:800}}><Text text={`${movie.overview}`} maxLine='4' /></p>
                 </div>
                 </div>
                 </div>

                  </div>
                ))}
              </Slider>
              </div>
            </div>
          </div>
          <div>
            <div style={{ width: '100%', maxWidth: '1200px',  padding: '20px' }}>
              <h1 style={{ textAlign: 'start', marginBottom: '20px', fontSize:25, marginLeft:25 }}>Trending</h1>
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
                {trending.map(movie => (
                  <div key={movie.id} style={{ margin: '10px', textAlign: 'center', maxWidth: 150 }}>
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        style={{width:'100%', maxWidth: '150px', height: '250px', objectFit: 'cover' }}
                      />
                    </Link>
                      <div className='bg-[#000000] rounded-b-[10px] mb-[20px]'>
                      <div className='flex justify-center'>
                      <LikeButton id={movie} type="movie" className=':hover' size={'small'} color={'red'} colorBorder={'rgba(255,255,255,0.6)'}/>
                        <div style={{ border: 'solid', borderColor: 'orange', display: 'inline-block', padding: 7, marginBottom:7,borderRadius: '50%', borderWidth: '2px' }}>
                          <p className='text-[12px]'>{((Math.floor(movie.vote_average * 10)) / 10)}</p>
                        </div>
                        <Bookmark id={movie} type="movie" className=':hover mb-[10px]' size={'medium'} color={'gold'} colorBorder={'rgba(255,255,255,0.6)'} /> 
                        </div>   
                        <Link to={`/movie/${movie.id}`}>     
                        <p style={{ fontSize: 11, marginBottom: 5 }}><Text text={`${movie.title}`} maxLine='1' /></p>
                        </Link>
                      </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div>
            <div style={{ width: '100%', maxWidth: '1200px', padding: '20px' }}>
              <h1 style={{ textAlign: 'start', marginBottom: '20px', fontSize:25, marginLeft:25 }}>Top Rated</h1>
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
                {topRated.map(movie => (
                  <div key={movie.id} style={{ margin: '10px', textAlign: 'center', maxWidth: 150 }}>
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        style={{width:'100%', maxWidth: '150px', height: '250px', objectFit: 'cover' }}
                      />
                    </Link>
                      <div className='bg-[#000000] rounded-b-[10px] mb-[20px]'>
                      <div className='flex justify-center'>
                      <LikeButton id={movie} type="movie" className=':hover' size={'small'} color={'red'} colorBorder={'rgba(255,255,255,0.6)'}/>
                        <div style={{ border: 'solid', borderColor: 'orange', display: 'inline-block', padding: 7, marginBottom:7,borderRadius: '50%', borderWidth: '2px' }}>
                          <p className='text-[12px]'>{((Math.floor(movie.vote_average * 10)) / 10)}</p>
                        </div>
                        <Bookmark id={movie} type="movie" className=':hover mb-[10px]' size={'medium'} color={'gold'} colorBorder={'rgba(255,255,255,0.6)'} /> 
                        </div>   
                        <Link to={`/movie/${movie.id}`}>     
                        <p style={{ fontSize: 11, marginBottom: 5 }}><Text text={`${movie.title}`} maxLine='1' /></p>
                        </Link>
                      </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;