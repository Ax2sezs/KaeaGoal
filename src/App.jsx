// src/App.js
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import LandingPage from './Components/Login';
import '@fontsource/baloo-2'; // Defaults to weight 400
import PrivateRoute from './Components/APIManage/PrivateRoute';
import { AuthProvider } from './Components/APIManage/AuthContext';
import Test from './Components/Admin/Test';

// Lazy load components
const Profile = lazy(() => import('./Components/Profile'));
const Mission = lazy(() => import('./Components/Mission'));
const Home = lazy(() => import('./Components/Home'));
const Login = lazy(() => import('./Components/Login'));
const Give = lazy(() => import('./Components/Give'));
const Reward = lazy(() => import('./Components/Reward/Reward'));
const Leaderboard = lazy(() => import('./Components/Leaderboard'));
const Theme = lazy(() => import('./Components/Theme'));
const Food = lazy(() => import('./Components/Reward_item/Food'));
const Convert = lazy(() => import('./Components/Coin/Convert'));
const KaeCoin = lazy(() => import('./Components/Coin/KaeCoin'));
const QRCode = lazy(() => import('./Components/QRCode'));
const Mission_Main = lazy(() => import('./Components/Mission_item/Mission_Main'));
const Order = lazy(() => import('./Components/Profile/Order'));
const MyMission = lazy(() => import('./Components/Mission_item/Mission_MyMission'));
const Admin = lazy(()=>import('./Components/Admin/Admin_Home'))
const AdminList = lazy(()=>import('./Components/Admin/Admin_List'))
const UpdateMission = lazy(()=>import('./Components/Admin/Admin_UpdateMission'))
const AdminMission = lazy(()=>import('./Components/Admin/Admin_Mission'))
const AdminReward = lazy(()=>import('./Components/Admin/Admin_Reward'))
const MyReward = lazy(()=>import('./Components/Reward/MyReward'))
const AdminUserReward = lazy(()=>import('./Components/Admin/Admin_User_Reward'))
const TabReward = lazy(()=>import('./Components/Reward_Tab'))
const AllUser = lazy(()=>import('./Components/Admin/Admin_All_User'))



function App() {
  const location = useLocation(); // Get the current route

  // Render Sidebar and Header conditionally
  const isHeaderVisible = location.pathname !== '/' && location.pathname !== '/';
  const isSidebarVisible = location.pathname !== '/';

  // Determine layout styles based on route
  const layoutStyles = location.pathname === '/'
    ? '' // No margin for LandingPage
    : 'min-h-screen bg-layer-background mt-16 sm:ml-64';

  const loginlayout = location.pathname === '/' ? '' : 'p-1';
  const pdlayout = location.pathname === '/' ? ""
    : "flex flex-col lg:flex-row justify-center items-center bg-layer-background p-2";

  return (
    <div className="flex">
      {/* Conditionally render Sidebar */}
      {isSidebarVisible && <Sidebar />}

      <div className="flex-1">
        {/* Conditionally render the Header */}
        {isHeaderVisible && <Header />}

        {/* Uniform Layout for all pages */}
        <div className={layoutStyles}>
          <div className={loginlayout}>
            <div className={pdlayout}>
              <AuthProvider>
                <Suspense fallback={<div><span className="loading loading-dots loading-xl"></span></div>}>
                  <Routes location={location}>
                    {/* Public Route */}
                    <Route path="/" element={<Login />} />

                    {/* Private Routes */}
                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/mission" element={<PrivateRoute><Mission /></PrivateRoute>} />
                    <Route path="/mission_main" element={<PrivateRoute><Mission_Main /></PrivateRoute>} />
                    <Route path="/reward" element={<PrivateRoute><Reward /></PrivateRoute>} />
                    <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
                    <Route path="/theme" element={<PrivateRoute><Theme /></PrivateRoute>} />
                    <Route path="/food" element={<PrivateRoute><Food /></PrivateRoute>} />
                    <Route path="/convert" element={<PrivateRoute><Convert /></PrivateRoute>} />
                    <Route path="/kaecoin" element={<PrivateRoute><KaeCoin /></PrivateRoute>} />
                    <Route path="/give" element={<PrivateRoute><Give /></PrivateRoute>} />
                    <Route path="/qr" element={<PrivateRoute><QRCode /></PrivateRoute>} />
                    <Route path="/order" element={<PrivateRoute><Order /></PrivateRoute>} />
                    <Route path="/mymission" element={<PrivateRoute><MyMission /></PrivateRoute>} />
                    <Route path='/admin' element={<PrivateRoute><Admin/></PrivateRoute>}/>
                    <Route path='/admin_list' element={<PrivateRoute><AdminList/></PrivateRoute>}/>
                    <Route path='/getmission' element={<PrivateRoute><AdminMission/></PrivateRoute>}/>
                    <Route path='/updatemission' element={<PrivateRoute><UpdateMission/></PrivateRoute>}/>
                    <Route path='/adminreward' element={<PrivateRoute><AdminReward/></PrivateRoute>}/>
                    <Route path='/myreward' element={<PrivateRoute><MyReward/></PrivateRoute>}/>
                    <Route path='/admingetreward' element={<PrivateRoute><AdminUserReward/></PrivateRoute>}/>
                    <Route path='/rewardtab' element={<PrivateRoute><TabReward/></PrivateRoute>}/>
                    <Route path='/alluser' element={<PrivateRoute><AllUser/></PrivateRoute>}/>
                    <Route path='/test' element={<Test/>}/>

                  </Routes>
                </Suspense>
              </AuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
