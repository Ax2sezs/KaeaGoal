import React, { useState, useEffect } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function MyReward() {
    const { user } = useAuth();
    const { userReward = [], error, isLoading, fetchUserRewards } = useFetchData(user?.token || '');
    const [expandedIndex, setExpandedIndex] = useState(null);
    
    useEffect(() => {
        if (user?.token) {
            fetchUserRewards();
        }
    }, [user?.token, fetchUserRewards]);

    const getStepClasses = (status, step) => {
        const statusMap = {
            Approve: 1,
            OnDelivery: 2,
            Delivered: 3,
        };
        return statusMap[status] >= step ? 'step step-warning' : 'step';
    };

    const getCurrentStepLabel = (status) => {
        const stepLabels = {
            Approve: 'Ordered',
            OnDelivery: 'On Delivery',
            Delivered: 'Delivered',
        };
        return stepLabels[status] || 'Redeemed';
    };
    return (
        <div className="p-2 bg-bg w-full rounded-2xl min-h-screen">
            {isLoading ? (
                <div className="text-center text-gray-500">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            ) : error ? (
                <p className="text-red-500">Error: {error.message || 'An error occurred'}</p>
            ) : userReward.length === 0 ? (
                <p className='text-center'>No rewards found</p>
            ) : (
                <div className="p-2 bg-layer-background rounded-xl w-full mb-16">
                    <div className="flex flex-col gap-4">
                        {userReward.map((item, index) => (
                            <div
                                key={index}
                                className="bg-bg rounded-xl shadow p-4 flex flex-col gap-4 hover:bg-zinc-100 transition-transform duration-300 ease-in-out cursor-pointer"
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {item.image && item.image.length > 0 ? (
                                            <img
                                                src={item.image[0]}
                                                alt={item.reward_Name}
                                                className="w-12 h-12 object-cover rounded-full"
                                            />
                                        ) : (
                                            'No Image'
                                        )}
                                        <span className="font-semibold truncate w-28 text-button-text">{item.reward_Name}</span>
                                    </div>
                                    <ul className="hidden sm:steps steps-horizontal w-1/2">
                                        <li className='step step-warning'>Ordered <br></br>{item.redeem_Date ? new Date(item.redeem_Date).toLocaleDateString('th-TH') : 'N/A'}</li>
                                        <li className={getStepClasses(item.reward_Status, 2)}>On Delivery<br></br>{item.onDelivery_Date ? new Date(item.onDelivery_Date).toLocaleDateString('th-TH') : '-'}</li>
                                        <li className={getStepClasses(item.reward_Status, 3)}>Delivered<br></br>{item.delivered_Date ? new Date(item.delivered_Date).toLocaleDateString('th-TH') : '-'}</li>
                                    </ul>
                                    <div className="text-center">
                                        <div className='flex flex-col'>
                                            <p className='text-button-text font-bold'>{getCurrentStepLabel(item.reward_Status)}</p>
                                            <div className='flex flex-row justify-end gap-2'>
                                                <p className='text-yellow-500 font-bold'>{item.reward_Price.toLocaleString()}</p>
                                                <img src='./1.png' className='w-5 h-5' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {expandedIndex === index && (
                                    <div className="bg-gray-100 mt-4 p-4 rounded-xl">
                                        <strong className='text-button-text'>Detailed Steps:</strong>
                                        <div className="text-xs sm:text-sm text-gray-700">
                                            <ul className="steps steps-horizontal w-full sm:hidden">
                                                <li className='step step-warning'>Ordered <br></br>{item.redeem_Date ? new Date(item.redeem_Date).toLocaleDateString('th-TH') : 'N/A'}</li>
                                                <li className={getStepClasses(item.reward_Status, 2)}>On Delivery<br></br>{item.onDelivery_Date ? new Date(item.onDelivery_Date).toLocaleDateString('th-TH') : '-'}</li>
                                                <li className={getStepClasses(item.reward_Status, 3)}>Delivered<br></br>{item.delivered_Date ? new Date(item.delivered_Date).toLocaleDateString('th-TH') : '-'}</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyReward;
