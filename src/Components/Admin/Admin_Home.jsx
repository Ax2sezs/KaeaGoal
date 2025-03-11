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
        { label: 'Get User', icon: <People />, route: '/alluser' },
        { label: 'Approve Mission', icon: <Article />, route: '/getmission' },
        { label: 'All Mission', icon: <Update />, route: '/updatemission' },
        // { label: 'Order', icon: <LocalShipping />, route: '/order' },
        { label: 'Reward', icon: <CardGiftcard />, route: '/admingetreward' },
        { label: 'Update Reward', icon: <Update />, route: '/adminreward' },
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
