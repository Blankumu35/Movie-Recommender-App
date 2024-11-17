const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    photoURL: {
        type: String,
        default: ''
    },
    profilePicColor: {
        type: String,
        default: ''
    },
    signInMethod: {
        type: String,
        required: true
    },
    likedItems: [
    {
      required:true,
      movies: [{movieId: String}],
      shows: [{showId: String}],
      people: [{personId: String}],
    },
  ],
  bookmarkedItems: [
     {
      movies: [{movieId: String}],
      shows: [{showId: String}],
     }
    ],
});

module.exports = mongoose.model('User', userSchema);


