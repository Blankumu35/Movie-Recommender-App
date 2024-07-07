import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY; 
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL; 



  const fetchMovieData = {data: "", totalPages: 1, imageURL: IMAGE_BASE_URL} 

export const fetchMovies = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: page
      }
    });
    fetchMovieData.data = response.data.results;
    fetchMovieData.totalPages = response.data.total_pages;
  } catch (error) {
    console.error('Error fetching movies:', error);
    fetchMovieData.data = [];
    fetchMovieData.totalPages = 1;
  }

  return fetchMovieData;
};

const fetchShowData = { data: "", totalPages: 1 };

export const fetchShows = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/tv`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: page,
      },
    });
    fetchShowData.data = response.data.results;
    fetchShowData.totalPages = response.data.total_pages;
    return fetchShowData;
  } catch (error) {
    console.error('Error fetching shows:', error);
    fetchShowData.data = [];
    fetchShowData.totalPages = 1;
    return fetchShowData; 
  }
};
   