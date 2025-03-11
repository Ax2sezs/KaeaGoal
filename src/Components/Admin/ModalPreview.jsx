import React from 'react';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';



const ModalPreview = ({ isOpen, onClose, mission }) => {
    if (!mission) return null; // If no mission is selected, don't render the modal

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box bg-bg">
                <h3 className="text-2xl font-bold mb-4 text-button-text">Mission Preview</h3>

                {/* Mission Image */}
                <div
                    className={`relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg transition-transform duration-300 ease-in-out ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                >
                    <div className="relative w-full h-48 rounded-t-2xl overflow-hidden flex group">
                        <img
                            src={mission.missionImages[0] || 'fallback-image.jpg'}
                            alt={mission.mission_NAME}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                        <span className="flex flex-row text-sm justify-center items-center gap-2 text-green-600 font-bold bg-bg rounded-badge px-2 py-1">
                            <img
                                src="./1.png"
                                alt="Coin Icon"
                                className="w-5 h-5"
                            />
                            {mission.mission_Point} Pts
                        </span>
                    </div>
                    {mission.is_Limited && (
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="flex flex-row text-sm justify-center items-center gap-2 text-red-600 font-bold bg-bg rounded-badge px-2 py-1">
                                <WorkspacePremiumIcon /> Limited !
                            </span>
                        </div>
                    )}
                    <div className='absolute bottom-20 right-2 flex items-center'>
                        <span className="flex flex-row text-sm justify-center items-center gap-2 text-green-600 bg-bg rounded-badge px-2 py-1">
                            <GroupIcon /> {mission?.current_Accept}/{mission?.accept_limit}
                        </span>
                    </div>
                    <div className="p-2 w-full flex flex-row justify-between">
                        <div className='flex flex-col'>
                            <h2 className="text-lg text-black font-bold truncate text-left">Mission: {mission.missioN_NAME}</h2>
                            <p className="text-sm truncate w-52 text-left text-button-text">Description: {mission.description}</p>
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-lg text-button-text'>Type: {mission.missioN_TYPE}</p>

                            <div className="text-button-text text-sm">
                                Expire: {new Date(mission.expire_Date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Close Button */}
                <div className="modal-action">
                    <button className="btn btn-primary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ModalPreview;
