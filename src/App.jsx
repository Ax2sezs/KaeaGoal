// src/App.js
import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
const Admin = lazy(() => import('./Components/Admin/Admin_Home'))
const AdminList = lazy(() => import('./Components/Admin/Admin_List'))
const UpdateMission = lazy(() => import('./Components/Admin/Admin_UpdateMission'))
const AdminMission = lazy(() => import('./Components/Admin/Admin_Mission'))
const AdminReward = lazy(() => import('./Components/Admin/Admin_Reward'))
const MyReward = lazy(() => import('./Components/Reward/MyReward'))
const AdminUserReward = lazy(() => import('./Components/Admin/Admin_User_Reward'))
const TabReward = lazy(() => import('./Components/Reward_Tab'))
const AllUser = lazy(() => import('./Components/Admin/Admin_All_User'))
const TestMission = lazy(() => import('./Components/Admin/Admin_Approve/Admin_ApproveMission'))
const Feed = lazy(() => import('./Components/Feed_User'))
const Banner = lazy(() => import('./Components/Admin/BannerManage'))
const Register = lazy(() => import('./Components/Register'))

function App() {
  const location = useLocation(); // Get the current route

  // Render Sidebar and Header conditionally
  const isAuthPage = location.pathname === '/' || location.pathname === '/register';
  const isHeaderVisible = !isAuthPage;
  const isSidebarVisible = !isAuthPage;

  // Determine layout styles based on route
  const layoutStyles = isAuthPage ? '' : 'min-h-screen bg-layer-background mt-16 sm:ml-64';
  const loginlayout = isAuthPage ? '' : 'p-1';
  const pdlayout = isAuthPage ? '' : 'flex flex-col lg:flex-row justify-center items-center bg-layer-background p-2';


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
                    <Route path='/rewardtab' element={<PrivateRoute><TabReward /></PrivateRoute>} />
                    <Route path='/myreward' element={<PrivateRoute><MyReward /></PrivateRoute>} />
                    <Route path='/feed' element={<PrivateRoute><Feed /></PrivateRoute>} />

                    <Route path='/f47ac10b-58cc-4372-a567-0e02b2c3d479' element={<PrivateRoute><Admin /></PrivateRoute>} />
                    <Route path='/7c1e2a69-9d3b-4d4e-97a2-5b5f3a5eabc7' element={<PrivateRoute><AdminList /></PrivateRoute>} />
                    {/* <Route path='/b18c4f56-7a2f-4e77-9a33-4e9b0d2b9f19' element={<PrivateRoute><AdminMission/></PrivateRoute>}/> */}
                    <Route path='/a6c3d8f1-23eb-4c7d-98ba-123d8ef9a12c' element={<PrivateRoute><UpdateMission /></PrivateRoute>} />
                    <Route path='/ea932c1a-b3d5-48d2-91c4-f9b23e7aebc2' element={<PrivateRoute><AdminReward /></PrivateRoute>} />
                    <Route path='/d72a1b4f-91e3-4c8b-843f-5b1a8d7e9c23' element={<PrivateRoute><AdminUserReward /></PrivateRoute>} />
                    <Route path='/c3a9d8e7-1b2f-4c7e-92a1-7d8c9b3e1a2f' element={<PrivateRoute><AllUser /></PrivateRoute>} />
                    <Route path='/b18c4f56-7a2f-4e77-9a33-4e9b0d2b9f19' element={<PrivateRoute><TestMission /></PrivateRoute>} />
                    <Route path='/b18c4f56-7a2f-54td-9a33-4e9b0d2b9f19' element={<PrivateRoute><Banner /></PrivateRoute>} />
                    {/* <Route path='/register' element={<Register/>}/>
                    <Route path='/test' element={<Test/>}/> */}
                    <Route path="*" element={<Navigate to="/" />} />

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