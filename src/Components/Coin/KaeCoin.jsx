import React, { useState } from 'react'
import GiveCoin from './GiveCoin';
import Convert from './Convert';
function KaeCoin() {
    const [activeTab, setActiveTab] = useState('give');

    return (

        <div className="w-full min-h-screen rounded-2xl p-3 mb-16 sm:mb-0 sm:p-4 bg-bg">

            <div className="flex flex-col justify-center items-center h-20">
                <div className="join grid grid-cols-2 w-full justify-center items-center lg:w-1/2 ">
                    <button
                        className={`join-item btn ${activeTab === 'give'
                            ? 'bg-layer-item border-hidden text-white hover:bg-heavy-color'
                            : 'border border-layer-item bg-transparent hover:bg-light-color hover:border-transparent hover:text-gray-600'} rounded-full`}
                        onClick={() => setActiveTab('give')}
                    >
                        Give Thanks Coin
                    </button>
                    <button
                        className={`join-item btn ${activeTab === 'convert' ? 'bg-layer-item border-hidden text-white hover:bg-heavy-color' : 'border border-layer-item bg-transparent hover:bg-light-color hover:border-transparent hover:text-gray-600'
                            } rounded-full`}
                        onClick={() => setActiveTab('convert')}
                    >
                        Convert Coin
                    </button>
                </div>
            </div>
            {activeTab === 'give' && <GiveCoin />}
            {activeTab === 'convert' && <Convert />}
        </div>

    )
}

export default KaeCoin