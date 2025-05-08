import React, { useState, useEffect } from 'react';
import { useAuth } from '../APIManage/AuthContext';
import useFetchData from '../APIManage/useFetchData';
import MissionCard from './MissionCard';
import GroupIcon from '@mui/icons-material/Group';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Mission_Main({ isTableLayout }) {
  const { user } = useAuth();
  const { missions = [], error, isLoading, acceptMission, fetchMissions } = useFetchData(user?.token);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalSuccess, setIsModalSuccess] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchMissions();
    }
  }, [user?.token, fetchMissions]);

  // useEffect(() => {
  //   const userId = user?.a_USER_ID || localStorage.getItem('a_USER_ID');
  //   if (!userId || userId === 'undefined') {
  //     console.error('a_USER_ID is undefined. Refreshing the page...');
  //     window.location.reload();
  //   }
  // }, [missions, user]);

  // useEffect(() => {
  //   if (error) {
  //     const errorModal = document.getElementById("error_modal");
  //     if (errorModal) {
  //       errorModal.showModal(); // เปิด Modal Error
  //     }
  //   }
  // }, [error]);

  const sortedMissions = missions.sort((a, b) => {
    const now = new Date();

    const isFullA = a?.current_Accept >= a?.accept_limit;
    const isFullB = b?.current_Accept >= b?.accept_limit;
    const isLimitedA = a?.is_Limited ? -1 : 1;
    const isLimitedB = b?.is_Limited ? -1 : 1;

    const isComingA = a?.start_Date && new Date(a.start_Date) > now;
    const isComingB = b?.start_Date && new Date(b.start_Date) > now;

    const isExpiredA = a?.end_Date && new Date(a.end_Date) <= now;
    const isExpiredB = b?.end_Date && new Date(b.end_Date) <= now;

    // ✅ ถ้า mission หมดอายุ ให้ไปอยู่หลังสุด
    if (isExpiredA !== isExpiredB) {
      return isExpiredA ? 1 : -1;
    }

    // ✅ ถ้า mission กำลังจะมา ให้ไปอยู่ก่อน
    if (isComingA !== isComingB) {
      return isComingA ? 1 : -1;
    }

    // ✅ ถ้าอันไหนเต็ม ให้ไปอยู่หลังสุด
    if (isFullA !== isFullB) {
      return isFullA - isFullB;
    }

    // ✅ ถ้ายังไม่เต็ม ให้ Limited มาก่อน
    if (isLimitedA !== isLimitedB) {
      return isLimitedA - isLimitedB;
    }

    // ✅ ใหม่สุดขึ้นก่อน (start_Date มาก → อยู่บน)
    const startA = new Date(a.start_Date || 0);
    const startB = new Date(b.start_Date || 0);
    return startB - startA;
  });




  const handleButtonClick = (index) => {
    setSelectedIndex(index);
    setCurrentImageIndex(0);
    setIsModalSuccess(false);
    document.getElementById('my_modal_5').showModal();
  };

  const handleConfirm = async () => {
    if (selectedIndex === null) return;

    const missionId = missions[selectedIndex]?.missioN_ID;
    const userId = user?.a_USER_ID || localStorage.getItem('a_USER_ID');

    if (!missionId || !userId) return;

    try {
      await acceptMission(missionId, userId);
      setIsModalSuccess(true);
      document.getElementById('my_modal_5').close();


      setTimeout(() => {
        const successModal = document.getElementById("success_modal");
        if (successModal) {
          successModal.showModal();
        }
      }, 200);

    } catch (err) {
      console.error('Failed to accept mission', err);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500"><span className="loading loading-dots loading-lg"></span></div>;
  }

  return (
    <div>
      {sortedMissions.length === 0 ? (
        <div className="relative overflow-hidden h-28 mt-5">
        <div className="flex items-center gap-3 absolute animate-sheepLoop mt-2">
          <img src="sheep.gif" className="w-auto h-20 animate-bounce" />
        </div>
        <p className="text-gray-500 text-xl font-semibold text-center">Coming Soon. . .</p>

      </div>
      
      ) : (
        // ✅ Grid Layout (Card View)
        !isTableLayout ? (
          <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-5 items-center p-3 h-auto bg-bg rounded-xl">
            {sortedMissions.map((item, index) => (
              <MissionCard key={index} item={item} onClick={() => handleButtonClick(index)} />
            ))}
          </div>
        ) : (
          // ✅ Table Layout
          <div className="overflow-x-auto mb-16">
            <table className="table-fixed w-full border-hidden bg-bg rounded-xl">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="w-24"></th>
                  <th className="w-32"></th>
                  <th className="w-28"></th>
                </tr>
              </thead>
              <tbody>
                {sortedMissions.map((mission, index) => {
                  const isFull = mission.current_Accept >= mission.accept_limit;
                  const isExpired = mission.expire_Date && new Date(mission.expire_Date) < new Date();
                  const isComing = mission?.start_Date && new Date(mission.start_Date) > new Date();
                  const isDisabled = isFull || isExpired || isComing;

                  return (
                    <tr key={index}
                      onClick={() => !isDisabled && handleButtonClick(index)}
                      className={`text-gray-600 border-b border-gray-300 transition ${isDisabled ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-200 cursor-pointer'
                        }`}
                    >
                      <td className="px-3 py-2">
                        <img src={mission.missionImages[0]}
                          alt={mission.missioN_NAME}
                          className="w-full h-16 object-cover rounded-md md:h-32" />
                      </td>
                      <td className="px-3 py-2 text-left truncate">
                        <div className='flex flex-col'>
                          <span className="text-red-500 font-bold flex items-center gap-1">
                            {mission.is_Public && (
                              <>
                                <WorkspacePremiumIcon />
                                LIMITED!
                              </>
                            )}
                          </span>

                          <span className='font-bold'>
                            {mission.missioN_NAME}
                          </span>
                          <span>
                            Type: {mission.missioN_TYPE}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className='flex flex-row items-center justify-start'>
                          <div className='flex flex-col items-center'>
                            <div className='mr-5'>
                              <div>
                                <img src='./1.png' className='w-6 h-6' alt="Coin Icon" />
                              </div>
                              <div className='text-green-500'>
                                <GroupIcon />
                              </div>
                            </div>
                          </div>
                          <div className='flex flex-col gap-1 text-start'>
                            <div className='text-green-500 font-bold'>
                              {mission.mission_Point}
                            </div>
                            <div className='text-green-500'>
                              {mission.current_Accept}/{mission.accept_limit}
                            </div>
                          </div>
                        </div>
                        <span className='text-sm'>
                          Exp: {mission?.expire_Date ? new Date(mission.expire_Date).toLocaleDateString('th-TH') : 'No Date'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      )}


      {/* Modal for mission details */}
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box bg-bg text-button-text">
          {selectedIndex !== null && (
            <>
              {/* Swiper Carousel */}
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-48 rounded-2xl"
              >
                {(sortedMissions[selectedIndex]?.missionImages || ['fallback-image.jpg']).map((image, index) => (
                  <SwiperSlide key={index} className="flex items-center justify-center">
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* รายละเอียดภารกิจ */}
              <div className="flex flex-col gap-3 mt-5">
                <h3 className="font-bold">
                  {sortedMissions[selectedIndex]?.is_Limited && (
                    <span className="text-red-500">
                      <WorkspacePremiumIcon />
                    </span>
                  )}
                  Mission : {sortedMissions[selectedIndex]?.missioN_NAME}
                </h3>
                {sortedMissions[selectedIndex]?.is_Public && (
                  <p className="text-sm text-red-500 font-medium">
                    *This mission is public. The content you submit may be shared on the Community page.*
                  </p>
                )}
                <p className="w-full max-h-32 overflow-auto break-words whitespace-pre-line">
                  <strong>Description : </strong>{sortedMissions[selectedIndex]?.description}
                </p>
              </div>

              {/* คะแนน & จำนวนคน */}
              <div className="flex justify-between mt-4">
                <div className="flex flex-col text-sm gap-2 text-green-500 sm:text-lg sm:flex-row sm:gap-5">
                  <div className="flex flex-row gap-3">
                    <img src={sortedMissions[selectedIndex]?.missioN_TypeCoin === 1 ? './3.png' : './1.png'} alt="Coin Icon" className="w-6 h-6" />
                    {sortedMissions[selectedIndex]?.mission_Point.toLocaleString() || 0} Pts
                  </div>
                  <div className="flex flex-row gap-3">
                    <GroupIcon /> {sortedMissions[selectedIndex]?.current_Accept.toLocaleString()}/{sortedMissions[selectedIndex]?.accept_limit.toLocaleString()}
                  </div>
                </div>

                {/* ปุ่ม Confirm / Close */}
                <div>
                  <button className="btn btn-success rounded-badge text-bg mr-2" onClick={handleConfirm}>
                    Confirm
                  </button>
                  <button className="btn btn-outline btn-error rounded-badge" onClick={() => {
                    setSelectedIndex(null);
                    document.getElementById('my_modal_5').close();
                  }}>
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog >
      <dialog id="success_modal" className="modal">
        <div className="modal-box bg-green-500 text-white text-center">
          <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">Mission Saved</h3>
          <p>* Please Check In My Mission. . .</p>

          <button
            className="btn border-bg bg-bg rounded-badge border-hidden text-green-500 mt-3 hover:transition-transform hover:scale-105 hover:bg-bg"
            onClick={() => document.getElementById("success_modal").close()} // ปิด modal
          >
            Close
          </button>
        </div>
      </dialog>
      <dialog id="error_modal" className="modal">
        <div className="modal-box bg-red-500 text-white text-center">
          <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">Mission Full</h3>
          <p>Fail to accept mission</p>
          <button
            className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
            onClick={() => document.getElementById("error_modal").close()}  // ปิด modal
          >
            Close
          </button>
        </div>
      </dialog>
    </div >
  );
}

export default Mission_Main;
