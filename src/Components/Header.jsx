import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './APIManage/AuthContext'; // Assuming you have the AuthContext for user data
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook

function Header() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userDetails, coinDetails, error, fetchUserDetails, fetchCoinDetails } = useFetchData(user?.token); // Use custom hook

  const handleLogout = () => {
    logout();
    navigate('/');  // Navigate to home after logout
  };

  // Refetch on token change
  useEffect(() => {
    if (user?.token) {
      fetchUserDetails();
      fetchCoinDetails();
    }
  }, [user?.token, fetchUserDetails, fetchCoinDetails]);

  // Auto refetch coin details when balances change
  useEffect(() => {
    let interval;
    if (user?.token) {
      interval = setInterval(() => {
        if (
          userDetails &&
          coinDetails &&
          (userDetails.kaeaCoinBalance !== coinDetails.kaeaCoinBalance ||
            userDetails.thankCoinConvert !== coinDetails.thankCoinConvert)
        ) {
          fetchCoinDetails(); // Refetch only coin details
        }
      }, 5000); // Check every 5 seconds
    }

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [
    user?.token,
    userDetails?.kaeaCoinBalance,
    userDetails?.thankCoinBalance,
    coinDetails?.kaeaCoinBalance,
    coinDetails?.thankCoinBalance,
    fetchCoinDetails
  ]);


  if (isLoading) {
    return (
      <div className="text-center text-gray-500">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full rounded-b-lg sm:w-[calc(100%-16rem)] sm:ml-64 z-50 flex flex-row items-center justify-between p-3 bg-bg shadow-md">
      <div className="flex items-center gap-4">
        <div className="avatar hover:scale-105 transition-transform duration-300 ease-in-out">
          <Link to="/profile">
            <div className="ring-heavy-color ring-offset-bg w-10 sm:w-11 h-10 sm:h-11 rounded-full ring ring-offset-2 overflow-hidden">
              <img src={userDetails?.imageUrls||'au-logo.png'} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-button-text md:block w-32 truncate">
          {userDetails?.user_Name || 'Guest'}
        </h1>
      </div>
      <div className="flex items-center text-button-text gap-2 md:gap-6">
        <div className="flex items-center">
          <img src="./1.png" alt="Coin" className="w-5 md:w-6 sm:w-8" />
          <h1 className="text-sm md:text-base font-semibold ml-1">
            {coinDetails?.kaeaCoinBalance || 0}
          </h1>
        </div>
        <div className="flex items-center">
          <img src="./2.png" alt="Green Coin" className="w-5 md:w-6 sm:w-8" />
          <h1 className="text-sm md:text-base font-semibold ml-1">
            {coinDetails?.thankCoinConvert || 0}
          </h1>
        </div>
        <button onClick={handleLogout} className="py-2 px-4 bg-red-600 text-white font-semibold rounded-badge hover:bg-red-700 transition">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
