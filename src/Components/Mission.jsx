import React, { useState } from 'react';
import Mission_Main from './Mission_item/Mission_Main';
import Coin from './Mission_item/Mission_Complete';
import Mission_MyMission from './Mission_item/Mission_MyMission';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import { ListAltOutlined } from '@mui/icons-material';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

function Mission() {
    const [activeTab, setActiveTab] = useState('Mission');
    const [isTableLayout, setIsTableLayout] = useState(false);

    // Define tabs for the Mission section
    const tabs = [
        { id: 'Mission', label: 'Mission', component: <Mission_Main isTableLayout={isTableLayout} /> },
        { id: 'My Mission', label: 'My Mission', component: <Mission_MyMission isTableLayout={isTableLayout} /> },
        { id: 'Completed Mission', label: 'Completed', component: <Coin isTableLayout={isTableLayout} /> },
    ];

    return (
        <div className="bg-bg w-full min-h-screen rounded-2xl mb-16 sm:mb-0">
            <div className="absolute top-24 right-10">
                {/* <label className="swap swap-rotate">
                    <input
                        type="checkbox"
                        checked={isTableLayout}
                        onChange={() => setIsTableLayout(!isTableLayout)}
                        disabled
                    />
                    <WindowOutlinedIcon
                        alt="Grid Layout"
                        className={`swap-on h-6 w-6 transition-all duration-300 ease-in-out transform ${isTableLayout ? 'rotate-0 text-button-text' : 'rotate-180 text-gray-500'}`}
                    />
                    <FormatListBulletedOutlinedIcon
                        alt="List Layout"
                        className={`swap-off h-6 w-6 transition-all duration-300 ease-in-out transform ${isTableLayout ? 'rotate-180 text-gray-500' : 'rotate-0 text-button-text'}`}
                    />
                </label> */}

            </div>
            <div className='flex flex-row justify-between items-center'>
                <h1 className="text-2xl text-layer-item font-bold m-3">{activeTab}.</h1>
            </div>

            {/* Tabs Navigation (Sticky) */}
            <div className="sticky top-14 z-50 bg-transparent">
                <div className="flex justify-center items-center h-20 p-2">
                    <div className="join grid grid-cols-3 gap-0 justify-center items-center w-full lg:w-1/2">
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

export default Mission;

