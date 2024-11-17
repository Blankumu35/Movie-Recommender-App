import axios from 'axios';
import { useState } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY; 
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL; 



  const fetchMovieData = {data: "", totalPages: 1, imageURL: IMAGE_BASE_URL} 

export const fetchMovies = async (page, genre = '') => {
  try {
    const params = {
      api_key: API_KEY,
      language: 'en-US',
      page: page,
    };

    if (genre) {
      params.with_genres = genre;
    }

    const response = await axios.get(`${BASE_URL}/discover/movie`, { params });

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

export const fetchShows = async (page, genre = '') => {
  try {
    
    const params = {
        api_key: API_KEY,
        language: 'en-US',
        page: page,
      };
    if (genre) {
      params.with_genres = genre;
    }
    const response = await axios.get(`${BASE_URL}/discover/tv`, { params });
    fetchShowData.data = response.data.results;
    fetchShowData.totalPages = response.data.total_pages;
  } catch (error) {
    console.error('Error fetching shows:', error);
    fetchShowData.data = [];
    fetchShowData.totalPages = 1;
  }
    return fetchShowData; 
};

export const searchItems = async (query) => {
  const searchData = { results: [], total_pages: 1 };
  try {
    const response = await axios.get(`${BASE_URL}/search/multi`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        query: query,
      },
    });
    console.log(response.data);
    searchData.results = response.data.results;
    searchData.total_pages = response.data.total_pages;
  } catch (error) {
    console.error('Error searching items:', error);
    searchData.results = [];
    searchData.total_pages = 1;
  }

  return searchData;
};

export const fetchDetails = async (id) => {
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





