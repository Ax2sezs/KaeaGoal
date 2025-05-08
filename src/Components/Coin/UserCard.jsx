import React from 'react';

export const UserCard = ({ user, coinBalance, onClick }) => {
  const isDisabled = coinBalance === 0;
  
  return (
    <div
      className={`p-2 border-2 border-layer-item bg-bg shadow-md rounded-xl flex flex-col items-center w-40 transition-transform duration-300 ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
      }`}
      onClick={() => !isDisabled && onClick()}
    >
      <div className="relative w-20 h-20">
        <img
          src={user?.imageUrls || 'profile.png'}
          className="w-full h-full rounded-full object-cover"
          alt="User Profile"
        />
      </div>

      <div className="mt-3 text-center">
        <p className="text-button-text font-semibold text-sm w-40 truncate p-2">
          {user.displayName || 'Unknown'}
        </p>
        <p className="text-gray-600 text-sm">{user.department}</p>
      </div>
    </div>
  );
};