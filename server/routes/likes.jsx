const express = require('express');
const likesRouter = express.Router();
const User = require('../models/User');

// Like route
likesRouter.post('/', async (req, res) => {
  const { userId, itemId, itemType } = req.body;

  try {
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, likedItems: [] });
    }

    if (user.likedItems.some(item => item.itemId === itemId && item.itemType === itemType)) {
      user.likedItems = user.likedItems.filter(item => !(item.itemId === itemId && item.itemType === itemType));
    } else {
      user.likedItems.push({ itemId, itemType });
    }

    await user.save();
    res.send(user.likedItems);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Get liked items route
likesRouter.get('/liked-items/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.send(user ? user.likedItems : []);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = likesRouter;