const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Adjust the path to your User model

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists in our db
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
        // User already exists
        return done(null, existingUser);
    }

    // If user doesn't exist, create a new user
    const newUser = new User({
        userId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        photoURL:'',
        signInMethod: 'google.com', // Add your color logic here
    });
    await newUser.save();
    done(null, newUser);
}));

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

module.exports = passport;