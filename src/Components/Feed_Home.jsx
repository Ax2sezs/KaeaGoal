import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from './APIManage/useFetchData';
import { useAuth } from './APIManage/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

function Feed_Home() {
    const { user } = useAuth();
    const { fetchMissionFeed, isLoading, error } = useFetchData(user?.token);
    const [latestMissions, setLatestMissions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadLatest = async () => {
            const result = await fetchMissionFeed(1, 5, null, '', '');
            if (result?.data?.length > 0) {
                setLatestMissions(result.data);
            }
        };

        if (user?.token) {
            loadLatest();
        }
    }, [user?.token, fetchMissionFeed]);

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500 text-center">Error: {error}</p>;
    }

    if (latestMissions.length === 0) {
        return <p className="text-center text-gray-400">No missions available</p>;
    }

    return (
        <div className="bg-bg w-40 rounded-2xl p-4">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={false}
                className="w-full"
            >
                {latestMissions.map((mission, index) => (
                    <SwiperSlide key={index}>
                        <div
                            onClick={() => navigate('/feed')}
                            className="bg-white border-2 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer"
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <div className="w-10 h-10">
                                    <img
                                        src={mission.imageURL}
                                        className="object-cover h-full w-full rounded-full"
                                        alt="User"
                                    />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-button-text">
                                        {mission.display_NAME}
                                    </span>
                                    <p className="text-xs">{mission.missioN_NAME}</p>
                                </div>
                            </div>

                            <hr />

                            {mission.type === 'photo' && (
                                <img
                                    src={mission.contenT_URLS[0]}
                                    alt="Mission Photo"
                                    className="rounded-xl mt-2 object-cover h-60 w-full"
                                />
                            )}

                            {mission.type === 'video' && (
                                <video controls className="w-full rounded-xl mt-2 max-h-60">
                                    <source src={mission.contenT_URLS[0]} type="video/mp4" />
                                </video>
                            )}

                            {mission.type === 'text' && (
                                <p className="text-gray-700 mt-2">{mission.contenT_URLS[0]}</p>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Feed_Home;
