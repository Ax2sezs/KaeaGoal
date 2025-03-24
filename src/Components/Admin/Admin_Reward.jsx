import React, { useState,useEffect } from 'react';
import CreateRewardForm from './CreateRewardForm';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import ModalPreview from './ModalPreview';

const Admin_Reward = () => {
  const { user } = useAuth();
  const { Reward = [], error, isLoading, createReward, fetchRewards } = useFetchData(user?.token);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setSelectedReward(null);
  };
   useEffect(() => {
              if (user?.token) {
                  fetchRewards()
              }
            }, [user?.token, fetchRewards]);

  return (
    <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
      <div className="admin-reward-container">
        <h2 className="text-2xl font-bold mb-6 text-button-text">Admin Reward</h2>
        <h2 className='text-button-text'>ALL REWARDS: {Reward.length}</h2>

        {/* Rewards Table */}
        <div className="reward-list overflow-x-auto">
          {isLoading ? (
            <div className="text-center text-gray-500">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          ) : Reward.length === 0 ? (
            <p>No rewards available</p>
          ) : (
            <table className="min-w-full table-fixed border-collapse border border-gray-300 text-button-text">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 w-32">Name</th>
                  <th className="border border-gray-300 p-2 w-32">Description</th>
                  <th className="border border-gray-300 p-2 w-32">Price</th>
                  <th className="border border-gray-300 p-2 w-32">Quantity</th>
                  <th className="border border-gray-300 p-2 w-32">Image</th>
                </tr>
              </thead>
              <tbody>
                {Reward.map((reward) => (
                  <tr
                    key={reward.reward_Id}
                    className="hover:bg-gray-50"
                    onClick={() => {
                      setSelectedReward(reward);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <td className="border border-gray-300 p-2">{reward.reward_Name}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_Description}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_price}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_quantity}</td>
                    <td className="border border-gray-300 p-2">
                      <img
                        src={reward.reward_Image || '/placeholder-image.png'}
                        alt={reward.reward_Name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Button to open create reward modal */}
        <div className="fixed top-20 right-5">
          <button
            className="btn bg-layer-item text-bg border-hidden hover:bg-heavy-color"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create Reward
          </button>
        </div>

        {/* Modal for creating a reward */}
        {isCreateModalOpen && (
          <dialog className="modal modal-open bg-bg">
            <div className="modal-box bg-bg text-button-text">
              <h3 className="font-bold text-lg">Create Reward</h3>
              <CreateRewardForm
                onCreateReward={createReward}
                onSuccess={fetchRewards}
                onClose={closeCreateModal} // <-- Pass it here
              />
            </div>
          </dialog>
        )}


        {/* ModalPreview for rewards */}
        {isPreviewOpen && (
          <ModalPreview
            isOpen={isPreviewOpen}
            onClose={closePreviewModal}
            reward={selectedReward}
          />
        )}
      </div>
    </div>
  );
};

export default Admin_Reward;
