import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './APIManage/AuthContext'; // Assuming you have the AuthContext for user data
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook

function Header() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { userDetails, coinDetails, error, refetch } = useFetchData(user?.token); // Use custom hook

  const handleLogout = () => {
    logout();
    navigate('/');  // Navigate to home after logout
  };

  // Refetch data whenever the token changes or user details change
  useEffect(() => {
    if (user?.token) {
      refetch();  // Trigger the refetch whenever the token or user details change
    }
  }, [user?.token, refetch]);

  // Optionally, set an interval to check and refetch every X minutes (if needed)
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.token) {
        refetch();  // Periodic refetch, e.g., every 5 minutes
      }
    }, 5 * 60 * 1000);  // 5 minutes interval, you can adjust as needed

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [user?.token, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <header className="fixed top-0 left-0 w-full rounded-b-lg sm:w-[calc(100%-16rem)] sm:ml-64 z-50 flex flex-row items-center justify-between p-3 bg-bg shadow-md">
      <div className="flex items-center gap-4">
        <div className="avatar hover:scale-105 transition-transform duration-300 ease-in-out">
          <Link to="/profile">
            <div className="ring-heavy-color ring-offset-base-100 w-10 sm:w-11 h-10 sm:h-11 rounded-full ring ring-offset-2 overflow-hidden">
              <img src={userDetails?.imageUrls} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
        <h1 className="text-lg sm:text-xl font-bold text-button-text md:block">
          {userDetails?.displayName || 'Guest'}
        </h1>
      </div>
      <div className="flex items-center text-button-text gap-2 md:gap-6">
        <div className="flex items-center">
          <img src="src/assets/1.png" alt="Coin" className="w-5 md:w-6 sm:w-8" />
          <h1 className="text-sm md:text-base font-semibold ml-1">
            {coinDetails?.kaeaCoinBalance || 0}
          </h1>
        </div>
        <div className="flex items-center">
          <img src="src/assets/2.png" alt="Green Coin" className="w-5 md:w-6 sm:w-8" />
          <h1 className="text-sm md:text-base font-semibold ml-1">
            {coinDetails?.thankCoinBalance || 0}
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
