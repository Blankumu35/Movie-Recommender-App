import './Navbar.css';
import { FaHome, FaUser } from 'react-icons/fa';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { FiFilm } from 'react-icons/fi';
import { BiLike, BiShow } from 'react-icons/bi';
import { BsList } from 'react-icons/bs';
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, Link } from 'react-router-dom';
import ProfilePicture from '../ProfilePic/ProfilePicture';
import { doc, getDoc } from 'firebase/firestore';
import { SearchComponent } from '../SearchBar/SearchBar';
import axios from 'axios';

const Navbar = () => {
  const [user] = useAuthState(auth); // Firebase user
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [color, setColor] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  // Fetch userId from localStorage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem('ID');
    if (storedUserId) {
      setUserId(storedUserId);
      console.log('User ID retrieved from localStorage:', storedUserId);
    } else {
      console.log('No User ID found in localStorage');
    }
  }, []);

  // Fetch user data when userId is available
  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/auth/user/${userId}`);
          console.log('User data retrieved:', response.data);
          setFirstName(response.data.firstName);
          setLastName(response.data.lastName);
          setEmail(response.data.email);
          setColor(response.data.profilePicColor);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  // Fetch profile data from Firebase for Google user
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setProfile(userDoc.data());
      };
      fetchProfile();
    }
  }, [user]);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('ID');
    localStorage.removeItem('name');
    localStorage.removeItem('profile Picture');
    localStorage.removeItem('email');

    if(userId){
      setUserId(null)
    }
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const searchData = await searchItems(searchQuery);
      setResults(searchData.results);
      setTotalPages(searchData.total_pages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching items:', error);
      setError('Failed to search items.');
    }
  };

  return (
    <>
      <nav className='navbar'>
        <div className='nav-brand items-center'>
          <div className='menu-toggle mr-2' onClick={toggleMenu}>
            <BsList className='text-[white] cursor-pointer' />
          </div>
          <span className='name-text'>MoRe</span>
        </div>

        {/* Centered Search Bar */}
        <div className='search-bar' style={{ display: 'flex' }}>
          <div className='hidden md:flex lg:flex'>
            <SearchComponent
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              handleSearchSubmit={handleSearchSubmit}
            />
          </div>
          <FaMagnifyingGlass className='md:hidden lg:hidden cursor-pointer' onClick={toggleSearch} />
        </div>

        <div className='user'>
          {user || userId ? (
            <div className='user-profile cursor-pointer' onClick={toggleDropdown}>
              {user && user.providerData[0].providerId === 'google.com' ? (
                <img src={user.photoURL} className='user-avatar cursor-pointer rounded-full flex items-center justify-center w-9 h-9' alt='Profile' />
              ) : (
                <ProfilePicture firstName={firstName} lastName={lastName} color={color} className='cursor-pointer' />
              )}
              {dropdownOpen && (
                <div className='dropdown-menu pointer-events-none bg-[grey] shadow-lg z-10 p-4 text-center border-black-50 rounded-lg items-center justify-center'>
                  <div className='dropdown-header flex-row justify-center items-center'>
                    {user && user.providerData[0].providerId === 'google.com' ? (
                      <img src={user.photoURL} className='rounded-full flex items-center justify-center w-9 h-9' alt='Profile' />
                    ) : (
                      <ProfilePicture firstName={firstName} lastName={lastName} color={color} />
                    )}
                    <p>{user ? user.displayName : `${firstName} ${lastName}`}</p>
                    <p>{user ? user.email : email}</p>
                  </div>
                  <div className='dropdown-links'>
                    <Link className='pointer-events-auto' to='/likedItems'><BiLike /> Likes</Link>
                    <button className='pointer-events-auto' onClick={logout}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login' className='login-button'>
              <FaUser className='mr-2' /> Login
            </Link>
          )}
        </div>

        {menuOpen && (
          <div className='dropdown-modal'>
            <div className='dropdown-content'>
              <Link to='/' onClick={toggleMenu}>
                <FaHome /> Home
              </Link>
              <Link to='/movies' onClick={toggleMenu}>
                <FiFilm /> Movies
              </Link>
              <Link to='/tvshows' onClick={toggleMenu}>
                <BiShow /> TV Shows
              </Link>
              <Link to='/watchlist' onClick={toggleMenu}>
                <BiLike /> WatchList
              </Link>
            </div>
          </div>
        )}
      </nav>

      {searchVisible && (
        <>
          <div className='search-overlay flex md:hidden lg:hidden' onClick={toggleSearch} />
          <div className='search-input-container flex md:hidden lg:hidden'>
            <SearchComponent
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              handleSearchSubmit={handleSearchSubmit}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;