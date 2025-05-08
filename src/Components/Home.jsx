import React, { useState, useEffect } from 'react';
import { AcUnit, SwapHoriz, LocalShipping, ReceiptLong } from '@mui/icons-material';
import { useAuth } from './APIManage/AuthContext';
import useFetchData from './APIManage/useFetchData';
import Mission_Main from './Mission_item/Mission_Main';
import Reward from './Reward/Reward';
import My_Leaderboard from './My_Leaderboard';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

function Home() {
    const { user } = useAuth();
    const { fetchBanners, isLoading } = useFetchData(user?.token);
    const [banners, setBanners] = useState([]);

    // Fetch banners data
    useEffect(() => {
        const loadBanners = async () => {
            try {
                const fetchedBanners = await fetchBanners();
                // กรองเฉพาะ banners ที่มี filePath เท่านั้น
                const validBanners = fetchedBanners.filter(banner => banner.filePath);
                setBanners(validBanners);
            } catch (err) {
                console.error('Failed to fetch banners', err);
            }
        };

        loadBanners();
    }, [fetchBanners]);

    return (
        <div className="h-full w-full bg-bg rounded-2xl overflow-hidden">
            <div className="p-3">
                {/* Banner Section */}
                {banners.length === 0 ? (
                    <div className="w-full max-h-full flex items-center justify-center bg-gray-300 rounded-2xl mb-5 ">
                        <img
                            src="./Wallpaper1.jpg" // ใช้ path นี้ถ้าไม่พบ Banner
                            alt="No Banner"
                            className="w-full sm:h-[400px] object-cover rounded-2xl"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 w-full max-h-full mb-5">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            loop={true}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            navigation={true}
                            pagination={{ clickable: true }}
                            className="rounded-2xl w-full h-60 sm:h-[400px]"
                            observer={true}
                            observeParents={true}
                            style={{
                                "--swiper-navigation-color": "white",  // เปลี่ยนสีลูกศร
                                "--swiper-pagination-color": "white",  // เปลี่ยนสี pagination dots
                                "--swiper-pagination-bullet-active-color": "white", // เปลี่ยนสี dot เมื่อ active
                            }}
                        >
                            {banners.map((banner, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={banner.filePath}
                                        alt={`Banner ${index + 1}`}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}

                {/* Other sections (Leaderboard, Missions, etc.) */}
                <div className="flex flex-row bg-transparent w-full h-24 rounded-2xl border-dashed border-4 p-2 items-center">
                    <My_Leaderboard />
                </div>

                <div className="w-full h-auto rounded-2xl mt-4">
                    <span className='text-2xl text-layer-item font-bold'>NEW MISSION !</span>
                    {isLoading ? (
                        <div className="text-center text-gray-500">
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    ) : (
                        <Mission_Main />
                    )}
                </div>

                <hr className="my-5" />

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
    );
}

export default Home;
