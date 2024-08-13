import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePicture = () => {
    const [userId, setUserId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [color, setColor] = useState('#ff0');


    useEffect(() => {
        const storedUserId = localStorage.getItem('ID');
        if (storedUserId) {
            setUserId(storedUserId);
            console.log('User ID retrieved from localStorage:', storedUserId);
        } else {
            console.log('No User ID found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/auth/user/${userId}`);
                    console.log('User data retrieved:', response.data);
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setEmail(response.data.email);
                    setColor(response.data.color);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        } else {
            console.log('userId is null or undefined');
        }
    }, [userId]);

    const getInitials = (name) => (name && name.length > 0 ? name[0] : '');
    const initials = `${getInitials(firstName)}${getInitials(lastName)}`;

    return (
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
        >
            <span className="text-black text-lg font-bold">{initials}</span>
        </div>
    );
};

export default ProfilePicture;