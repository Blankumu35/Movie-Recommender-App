const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  firstName: String,
  lastName: String,
  displayName: String,
  email: String,
  photoURL: String,
  signInMethod: String,
  likedItems: [
    {
      itemId: String,
      itemType: String,
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;