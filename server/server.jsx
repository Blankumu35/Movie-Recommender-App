const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt'); // For hashing passwords
const { spawn } = require('child_process');
const { natural } = require('./node_modules/natural');
const { cosineSimilarity } = require('./node_modules/ml-distance');



const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://blankumu35:Xwrm8634@cluster0.df3styg.mongodb.net/Movie-App');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use(cors());

// Define Mongoose Schemas and Models

//User models
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  photoURL: String,
  profilePicColor: String,
  signInMethod: String,
  likedItems: [
    {
      itemType: { type: String, enum: ['movie', 'tv', 'person'], required: true },
      itemId: { type: Object, required: true },
    },
  ],
  bookmarkedItems: [
    {
      itemType: { type: String, enum: ['movie', 'tv'], required: true },
      itemId: { type: Object, required: true },
    },
  ],
});

const User = mongoose.model('User', userSchema);

const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genres: [String],
  _id:{ type: Number, required: true, unique: true },
  backdrop_path: String,
  poster_path: String,
  release_date: String,
  runtime: Number,
  vote_average: Number,
  movie_id: Number
});

const Movie = mongoose.model('Movie', MovieSchema);

const mediaSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  title: String,
  genres: [String],
  description: String,
  release_date: String,
  cast: [String],
  type: String, // 'movie' or 'tv'
});

const Media = mongoose.model('Media', mediaSchema);

// Check if item is already liked or bookmarked
app.post('/is-liked', async (req, res) => {
  const { userId, itemId, itemType, like } = req.body;

  try {
    // Fetch the user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
        console.log(like)

    // Determine the array to check based on whether we're looking for a liked or bookmarked item
    const itemsToCheck = like ? user.likedItems : user.bookmarkedItems;
    // Convert itemId to string for comparison
    const isLiked = itemsToCheck.some(item => 
  item.itemType === itemType && 
  (JSON.stringify(item.itemId.id) === JSON.stringify(itemId.id))
);


    // Respond with the like status
    res.status(200).json({ isLiked });
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/liked-items/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch the user by userId and retrieve their likedItems
    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse itemId strings into objects for each liked item
    const LikedItems = user.likedItems

    // Respond with the user's likedItems
    res.status(200).json({
      likedItems: LikedItems
    });
  } catch (error) {
    console.error('Error fetching liked items:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/bookmarked-items/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch the user by userId and retrieve their bookmarkedItems
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Parse itemId strings into objects for each bookmarked item
    const BookmarkedItems = user.bookmarkedItems

    // Respond with the user's bookmarkedItems
    res.status(200).json({
      bookmarkedItems: BookmarkedItems
    });
  } catch (error) {
    console.error('Error fetching bookmarked items:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Like or Bookmark items
app.post('/likes', async (req, res) => {
  const { userId, itemId, itemType, like } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Initialize likedItems and bookmarkedItems arrays if they are undefined
    if (!user.likedItems) user.likedItems = [];
    if (!user.bookmarkedItems) user.bookmarkedItems = [];

    if (!like) {
      // Handle Bookmarking
      const isBookmarked = user.bookmarkedItems.some(
        (item) => item.itemId === itemId && item.itemType === itemType
      );

      if (!isBookmarked) {
        user.bookmarkedItems.push({ itemId: itemId, itemType });
      }
    } else {
      // Handle Liking
      const isLiked = user.likedItems.some(
        (item) => item.itemId === itemId && item.itemType === itemType
      );

      if (!isLiked) {
        user.likedItems.push({ itemId: itemId, itemType });
      }
    }

    await user.save();
    res.status(201).send('Item liked/bookmarked successfully');
  } catch (error) {
    console.error('Error liking/bookmarking item:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/likes', async (req, res) => {
  try {
    const { userId, itemId, itemType, like } = req.body;

    const user = await User.findOne({ userId });
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!like) {
      // Removing from bookmarkedItems
      if (itemType === 'movie') {
        user.bookmarkedItems = user.bookmarkedItems.filter(
          (item) => item.itemType !== 'movie' || JSON.stringify(item.itemId.title) !== JSON.stringify(itemId.title)
        );
      } else if (itemType === 'tv') {
        user.bookmarkedItems = user.bookmarkedItems.filter(
          (item) => item.itemType !== 'tv' || JSON.stringify(item.itemId.name) !== JSON.stringify(itemId.name)
        );
      }
    } else {
      // Removing from likedItems

      if (itemType === 'movie') {
        user.likedItems = user.likedItems.filter(
          (item) => item.itemType !== 'movie' || JSON.stringify(item.itemId.title) !== JSON.stringify(itemId.title)
        );
      } else if (itemType === 'tv') {
        user.likedItems = user.likedItems.filter(
          (item) => item.itemType !== 'tv' || JSON.stringify(item.itemId.name) !== JSON.stringify(itemId.name)
        );
      } else if (itemType === 'person') {
        user.likedItems = user.likedItems.filter(
          (item) => item.itemType !== 'person' || JSON.stringify(item.itemId) !== JSON.stringify(itemId)
        );
      }
    }

    await user.save();
    res.status(200).send('Item unliked/bookmark removed successfully');
  } catch (error) {
    console.error('Error unliking/removing bookmark:', error);
    res.status(500).send('Internal Server Error');
  }
});

const API_KEY = '46c7619f12e41f8b0176f1e9999b9a39';
const BASE_URL = 'https://api.themoviedb.org/3';

/*const fetchAndStoreData = async () => {
  const movies = [];
  const tvShows = [];

  // Helper function to fetch and store a single item (movie or TV show)
  const fetchItem = async (id, type) => {
  try {
    // Fetch basic media details
    const response = await axios.get(`${BASE_URL}/${type}/${id}`, {
      params: { api_key: API_KEY, language: 'en-US' },
    });
    const data = response.data;

    if (data) {
      // Check if the media already exists in the database
      let mediaExists = await Media.findOne({ _id: data.id });

      // Fetch the cast information
      const response2 = await axios.get(`${BASE_URL}/${type}/${id}/credits`, {
        params: {
          api_key: API_KEY,
          language: 'en-US'
        }
      });

      const casting = response2.data.cast.map(cast => cast.name).filter(name => name); // Filter out empty names

      if (!mediaExists) {
        // Insert new media into the database if it doesn't exist
        const newMedia = new Media({
          _id: data.id,
          title: data.title || data.name, // title for movies, name for TV shows
          genres: data.genres.map((genre) => genre.name),
          description: data.overview,
          release_date: data.release_date || data.first_air_date,
          cast: casting, 
          type: type === 'movie' ? 'movie' : 'tv',
        });

        await newMedia.save();
        console.log(`${type === 'movie' ? 'Movie' : 'TV Show'} ${newMedia.title} added to the collection`);
      } else {
        // If media exists, update its cast (or other fields if necessary)
        mediaExists.cast = casting.length>0 ? casting : mediaExists.cast; // Only update if cast is non-empty
       // console.log(mediaExists.cast);
        await mediaExists.save();
        console.log(`Updated cast for: ${mediaExists.title}`);
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`${type} ID ${id} not found.`);
    } else {
      console.error('Error fetching details:', error);
    }
  }
};
for (let id = 1000000; id <= 1010000; id++) {
    var response = await fetchItem(id, 'movie');
      if(response === undefined){
        await fetchItem(id, 'tv');
      }
    // Optional: Implement a delay to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }


  // Fetch movies   71823
  for (let id = 0; id <= 1000000; id++) {
    var response = await fetchItem(id, 'movie');
      if(response === undefined){
        await fetchItem(id, 'tv');
      }
    // Optional: Implement a delay to avoid hitting API rate limits
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('Finished fetching and storing all data.');
};

// Call the function
fetchAndStoreData() */

app.post('/recommendations/:userId', async (req, res) => {
  try {
    // Find the user and populate likedItems with movie data
    const user = await User.findOne({ userId: req.params.userId })
      .populate('likedItems.itemId');

      if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Iterate over liked items
    for (const likedItem of user.likedItems) {
      if (likedItem.itemType === 'movie') {
        const movieId = likedItem.itemId.id;
        const movieTitle = likedItem.itemId.title;

        // Check if the movie already exists in the Movie collection
        const existingMovie = await Movie.findById(movieId);

        if (!existingMovie) {
          // Insert the liked movie into the Movie collection if it doesn't exist
          const newMovie = new Movie({
            _id: movieId, // Use the same _id from likedItems
            title: movieTitle, // Assuming title exists in likedItems
            genres: likedItem.itemId.genres.map(genre => genre.name), // Extract genre names
            description: likedItem.itemId.overview, // Assuming description exists in likedItems
            // Add other fields as necessary
          });

          await newMovie.save();
          console.log(`Movie ${newMovie.title} added to the Movie collection`);
        } else {
          console.log(`Movie ${existingMovie.title} already exists in the Movie collection`);
        }
      }
       if (likedItem.itemType === 'tv') {
        const showId = likedItem.itemId.id;
        const showTitle = likedItem.itemId.name;

        // Check if the movie already exists in the Movie collection
        const existingShow = await Movie.findById(showId);

        if (!existingShow) {
          // Insert the liked movie into the Movie collection if it doesn't exist
          const newMovie = new Movie({
            _id: showId, // Use the same _id from likedItems
            title: showTitle, // Assuming title exists in likedItems
            genres: likedItem.itemId.genres.map(genre => genre.name), // Extract genre names
            description: likedItem.itemId.overview, // Assuming description exists in likedItems
            // Add other fields as necessary
          });

          await newMovie.save();
          console.log(`Movie ${newMovie.title} added to the Movie collection`);
        } else {
          console.log(`Movie ${existingMovie.title} already exists in the Movie collection`);
        }
      }
    }

    // Fetch all movies from the database
    const allMovies = Media;

    // Log all movies (for debugging purposes)
    console.log(allMovies);

    // Filter liked items for movies only and get their IDs
    const likedMovies = user.likedItems
      .filter(item => item.itemType === 'movie')
      .map(item => item.itemId);

    // Combine features into a single string for each movie
    const movieFeatures = allMovies.map(movie => 
      `${movie.title} ${movie.genres.join(' ')} ${movie.description}`
    );

    const TfIdf = natural.TfIdf;
     // Initialize the TF-IDF vectorizer
    const tfidf = new TfIdf();

    // Add all movie features to the TF-IDF model
    movieFeatures.forEach(doc => tfidf.addDocument(doc));

    // Calculate the user profile as the mean vector of liked movies
    const userProfileVectors = likedMovies.map(likedMovie => {
      const index = allMovies.findIndex(movie => movie._id.equals(likedMovie._id));
      let movieVector = [];
      tfidf.listTerms(index).forEach(term => {
        movieVector.push(term.tfidf);
      });
      return movieVector;
    });

    // Calculate the mean vector (user profile)
    const userProfile = userProfileVectors[0].map((_, i) =>
      userProfileVectors.reduce((sum, vec) => sum + vec[i], 0) / userProfileVectors.length
    );

    // Calculate similarities between the user profile and all movies
    const cosineSimilarity = (vecA, vecB) => {
      const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
      const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
      const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };

    const recommendations = allMovies.map((movie, index) => {
      let movieVector = [];
      tfidf.listTerms(index).forEach(term => {
        movieVector.push(term.tfidf);
      });
      return {
        movie,
        score: cosineSimilarity(userProfile, movieVector)
      };
    });

    // Sort and filter the recommendations
    const filteredRecommendations = recommendations
      .filter(recommendation => !likedMovies.some(liked => liked._id.equals(recommendation.movie._id)))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Adjust the number of recommendations as needed

    res.json(filteredRecommendations);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ message: 'Error generating recommendations', error });
  }
});


app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) { // Compare hashed password
            res.status(200).json({firstName: user.firstName,lastName: user.lastName,Email: user.email,profilePicColor: user.profilePicColor ,  userId: user.userId}); // Send user ID in response
        } else {
            res.status(400).send('Invalid email or password');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


// Signup route
app.post('/auth/signup', async (req, res) => {
    const { userId, firstName, lastName, password, email, photoURL, profilePicColor, signInMethod } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password (assuming you're storing passwords securely)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        user = new User({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            photoURL,
            profilePicColor,
            signInMethod
        });

        // Save user to the database
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/auth/user/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (user) {
            res.status(200).json({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                color: user.profilePicColor
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/auth/google-login', async (req, res) => {
    
  const { displayName, email, photoURL, signInMethod, uid } = req.body;
  console.log(displayName,email)
  const fullName = displayName.split(' ')
    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
        await user.save();
        console.log(user)
        console.log(user.userId)
        res.status(200).json({ message: 'Google sign-in successful' });            
        }

    

        // Create new user
        user = new User({
            userId: uid,
            firstName: fullName[0],
            lastName: fullName[1],
            email,
            photoURL,
            signInMethod
        });

        // Save user to the database
        await user.save();
        localStorage.setItem('ID', user.userId)
        res.status(200).json({ message: 'Google sign-in successful' });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});