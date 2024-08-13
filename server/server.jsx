const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For hashing passwords


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
      itemType: { type: String, enum: ['movie', 'show', 'person'], required: true },
      itemId: { type: Object, required: true },
    },
  ],
  bookmarkedItems: [
    {
      itemType: { type: String, enum: ['movie', 'show'], required: true },
      itemId: { type: Object, required: true },
    },
  ],
});

const User = mongoose.model('User', userSchema);


// Check if item is already liked or bookmarked
app.post('/is-liked', async (req, res) => {
  const { userId, itemId, itemType, like } = req.body;

  try {
    // Fetch the user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine the array to check based on whether we're looking for a liked or bookmarked item
    const itemsToCheck = like ? user.likedItems : user.bookmarkedItems;

    // Convert itemId to string for comparison
    const isLiked = itemsToCheck.some(item => 
      item.itemType === itemType && JSON.stringify(item.itemId) === JSON.stringify(itemId)
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
          (item) => {item.itemType !== 'movie' || item.itemId !== itemId}
        );
      } else if (itemType === 'show') {
        user.bookmarkedItems = user.bookmarkedItems.filter(
          (item) => {item.itemType !== 'show' || item.itemId !== itemId}
        );
      }
    } else {
      // Removing from likedItems

      if (itemType === 'movie') {
        user.likedItems = user.likedItems.filter(
          (item) => {item.itemType !== 'movie' || item.itemId !== itemId}
        );
      } else if (itemType === 'show') {
        user.likedItems = user.likedItems.filter(
          (item) => {item.itemType !== 'show' || item.itemId !== itemId}
        );
      } else if (itemType === 'person') {
        user.likedItems = user.likedItems.filter(
          (item) => {item.itemType !== 'person' || item.itemId !== itemId}
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