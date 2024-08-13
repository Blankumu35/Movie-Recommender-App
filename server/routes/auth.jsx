const express = require('express');
const router = express.Router();
const User = require('../models/User');

// User signup route
const authRouter = router.post('/signup', async (req, res) => {
  const { userId, firstName, lastName, email, photoURL, profilePicColor, signInMethod } = req.body;

  try {
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, firstName, lastName, email, photoURL, profilePicColor, signInMethod, likedItems: [] });
      await user.save();
      res.status(201).send('User created successfully');
    } else {
      res.status(400).send('User already exists');
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = authRouter;