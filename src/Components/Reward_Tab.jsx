import React, { useState } from 'react';
import Reward from './Reward/Reward'
import MyReward from './Reward/MyReward';

function Reward_Tab() {
    const [activeTab, setActiveTab] = useState('Reward');
    const [isTableLayout, setIsTableLayout] = useState(false);

    // Define tabs for the Mission section
    const tabs = [
        { id: 'Reward', label: 'Reward', component: <Reward isTableLayout={isTableLayout} /> },
        { id: 'My Reward', label: 'My Reward', component: <MyReward isTableLayout={isTableLayout} /> },
    ];

    return (
        <div className="bg-bg w-full min-h-screen rounded-2xl mb-16 sm:mb-0">
            <h1 className="text-2xl text-layer-item font-bold m-3">{activeTab}.</h1>

            {/* Tabs Navigation (Sticky) */}
            <div className="sticky top-14 z-50 bg-transparent">
                <div className="flex justify-center items-center h-20 p-2">
                    <div className="join grid grid-cols-2 gap-0 justify-center items-center w-full lg:w-1/2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`join-item btn ${activeTab === tab.id
                                        ? 'bg-layer-item border-hidden text-white hover:bg-heavy-color'
                                        : 'border border-layer-item bg-bg hover:bg-light-color hover:border-transparent hover:text-gray-600'
                                    } rounded-full p-3`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <p className="text-sm md:text-lg">{tab.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div>{tabs.find((tab) => tab.id === activeTab)?.component}</div>
        </div>
    );
}

export default Reward_Tab;

