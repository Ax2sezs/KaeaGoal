import React from 'react';
import { useAuth } from '../APIManage/AuthContext';
import useFetchData from '../APIManage/useFetchData';
import { Article, CardGiftcard, Update, LocalShipping, People } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Admin_Home() {
    const { user } = useAuth(); // Access the user from AuthContext
    const { userDetails, error } = useFetchData(user?.token); // Use custom hook
    const navigate = useNavigate(); // Initialize useNavigate

    // Define sidebar items
    let sidebarItems = [
        { label: 'Get User', icon: <People />, route: '/c3a9d8e7-1b2f-4c7e-92a1-7d8c9b3e1a2f' },
        { label: 'Approve Mission', icon: <Article />, route: '/b18c4f56-7a2f-4e77-9a33-4e9b0d2b9f19' },
        { label: 'All Mission', icon: <Update />, route: '/a6c3d8f1-23eb-4c7d-98ba-123d8ef9a12c' },
        // { label: 'Order', icon: <LocalShipping />, route: '/order' },
        { label: 'Reward', icon: <CardGiftcard />, route: '/ea932c1a-b3d5-48d2-91c4-f9b23e7aebc2' },
        { label: 'Update Reward', icon: <Update />, route: '/d72a1b4f-91e3-4c8b-843f-5b1a8d7e9c23' },
        { label: 'Banner', icon: <Update />, route:'/b18c4f56-7a2f-54td-9a33-4e9b0d2b9f19'}
    ];

    // Filter sidebar items if isAdmin === 4
    // if (userDetails && userDetails.isAdmin === 4) {
    //     sidebarItems = sidebarItems.filter(item =>
    //         item.label === 'Approve Mission' || item.label === 'All Mission'
    //     );
    // }

    const handleButtonClick = (route) => {
        navigate(route); // Navigate to the specified route
    };

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen flex items-center justify-center">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {sidebarItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleButtonClick(item.route)}
                        className="flex flex-col items-center text-center group focus:outline-none"
                    >
                        <div className="flex flex-col rounded-2xl w-28 h-28 bg-layer-item hover:bg-heavy-color items-center justify-center text-white transition-all sm:w-56 sm:h-36">
                            <div>{item.icon}</div>
                            <span className="text-xs mt-2 transition-all sm:text-lg">
                                {item.label}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Admin_Home;
