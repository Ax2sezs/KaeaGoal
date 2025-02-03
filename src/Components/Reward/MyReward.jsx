import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function MyReward() {
    const { user } = useAuth();
    const { userReward = [], error, isLoading } = useFetchData(user?.token || '');
    const [expandedIndex, setExpandedIndex] = useState(null);

    const getStepClasses = (status, step) => {
        const statusMap = {
            Pending: 1,
            Approved: 2,
            Rejected: 3,
        };
        return statusMap[status] >= step ? 'step step-warning' : 'step';
    };

    const getCurrentStepLabel = (status) => {
        const stepLabels = {
            Pending: 'Pending',
            Approved: 'Confirmed',
            Rejected: 'On Delivery',
        };
        return stepLabels[status] || 'Redeemed';
    };

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
            {isLoading ? (
                <div className="text-center text-gray-500">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            ) : error ? (
                <p className="text-red-500">Error: {error.message || 'An error occurred'}</p>
            ) : userReward.length === 0 ? (
                <p>No rewards found</p>
            ) : (
                <div className="p-2 bg-layer-background rounded-xl w-full mb-16">
                    <div className="flex flex-col gap-4">
                        {userReward.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow p-4 flex flex-col gap-4"
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
                                        <span className="font-semibold truncate w-28">{item.reward_Name}</span>
                                    </div>
                                    <div className="text-center font-bold">
                                        <div className='flex flex-col'>
                                            <p>{getCurrentStepLabel(item.reward_Status)}</p>
                                            <p>
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                {expandedIndex === index && (
                                    <div className="bg-gray-100 mt-4 p-4 rounded-xl">
                                        <strong className='text-button-text'>Detailed Steps:</strong>
                                        <div className="text-xs sm:text-sm text-gray-700">
                                            <ul className="steps steps-vertical md:steps-horizontal md:w-full">
                                                <li className={getStepClasses(item.reward_Status, 1)}>Ordered</li>
                                                <li className={getStepClasses(item.reward_Status, 2)}>Confirmed</li>
                                                <li className={getStepClasses(item.reward_Status, 3)}>On Delivery</li>
                                            </ul>
                                            <div className="mt-4">
                                                <strong>Date:</strong> {item.redeem_Date ? new Date(item.redeem_Date).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div>
                                                <strong>Points:</strong> {item.reward_Price}
                                            </div>
                                            <div>
                                                <strong>Description:</strong> {item.reward_Description}
                                            </div>
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
