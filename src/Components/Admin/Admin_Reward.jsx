import React, { useState, useEffect } from 'react';
import CreateRewardForm from './CreateRewardForm';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import ModalPreview from './ModalPreview';
import EditReward from './EditReward';

const Admin_Reward = () => {
  const { user } = useAuth();
  const { Reward = [], error, isLoading, createReward, fetchRewards, fetchReward, RewardCate, fetchRewardCate } = useFetchData(user?.token);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredRewards = selectedCategory === 'All'
  ? Reward
  : Reward.filter((r) => r.rewardsCate_NameEn === selectedCategory);


  const closeCreateModal = () => setIsCreateModalOpen(false);
  const closePreviewModal = () => {
    setIsPreviewOpen(false);
    setSelectedReward(null);
  };
  useEffect(() => {
    if (user?.token) {
      fetchRewards()
      fetchRewardCate()
    }
  }, [user?.token, fetchRewards]);

  return (
    <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
      <div className="admin-reward-container">
        <h2 className="text-2xl font-bold mb-6 text-button-text">Admin Reward</h2>
        <h2 className='text-button-text'>ALL REWARDS: {Reward.length}</h2>
        <div className="my-4">
          <label htmlFor="category" className="mr-2 text-button-text font-semibold">
            Filter by Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select select-info bg-bg text-button-text w-56 border border-gray-300 rounded-md p-2"
          >
            <option value="All">All</option>
            {RewardCate?.map((cate) => (
              <option key={cate.rewardsCate_Id} value={cate.rewardsCate_NameEn}>
                {cate.rewardsCate_NameEn}
              </option>
            ))}
          </select>
        </div>


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
                  <th className="border border-gray-300 p-2 w-32">Cate</th>
                  <th className="border border-gray-300 p-2 w-32">Description</th>
                  <th className="border border-gray-300 p-2 w-32">Price</th>
                  <th className="border border-gray-300 p-2 w-10">Current</th>
                  <th className="border border-gray-300 p-2 w-10">Quantity</th>
                  <th className="border border-gray-300 p-2 w-10">Total Redeem</th>
                  <th className="border border-gray-300 p-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRewards.map((reward) => (
                  <tr
                    key={reward.reward_Id}
                    className="hover:bg-gray-50"
                    onClick={() => {
                      setSelectedReward(reward);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <td className="border border-gray-300 p-2">{reward.reward_Name}</td>
                    <td className="border border-gray-300 p-2">{reward.rewardsCate_NameEn}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_Description}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_price.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_quantity.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_Total.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">{reward.reward_TotalRedeem.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // ไม่ให้ trigger preview modal
                          setEditingReward(reward);
                          setIsEditModalOpen(true);
                        }}
                        className="btn btn-sm w-full btn-success text-white"
                      >
                        Edit
                      </button>
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
                cate={RewardCate}
                onCreateReward={createReward}
                onSuccess={fetchRewards}
                onClose={closeCreateModal} // <-- Pass it here
              />
            </div>
          </dialog>
        )}
        {isEditModalOpen && (
          <dialog className="modal modal-open bg-bg">
            <div className="modal-box bg-bg text-button-text">
              <h3 className="font-bold text-lg">Edit Reward</h3>
              <EditReward
                initialData={editingReward}
                cate={RewardCate}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setEditingReward(null);
                }}
                onSuccess={fetchRewards}
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
