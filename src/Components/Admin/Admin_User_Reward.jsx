import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function Admin_User_Reward() {
  const { user } = useAuth();
  const { adminReward = [], error, isLoading, rewardStatus, refetch } = useFetchData(user?.token || '');

  const handleStatusChange = async (userRewardId, newStatus) => {
    try {
      // Call the rewardStatus function to update the reward status
      await rewardStatus(userRewardId, newStatus);
      // After the status is updated, refetch the rewards to reflect the change
      refetch();
    } catch (error) {
      console.error("Error updating reward status:", error);
    }
  };

  return (
    <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
      <h2 className="text-2xl font-bold mb-6 text-button-text">Admin User Rewards</h2>

      {isLoading ? (
        <div className="text-center text-gray-500">    
        <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error.message || 'An error occurred'}</p>
      ) : adminReward && adminReward.length === 0 ? (
        <p>No rewards found</p>
      ) : (
        <table className="min-w-full table-fixed border-collapse border border-gray-300 text-button-text">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Reward Name</th>
              <th className="border border-gray-300 p-2">User Name</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Redeem Date</th>
              <th className="border border-gray-300 p-2">Collect Date</th>
              <th className="border border-gray-300 p-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {adminReward.map((reward) => (
              <tr key={reward.user_reward_Id || Math.random()} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{reward.reward_Name}</td>
                <td className="border border-gray-300 p-2">{reward.useR_NAME}</td>
                <td className="border border-gray-300 p-2">{reward.reward_Description}</td>
                <td className="border border-gray-300 p-2">{reward.reward_Status}</td>
                <td className="border border-gray-300 p-2">{reward.reward_Price}</td>
                <td className="border border-gray-300 p-2">
                  {reward.redeem_Date ? new Date(reward.redeem_Date).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 p-2">
                  {reward.collect_Date
                    ? new Date(reward.collect_Date).toLocaleDateString()
                    : 'Not Collected'}
                </td>
                <td className="border border-gray-300 p-2">
                  {reward.image && reward.image.length > 0 ? (
                    <img
                      src={reward.image[0]}
                      alt="Reward"
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    className="border border-gray-300 p-1 rounded"
                    value={reward.reward_Status}
                    onChange={(e) => handleStatusChange(reward.user_reward_Id, e.target.value)} // Handle status change
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin_User_Reward;
