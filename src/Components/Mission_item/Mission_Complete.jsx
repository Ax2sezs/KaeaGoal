import React, { useState, useEffect } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ModalDetail from './Modal/ModalDetail';


function Coin({ isTableLayout }) {
  const { user } = useAuth();
  const { completeMission = [], error, isLoading, fetchCompleteMissions } = useFetchData(user?.token);
  const [selectedMission, setSelectedMission] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleOpenModal = (mission) => {
    setSelectedMission(mission)
    setIsDetailModalOpen(true)
  }


  useEffect(() => {
    if (user?.token) {
      fetchCompleteMissions();
    }
  }, [user?.token, fetchCompleteMissions]);

  if (isLoading) {
    return <div className="text-center text-gray-500">
      <span className="loading loading-dots loading-lg"></span>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4">


      {completeMission.length === 0 ? (
        <p className="text-center text-gray-500">No completed missions yet.</p>
      ) : isTableLayout ? (
        // Table Layout
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border-hidden bg-bg rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="w-24"></th>
                <th className="w-28"></th>
                <th className="w-28"></th>

              </tr>
            </thead>
            <tbody>
              {completeMission.map((mission, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 text-gray-600"
                >
                  <td className='px-4 py-2'>
                    <img src={mission.mission_Image[0]} className="w-full h-16 object-cover rounded-2xl md:h-32"
                    /></td>
                  <td className="px-4 py-2 truncate">{mission.mission_Name}</td>
                  <td className="px-4 py-2 text-green-600 font-bold">
                    <div className='flex justify-center gap-3'>
                      {mission.coin_Reward}
                      <img src='./1.png' className='w-5 h-5' />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid Layout
        <div className="grid grid-cols-1 gap-4 items-center p-0 h-auto rounded-xl md:grid-cols-2">
          {completeMission.map((mission, index) => (
            <div
              key={index}
              className="relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg"
              onClick={() => handleOpenModal(mission)}
            >

              {/* Image Section */}
              <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">

                <img
                  src={mission.mission_Image[0] || 'placeholder-image.jpg'} // Use a placeholder if no image is provided
                  alt={mission.title || 'Mission'}
                  className="w-full h-full object-cover object-center"
                />
                {mission.is_Public && (
                  <div className='absolute top-2 left-2 flex items-center'>
                    <span className="flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 text-red-500 font-bold">
                      <WorkspacePremiumIcon />
                      Public to Community
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between p-2 w-full">
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold truncate sm:text-lg text-left text-button-text">
                    {mission.mission_Name}
                  </h2>
                  <div className='flex flex-row justify-between'>
                    <p className="text-sm truncate text-left">
                      Type : {mission.mission_Type}
                    </p>
                    <p>{mission.completed_Date ? new Date(mission.completed_Date).toLocaleDateString('th-TH') : 'No Date'}</p>
                  </div>
                </div>
                <div className="flex justify-center mt-1 sm:mt-0">
                  <div>
                    <strong className="text-green-600">Collected {mission.coin_Reward.toLocaleString()}</strong>
                  </div>
                  <div className='ml-1'>
                    <img src={mission.missioN_TypeCoin === 1 ? './3.png' : './1.png'} alt="Coin Icon" className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
      }
      {isDetailModalOpen && (
        <ModalDetail
          mission={selectedMission}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div >
  );
}

export default Coin;
