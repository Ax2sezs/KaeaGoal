import React, { useState, useEffect, useRef } from 'react';
import { AcUnit, QrCode2, CropFree, SwapHoriz, LocalShipping } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from './APIManage/AuthContext'; 
import useFetchData from './APIManage/useFetchData';
import Mission_Main from './Mission_item/Mission_Main';
import Reward from './Reward/Reward';

function Home() {
    const { user } = useAuth();
    const { missions = [], error, isLoading, acceptMission } = useFetchData(user?.token);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const img = [
        'src/assets/ms.jpg',
        'src/assets/poster.jpg',
        'src/assets/ms.jpg',
        'src/assets/durian.jpg',
    ];

    const sidebarItems = [
        { label: 'Home', icon: <AcUnit />, route: '/' },
        { label: 'QRCode', icon: <QrCode2 />, route: '/qr' },
        { label: 'Wheel', icon: <CropFree />, route: '/wheel' },
        { label: 'Transfer', icon: <SwapHoriz />, route: '/kaecoin' },
        { label: 'My Reward', icon: <LocalShipping />, route: '/myreward' },
    ];

    const [activeIndex, setActiveIndex] = useState(0); 
    const carouselRef = useRef(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % img.length); // Loop the images
        }, 3000); 

        return () => clearInterval(interval);
    }, []);

    // Function to go to the next slide
    const nextSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % img.length);
    };

    // Function to go to the previous slide
    const prevSlide = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? img.length - 1 : prevIndex - 1));
    };

    // Function to go to a specific slide
    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    const handleButtonClick = (route) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen mb-16 w-full bg-bg rounded-2xl overflow-hidden">
            <div className="p-3">
                {/* Carousel */}
                <div className="carousel w-full overflow-hidden relative rounded-2xl">
                    <div
                        className="carousel-inner flex transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${(activeIndex * 100)}%)`,
                        }}
                    >
                        {img.map((url, index) => (
                            <div key={index} className="carousel-item w-full flex-shrink-0">
                                <img
                                    src={url}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-48 object-cover md:h-72"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex w-full justify-center gap-2 py-2">
                    {img.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${activeIndex === index
                                ? 'bg-layer-item border-bg'
                                : 'bg-layer-background border-white hover:bg-bg hover:border-bg'
                                }`}
                        ></div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="flex flex-row justify-around my-3">
                    {sidebarItems.map((item, box) => (
                        <button
                            key={box}
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
                </div>

                {/* History Section */}
                <div className='flex flex-row bg-transparent w-full h-24 rounded-2xl border-dashed border-4 p-2 items-center'>
                    <div className='flex justify-center items-center rounded-2xl bg-button-text opacity-50 text-bg w-16 h-16 mr-4'>
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
                    </div>
                </div>

                {/* New Mission Section */}
                <div className="bg-layer-background w-full h-auto rounded-2xl p-3 mt-4">
                    <span className='text-2xl text-layer-item font-bold'>NEW MISSION !</span>
                    {isLoading ? (
                        <div className="text-center text-gray-500">
                        <span className="loading loading-dots loading-lg"></span>
                      </div>
                    ) : (
                        <Mission_Main/>
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
                        <Reward/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
