import React from 'react';

const ProfilePicture = ({ firstName = '', lastName = '', color = '#000' }) => {
  const getInitials = (name) => (name && name.length > 0 ? name[0] : '');

  const initials = `${getInitials(firstName)}${getInitials(lastName)}`;

  return (
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-lg font-bold">{initials}</span>
    </div>
  );
};

export default ProfilePicture;