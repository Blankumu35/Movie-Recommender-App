import './Navbar.css';
import { FaHome, FaUser } from 'react-icons/fa';
import { FiFilm } from 'react-icons/fi';
import { BiShow } from 'react-icons/bi';
import { BsList } from 'react-icons/bs';
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Navbar = () => {
    const [user] = useAuthState(auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

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
                    <li className='user-icon'>
                        <div onClick={toggleDropdown}>
                            <FaUser />
                        </div>
                        {dropdownOpen && (
                            <div className="relative inline-block">
                                <div className="absolute top-7 -right-16 w-40 bg-white shadow-lg z-10 p-4 text-center">
                                    <p className="mb-2 text-black">{user.displayName}</p>
                                    <button className="w-full py-2 mt-2 bg-blue-500 text-white hover:bg-blue-700 border-none cursor-pointer">
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ) : (
                    <li>
                        <Link to='/login' state={{ from: location.pathname }}>
                            Login <FaUser />
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Navbar;