const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require("./routes/auth");
const likesRoutes = require("./routes/likes");
const cors = require('cors'); // to handle cross-origin requests
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://blankumu35:Xwrm8634@cluster0.df3styg.mongodb.net/Users');

app.use(bodyParser.json());
app.use(cors()); // to allow cross-origin requests


// Use routes
app.use('/auth', authRoutes);
app.use('/likes', likesRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});