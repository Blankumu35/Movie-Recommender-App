const MovieSchema = new mongoose.Schema({
  title: String,
  description: String,
  genres: [String],
  backdrop_path: String,
  poster_path: String,
  release_date: String,
  runtime: Number,
  vote_average: Number,
  movie_id: Number
});

module.exports = mongoose.model('Movie', MovieSchema);