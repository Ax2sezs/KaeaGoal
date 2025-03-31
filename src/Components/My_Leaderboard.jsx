import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './APIManage/AuthContext';
import useFetchData from './APIManage/useFetchData';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function My_Leaderboard() {
    const { user } = useAuth();
    const { myranking, error, isLoading, fetchMyLeaderboard } = useFetchData(user?.token);

    // Fetch data on component mount or when token changes
    useEffect(() => {
        if (user?.token) {
            fetchMyLeaderboard();
        }
    }, [user?.token, fetchMyLeaderboard]);

    // ตรวจสอบการโหลดข้อมูล
    if (isLoading) {
        return (
            <div className="text-center text-gray-500">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="flex flex-row justify-around items-center w-full">
            <span>Rank. <strong>#{myranking?.rank || '-'}</strong></span>
            <div>
                <img
                    src={myranking?.imageUrls || './profile.png'}
                    alt="User Avatar"
                    className='object-cover w-16 h-16 rounded-full border-4 p-1 border-layer-item'
                />
            </div>
            {/* <span>{myranking?.point || 0} Point.</span> */}
            <Link to="/leaderboard">
                <button className="border-hidden w-16 h-16 bg-layer-item text-bg rounded-2xl hover:bg-heavy-color text-xs flex flex-col items-center justify-center leading-none">
                    <EmojiEventsIcon className="mb-0.5" />
                    <span>Ranking</span>
                </button>

            </Link>
        </div>
    );
}

export default My_Leaderboard;