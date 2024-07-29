import './Navbar.css';
import { FaHome, FaUser } from 'react-icons/fa';
import { FiFilm } from 'react-icons/fi';
import { BiLike, BiShow } from 'react-icons/bi';
import { BsList } from 'react-icons/bs';
import React, { useState } from 'react';
import { SignInMethod, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ProfilePicture from '../ProfilePic/ProfilePicture';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';


const Navbar = () => {
    const [user] = useAuthState(auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

      useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setProfile(userDoc.data());
        console.log(SignInMethod)
      };
      fetchProfile();
    }
  }, [user]);

    const logout = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <div className='navbar'>
            <div className='nav-brand'>
                <span className='name-text'>MoRe</span>
            </div>
            <ul className='nav-links'>
                <li>
                    <Link to='/'>
                        Home <FaHome />
                    </Link>
                </li>
                <li>
                    <Link to='/movies'>
                        Movies <FiFilm />
                    </Link>
                </li>
                <li>
                    <Link to='/tvshows'>
                        TV Shows <BiShow />
                    </Link>
                </li>
                <li>
                    <Link to='/watchlist'>
                        WatchList <BsList />
                    </Link>
                </li>
                 {user ? (
          <div className="user-icon" onClick={toggleDropdown}>
            {user.providerData[0].providerId === 'google.com' ? (
              <li>
                <img src={`${user.photoURL}`} className='rounded-full flex items-center justify-center w-9 h-9'/>
              </li>
            ) : (
            <ProfilePicture firstName={profile?.firstName} lastName={profile?.lastName} color={profile?.profilePicColor} />
            )}
            
           {dropdownOpen && <div className="relative flex border-black-50">
          <div className="absolute right-0 mt-6 w-40 bg-white shadow-lg z-10 p-4 text-center border-black-50 rounded-lg items-center justify-center pointer-events-none	">
             <div className="px-10">
              {user.providerData[0].providerId === 'google.com' ? (
                <img src={`${user.photoURL}`} className='rounded-full flex items-center justify-center w-9 h-9'/>
            ) : (
            <ProfilePicture firstName={profile?.firstName} lastName={profile?.lastName} color={profile?.profilePicColor} />
            )}              
            </div>
             {user.providerData[0].providerId === 'google.com' ? (
              <p className='text-black text-center' >{user.displayName}</p>
            ) : (
              <p className='text-black text-center' >{`${profile?.firstName} ${profile?.lastName}`}</p>
            )}
              <p className='text-black mb-[40px] text-[10px] '>{user.email}</p>
              <p className='px-5 pointer-events-auto'><Link to='/likedItems'><BiLike style={{marginBottom:-19}}/>Likes</Link></p>
              <button onClick={logout} className='pointer-events-auto'>Logout</button>
            </div>
          </div>
            }
          </div>
        ) : (
          <li>
            <a href='/login'>
              Login <FaUser />
            </a>
          </li>
                )}
            </ul>
        </div>
    );
};

export default Navbar;