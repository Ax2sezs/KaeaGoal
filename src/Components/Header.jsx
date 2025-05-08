import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './APIManage/AuthContext'; // Assuming you have the AuthContext for user data
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook
import GroupsIcon from '@mui/icons-material/Groups'; 

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
              <img src={userDetails?.imageUrls || 'profile.png'} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
        <div className='flex flex-col'>
          <h1 className="text-sm sm:text-xl font-bold text-button-text md:block w-40 truncate">
            {userDetails?.displayName || 'Guest'}
          </h1>
          <div>
            <div className="flex items-center text-button-text gap-2 md:gap-6">
              <div className="flex items-center">
                <img src="./1.png" alt="Coin" className="w-5 md:w-6 sm:w-8" />
                <h1 className="text-sm md:text-base ml-1">
                  {coinDetails?.kaeaCoinBalance.toLocaleString() || 0}
                </h1>
              </div>
              <div className="flex items-center">
                <img src="./2.png" alt="Green Coin" className="w-5 md:w-6 sm:w-8" />
                <h1 className="text-sm md:text-base ml-1">
                  {coinDetails?.thankCoinConvert.toLocaleString() || 0}
                </h1>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center text-button-text gap-2 md:gap-6">
        {/* <div className="flex items-center">
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
        </div> */}
        <div className=''>
          <Link to='/feed'>
            <button className='btn btn-sm btn-success btn-outline'>
              <GroupsIcon /> Community</button>
          </Link>
        </div>
        {/* <div className='flex flex-row'>
          <Link to='/feed'>
            <button className='btn btn-success btn-outline rounded-badge btn-sm'><GroupsIcon /></button>
          </Link>

          <button onClick={handleLogout} className="btn btn-error rounded-badge btn-sm border-hidden">
            <LogoutIcon className='scale-75 text-bg' />
          </button>
        </div> */}
      </div>
    </header>
  );
}

export default Header;
