import React, { useState, useEffect } from 'react';
import { useAuth } from '../APIManage/AuthContext'; // Assuming this is your custom hook/context
import useFetchData from '../APIManage/useFetchData'; // Import the merged custom hook
import MissionCard from './MissionCard'; // Import the MissionCard component
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';

function Mission_Main() {
  const { user } = useAuth();
  const { missions = [], error, isLoading, acceptMission } = useFetchData(user?.token);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalSuccess, setIsModalSuccess] = useState(false);

  useEffect(() => {
    const userId = user?.a_USER_ID || localStorage.getItem('a_USER_ID');
    if (!userId || userId === 'undefined') {
      console.error('a_USER_ID is undefined. Refreshing the page...');
      window.location.reload();
    }
  }, [missions, user]);

  const sortedMissions = missions
    .sort((a, b) => {
      const isFullA = a?.current_Accept >= a?.accept_limit;
      const isFullB = b?.current_Accept >= b?.accept_limit;

      if (isFullA && !isFullB) {
        return 1;
      }
      if (!isFullA && isFullB) {
        return -1;
      }
      return 0;
    });

  const handleButtonClick = (index) => {
    setSelectedIndex(index);
    setCurrentImageIndex(0);
    setIsModalSuccess(false);
    document.getElementById('my_modal_5').showModal();
  };

  const handleConfirm = async () => {
    if (selectedIndex === null) {
      console.log('No mission selected');
      return;
    }

    const missionId = missions[selectedIndex]?.missioN_ID;
    const userId = user?.a_USER_ID || localStorage.getItem('a_USER_ID');

    if (!missionId || !userId || userId === 'undefined') {
      console.error('Invalid mission or user data:', { missionId, userId });
      return;
    }

    try {
      console.log(`Attempting to accept mission with ID: ${missionId} and User ID: ${userId}`);
      await acceptMission(missionId, userId);
      setIsModalSuccess(true);
      setTimeout(() => {
        document.getElementById('my_modal_5').close();
        alert('Mission accepted successfully!');
      });
    } catch (err) {
      console.error('Failed to accept mission', err);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500">
      <span className="loading loading-dots loading-lg"></span>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handlePrevSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? sortedMissions[selectedIndex]?.missionImages.length - 1 : prevIndex - 1));
  };

  const handleNextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === sortedMissions[selectedIndex]?.missionImages.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    
    <div>
      <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-5 items-center p-3 h-auto bg-bg rounded-xl">
        {sortedMissions.map((item, index) => (
          <MissionCard key={index} item={item} onClick={() => handleButtonClick(index)} />
        ))}
      </div>

      {/* Modal for mission details */}
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box bg-bg text-button-text">
          {selectedIndex !== null && (
            <>
              <div className="relative w-full h-48 rounded-2xl">
                <img
                  src={sortedMissions[selectedIndex]?.missionImages[currentImageIndex] || 'fallback-image.jpg'}
                  alt="Slide"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button onClick={handlePrevSlide} aria-label="Previous Slide" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">
                  ◀
                </button>
                <button onClick={handleNextSlide} aria-label="Next Slide" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">
                  ▶
                </button>
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <h3 className="font-bold">Mission : {sortedMissions[selectedIndex]?.missioN_NAME}</h3>
                <p>Description : {sortedMissions[selectedIndex]?.description}</p>
              </div>
            </>
          )}

          <div className="flex justify-between mt-4">
            <div className="flex flex-col text-sm gap-2 text-green-500 sm:text-lg sm:flex-row sm:gap-5">
              <div className="flex flex-row gap-3">
                <img src="./1.png" alt="Coin Icon" className="w-6 h-6" />
                {sortedMissions[selectedIndex]?.mission_Point || 0} Pts
              </div>
              <div className="flex flex-row gap-3">
                <GroupIcon /> {sortedMissions[selectedIndex]?.current_Accept}/{sortedMissions[selectedIndex]?.accept_limit}
              </div>
            </div>
            <div>
              <button className="btn btn-success rounded-badge text-bg mr-2" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="btn btn-outline btn-error rounded-badge" onClick={() => document.getElementById('my_modal_5').close()}>
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
      
    </div>
  );
}

export default Mission_Main;
