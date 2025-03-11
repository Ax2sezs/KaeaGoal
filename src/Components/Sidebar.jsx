import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Assignment, CardGiftcard, EmojiEvents, AccountCircle, AdminPanelSettings } from '@mui/icons-material';
import { useAuth } from './APIManage/AuthContext'; // Assuming you are using the AuthContext to manage login state
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook

function Sidebar() {
  const { user } = useAuth(); // Access the user from AuthContext
  const { userDetails, error } = useFetchData(user?.token); // Use custom hook
  const location = useLocation(); // Access current route's location

  // Sidebar items data with MUI icons
  const sidebarItems = [
    { label: 'Home', link: '/home', icon: <Home /> },
    { label: 'Mission', link: '/mission', icon: <Assignment /> },
    { label: 'Reward', link: '/rewardtab', icon: <CardGiftcard /> },
    { label: 'Ranking', link: '/leaderboard', icon: <EmojiEvents /> },
    { label: 'Profile', link: '/profile', icon: <AccountCircle /> },
  ];

if (userDetails && (userDetails?.isAdmin === 9 || userDetails?.isAdmin === 4)) {
  sidebarItems.push({
    label: 'Admin',
    link: '/admin',
    icon: <AdminPanelSettings />,
  });
}
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <div className="relative">
      {/* Sidebar */}
      <aside
        className="fixed bottom-0 sm:rounded-none sm:top-0 sm:bottom-auto sm:left-0 z-40 w-full sm:w-64 h-16 sm:h-screen bg-layer-item sm:bg-layer-item flex sm:flex-col items-center sm:items-start justify-around sm:justify-start sm:border-t-0 sm:border-r"
        aria-label="Sidebar"
      >
        {/* Logo Section */}
        <div className="hidden sm:flex items-center justify-center w-full bg-layer-item py-4 mb-5 mt-5">
          <h1 className="text-2xl font-bold text-white">KAEGoal</h1>
          <img src="./au-logo.png" className="w-15 h-12 mx-2" alt="KAEGoal Logo" />
        </div>

        {/* Menu Items */}
        <ul
          className={`flex sm:flex-col w-full justify-around px-3 sm:justify-start font-bold ${
            userDetails?.isAdmin === 9 ? 'gap-0' : 'gap-3'
          }`}
        >
          {sidebarItems.map((item, index) => (
            <li key={index} className="flex flex-col items-center w-16 mb-2 sm:block">
              <NavLink
                to={item.link}
                className={({ isActive }) => {
                  const isItemActive = isActive || (item.link === '/admin' && isAdminActive);
                  return `flex flex-col sm:flex-row items-center w-full p-3 transition-all transform ${
                    isItemActive
                      ? 'text-bg scale-110 sm:mx-2'
                      : 'hover:scale-105 text-heavy-color sm:mx-3'
                  }`;
                }}
              >
                <div
                  className={`text-3xl sm:text-lg transition-all ${
                    location.pathname === item.link || (item.link === '/admin' && isAdminActive)
                      ? 'text-bg'
                      : 'text-heavy-color group-hover:text-bg'
                  }`}
                >
                  {item.icon}
                </div>

                <span className="ms-0 text-xs sm:text-lg sm:block flex-1 sm:ms-3 whitespace-nowrap group-hover:text-bg">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export default Sidebar;
