import React, { useState, useEffect, useRef } from 'react';
import { AcUnit, QrCode2, CropFree, SwapHoriz, LocalShipping, ReceiptLong } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from './APIManage/AuthContext';
import useFetchData from './APIManage/useFetchData';
import Mission_Main from './Mission_item/Mission_Main';
import Reward from './Reward/Reward';
import My_Leaderboard from './My_Leaderboard';

function Home() {
    const { user } = useAuth();
    const { missions=[], error, isLoading , fetchAllMissions} = useFetchData(user?.token);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
      useEffect(() => {
            if (user?.token) {
                fetchAllMissions();
            }
        }, [user?.token, fetchAllMissions]);

    // Filter only missions with images
    const missionsWithImages = missions.filter((mission) => mission.missionImages?.[0]);

    useEffect(() => {
        if (missionsWithImages.length > 0) {
            const interval = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % missionsWithImages.length);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [missionsWithImages]);


    // Functions for navigation
    const goToSlide = (index) => setActiveIndex(index);

    const handleButtonClick = (route) => {
        navigate(route);
    };

    const sidebarItems = [
        { label: 'Home', icon: <AcUnit />, route: '/home' },
        { label: 'Mission', icon: <ReceiptLong />, route: '/mission' },
        // { label: 'Wheel', icon: <CropFree />, route: '/wheel' },
        { label: 'Transfer', icon: <SwapHoriz />, route: '/kaecoin' },
        { label: 'My Reward', icon: <LocalShipping />, route: '/myreward' },
    ];

    return (
        <div className="min-h-screen w-full bg-bg rounded-2xl overflow-hidden">
            <div className="p-3">
                <div className="w-full max-h-full flex items-center justify-center bg-gray-300 rounded-2xl mb-5">
                    <img
                        src='./Urban Farming.jpg'
                        alt='No Mission'
                        className="w-full h-full object-cover rounded-2xl sm:w-full sm:h-[400px]"
                    />                            
                    </div>

                {/* <div className="carousel w-full overflow-hidden relative rounded-2xl">
                    <div
                        className="carousel-inner flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${activeIndex * 100}%)`,
                        }}
                    >
                        {missionsWithImages.length > 0 ? (
                            missionsWithImages.map((mission, index) => (
                                <div className="carousel-item max-h-[400px] flex-shrink-0">
                                    <img
                                        src={mission.missionImages[0]}
                                        alt={`Slide ${index + 1}`}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </div>

                            ))
                        ) : (
                            <div className="w-full max-h-full flex items-center justify-center bg-gray-300 rounded-2xl">
                                <img
                                    src='./wallpaper001.jpg'
                                    alt='No Mission'
                                    className="w-full h-full object-cover rounded-2xl"
                                />                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex w-full justify-center gap-2 py-2">
                    {missionsWithImages.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${activeIndex === index
                                ? 'bg-layer-item border-bg'
                                : 'bg-layer-background border-white hover:bg-bg hover:border-bg'
                                }`}
                        ></div>
                    ))}
                </div> */}
                {/* Sidebar */}
                {/* <div className="flex flex-row justify-around my-3">
                    {sidebarItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleButtonClick(item.route)}
                            className="flex flex-col items-center text-center group focus:outline-none"
                        >
                            <div className="w-11 h-11 rounded-2xl bg-layer-item hover:bg-heavy-color flex items-center justify-center text-white transition-all">
                                {item.icon}
                            </div>
                            <span className="text-xs mt-2 transition-all">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div> */}

                <div className='flex flex-row bg-transparent w-full h-24 rounded-2xl border-dashed border-4 p-2 items-center'>
                    {/* <div className='flex justify-center items-center rounded-2xl bg-button-text opacity-50 text-bg w-16 h-16 mr-4'>
                        <HistoryIcon />
                    </div>
                    <div className='grid grid-cols-3 gap-2 justify-center'>
                        <div className='w-11'>
                            <img src='src/assets/1.png' className='w-10 h-10' />
                        </div>
                        <div className='w-20'>
                            <div className='text-green-500'>
                                Received
                            </div>
                            <div className='text-xs'>
                                Mission : ABC
                            </div>
                        </div>
                        <div className='w-20 text-green-500'>+ 50 Pts</div>
                    </div> */}
                    <My_Leaderboard />

                </div>

                {/* New Mission Section */}
                <div className=" w-full h-auto rounded-2xl mt-4">
                    <span className='text-2xl text-layer-item font-bold'>NEW MISSION !</span>
                    {isLoading ? (
                        <div className="text-center text-gray-500">
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    ) : (
                        <Mission_Main />
                    )}
                </div>

                {/* Big Deal Section */}
                <div className="bg-layer-background w-full h-auto rounded-2xl p-3 mt-4">
                    <span className='text-2xl text-layer-item font-bold'>BIG DEAL !</span>
                    {isLoading ? (
                        <div className="text-center text-gray-500">
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    ) : (
                        <Reward />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
