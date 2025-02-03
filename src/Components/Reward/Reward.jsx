import React, { useState, useEffect } from 'react';
import { useAuth } from '../APIManage/AuthContext';
import useFetchData from '../APIManage/useFetchData';
import { LocalShippingOutlined } from '@mui/icons-material';

const RewardCard = ({ item, onClick }) => {
  const isOutOfStock = item?.reward_quantity === 0;

  return (
    <div
      className={`relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg ${isOutOfStock ? "" : "hover:scale-105 transition-transform duration-300 ease-in-out"}`}
      onClick={() => !isOutOfStock && onClick(item)}
    >
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center rounded-xl z-10">
          <span className="text-white font-bold text-lg">OUT OF STOCK</span>
        </div>
      )}

      <img
        src={item?.reward_Image[0]}
        alt={item?.reward_Name || ''}
        className="w-full h-32 sm:h-40 rounded-t-2xl object-cover"
      />

      <div className="p-2 w-full flex flex-row justify-between">
        <div className="flex flex-col w-full">
          <h2 className="text-lg text-black font-bold truncate text-left">
            {item?.reward_Name || 'N/A'}
          </h2>
          <div className="flex flex-row justify-between">
            <p className="text-lg text-button-text flex items-center gap-2">
              <LocalShippingOutlined className="" />
              {item?.reward_quantity || '0'}
            </p>
            <div className="flex flex-row gap-3">
              <img src="./1.png" alt="Coin Icon" className="w-6 h-6" />
              <p className="text-lg text-green-500 font-bold">{item?.reward_price || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Reward() {
  const { user } = useAuth();
  const { Reward = [], error, isLoading, acceptReward, refetch } = useFetchData(user?.token);
  const [selectedReward, setSelectedReward] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const userId = user?.a_USER_ID || localStorage.getItem('a_USER_ID');
    if (!userId || userId === 'undefined') {
      console.error('a_USER_ID is undefined. Refreshing the page...');
      window.location.reload();
    }
  }, [user]);

  const handleOpenModal = (reward) => {
    setSelectedReward(reward);
    document.getElementById('reward_modal').showModal();
    setCurrentImageIndex(0);
    setModalMessage('');
    setIsSuccess(false);
  };

  const handleAcceptReward = async () => {
    if (!selectedReward?.reward_Id || !user?.a_USER_ID) {
      setModalMessage('Missing reward ID or user ID');
      return;
    }
    try {
      await acceptReward(selectedReward.reward_Id, user.a_USER_ID);
      setIsSuccess(true);
      setTimeout(() => {
        document.getElementById('reward_modal').close();
        alert('Reward accepted successfully!');
        refetch();
      }, 500);
    } catch (err) {
      setModalMessage('Failed to accept reward');
    }
  };

  if (isLoading) return <div className="text-center text-gray-500"><span className="loading loading-dots loading-lg"></span></div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-bg w-full min-h-screen rounded-2xl mb-16 sm:mb-0">
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 items-center p-3 h-auto bg-bg rounded-xl">
        {Reward.sort((a, b) => (a.reward_quantity === 0 ? 1 : -1)).map((item, index) => (
          <RewardCard key={index} item={item} onClick={() => handleOpenModal(item)} />
        ))}
      </div>

      <dialog id="reward_modal" className="modal">
        <div className="modal-box bg-bg text-button-text">
          {selectedReward && (
            <>
              <div className="relative w-full h-48 rounded-2xl">
                <img
                  src={selectedReward.reward_Image[currentImageIndex] || 'fallback-image.jpg'}
                  alt="Slide"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button onClick={() => setCurrentImageIndex(prev => (prev === 0 ? selectedReward.reward_Image.length - 1 : prev - 1))} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">◀</button>
                <button onClick={() => setCurrentImageIndex(prev => (prev === selectedReward.reward_Image.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white">▶</button>
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <h3 className="text-xl font-bold break-words whitespace-normal">
                  Reward: {selectedReward.reward_Name}
                </h3>
                <p className="break-words whitespace-normal">
                  Description: {selectedReward.reward_Description}
                </p>
              </div>

            </>
          )}
          <div className="flex justify-between mt-4">
            <div className="flex flex-row gap-3">
              <img src="./1.png" alt="Coin Icon" className="w-6 h-6" />
              {selectedReward?.reward_price || 0} Pts
            </div>
            <div>
              <button className="btn btn-success rounded-badge text-bg mr-2" onClick={handleAcceptReward}>Confirm</button>
              <button className="btn btn-outline btn-error rounded-badge" onClick={() => document.getElementById('reward_modal').close()}>Close</button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Reward;
