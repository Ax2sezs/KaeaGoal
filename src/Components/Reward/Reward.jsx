import React, { useState, useEffect } from 'react';
import { useAuth } from '../APIManage/AuthContext';
import useFetchData from '../APIManage/useFetchData';
import { LocalShippingOutlined } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
        className="w-full h-40 rounded-t-2xl object-cover"
      />

      <div className="p-2 w-full flex flex-row justify-between">
        <div className="flex flex-col w-full">
          <h2 className="text-lg text-black font-bold truncate text-left">
            {item?.reward_Name || 'N/A'}
          </h2>
          <div className="flex flex-row justify-between">
            <p className="text-lg text-button-text flex items-center gap-2">
              <ShoppingCartOutlinedIcon className="" />
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
  const { Reward = [], error, isLoading, acceptReward, fetchRewards } = useFetchData(user?.token);
  const [selectedReward, setSelectedReward] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (user?.token) {
      fetchRewards();
    }
  }, [user?.token, fetchRewards]);

  // useEffect(() => {
  //   const userId = user?.a_USER_ID || localStorage.getItem('a_USER_ID');
  //   if (!userId || userId === 'undefined') {
  //     console.error('a_USER_ID is undefined. Refreshing the page...');
  //     window.location.reload();
  //   }
  // }, [user]);

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
      document.getElementById('reward_modal').close();
      setTimeout(() => {
        const successModal = document.getElementById("success_modal");
        if (successModal) {
          successModal.showModal();
        }
      }, 500, fetchRewards());
    } catch (err) {
      console.error("API Error:", err.response?.data?.message);
      if (err.response?.data?.message === "Insufficient Coin") {
        setErrorMessage("Not enough coin!");
        document.getElementById("error_modal").showModal();
      } else {
        setModalMessage("Failed to accept reward");
      }
    }
  };

  return (
    <div className="bg-bg w-full min-h-screen rounded-2xl mb-16 sm:mb-0">
      {isLoading ? (
        <div className="text-center text-gray-500">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : Array.isArray(Reward) && Reward.length === 0 ? (
        <p className='text-center'>No rewards found</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 items-center p-3 h-auto bg-bg rounded-xl">
          {Reward.sort((a, b) => {
            // หาก reward_quantity เป็น 0 ให้อยู่ท้ายสุด
            if (a.reward_quantity === 0 && b.reward_quantity !== 0) return 1; // a ให้อยู่ท้ายสุด
            if (a.reward_quantity !== 0 && b.reward_quantity === 0) return -1; // b ให้อยู่ท้ายสุด

            // หาก reward_quantity ไม่เป็น 0 เปรียบเทียบ reward_price
            return (a.reward_price || 0) - (b.reward_price || 0); // จัดเรียงตาม reward_price
          }).map((item, index) => (
            <RewardCard key={index} item={item} onClick={() => handleOpenModal(item)} />
          ))}

        </div>
      )}

      {/* Reward Modal */}
      <dialog id="reward_modal" className="modal">
        <div className="modal-box bg-bg text-button-text">
          {selectedReward && (
            <>
              <div className="relative w-full h-48 rounded-2xl">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  loop={true}
                  className="w-full h-full"
                >
                  {selectedReward.reward_Image.map((img, index) => (
                    <SwiperSlide key={index} className="flex justify-center items-center">
                      <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <h3 className="text-xl font-bold break-words whitespace-normal">
                  Reward: {selectedReward.reward_Name}
                </h3>
                <p className="w-full max-h-32 overflow-auto break-words whitespace-pre-line">
                  Description: {selectedReward.reward_Description}
                </p>
              </div>
            </>
          )}
          <div className="flex justify-between mt-4">
            <div className="flex flex-row gap-3 text-green-500">
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

      {/* Error Modal */}
      <dialog id="error_modal" className="modal">
        <div className="modal-box bg-red-500 text-white text-center">
          <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">Not enough coin</h3>
          <button
            className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 hover:bg-bg"
            onClick={() => document.getElementById("error_modal").close()}
          >
            Close
          </button>
        </div>
      </dialog>

      {/* Success Modal */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box bg-green-500 text-white text-center">
          <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">{selectedReward?.reward_Name}. Redeemed Successfully!</h3>
          <p>You have successfully redeemed...</p>
          <button
            className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 hover:bg-bg"
            onClick={() => document.getElementById("success_modal").close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default Reward;

