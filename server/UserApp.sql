CREATE DATABASE UserApp;

USE UserApp;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Movies Table
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- Shows Table
CREATE TABLE shows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- People Table
CREATE TABLE people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT
);

-- Likes Table for Movies
CREATE TABLE user_liked_movies (
    user_id INT,
    movie_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    PRIMARY KEY (user_id, movie_id)
);

-- Likes Table for Shows
CREATE TABLE user_liked_shows (
    user_id INT,
    show_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id),
    PRIMARY KEY (user_id, show_id)
);

-- Likes Table for People
CREATE TABLE user_liked_people (
    user_id INT,
    person_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (person_id) REFERENCES people(id),
    PRIMARY KEY (user_id, person_id)
);

-- Bookmarks Table for Movies and Shows
CREATE TABLE user_bookmarks (
    user_id INT,
    content_type ENUM('movie', 'show'),
    content_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (user_id, content_type, content_id)
);