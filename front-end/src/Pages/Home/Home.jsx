import React, { useEffect, useState } from 'react';
import '../../App.css';
import Text from 'react-lines-ellipsis';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LikeButton from '../../Components/LikeButton/LikeButton';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nowPlayingRes, trendingRes, topRatedRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/now_playing`, { params: { api_key: API_KEY, language: 'en-US' } }),
          axios.get(`${BASE_URL}/trending/movie/week`, { params: { api_key: API_KEY, language: 'en-US' } }),
          axios.get(`${BASE_URL}/movie/top_rated`, { params: { api_key: API_KEY, language: 'en-US' } })
        ]);
        console.log(nowPlayingRes.data.results)
        setNowPlaying(nowPlayingRes.data.results);
        setTrending(trendingRes.data.results);
        setTopRated(topRatedRes.data.results);
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
      breakpoint: { max: 2000, min: 1024 },
      items: 7
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 464,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
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
          <div>
            <div style={{ width: '100%', maxWidth: '1300px', padding: '20px', objectFit:'cover' }}>
              <h1>Now Playing</h1>
              <Slider {...sliderSettings}>
                {nowPlaying.map((movie) => (
                  <div key={movie.id}>
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                        alt={movie.title}
                        style={{  width:'100%',height: "auto", objectFit: "cover" }}
                      />                  
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
              <h1>Trending</h1>
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
                    <LikeButton id={movie.id} type="movie" className=':hover ' />
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        style={{ maxWidth: '150px', height: '250px', objectFit: 'cover' }}
                      />
                      <div className='bg-[#000000]/[0.5] rounded-b-[20px] mb-[20px]'>
                        <div style={{ border: 'solid', borderColor: 'orange', display: 'inline-block', padding: 7, borderRadius: '16px', borderWidth: '2px' }}>
                          <p className='text-[12px]'>{(Math.floor(movie.vote_average * 10)) / 10}</p>
                        </div>
                        <p style={{ fontSize: 11, marginBottom: 5 }}><Text text={`${movie.title}`} maxLine='1' /></p>
                      </div>
                    </Link>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div>
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
              <h1>Top Rated</h1>
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
                    <LikeButton id={movie.id} type="movie" className=':hover ' />
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        style={{ maxWidth: '150px', height: '250px', objectFit: 'cover' }}
                      />
                      <div className='bg-[#000000]/[0.5] rounded-b-[20px] mb-[20px]'>
                        <div style={{ border: 'solid', borderColor: 'orange', display: 'inline-block', padding: 7, borderRadius: '16px', borderWidth: '2px' }}>
                          <p className='text-[12px]'>{(Math.floor(movie.vote_average * 10)) / 10}</p>
                        </div>
                        <p style={{ fontSize: 11, marginBottom: 5 }}><Text text={`${movie.title}`} maxLine='1' /></p>
                      </div>
                    </Link>
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