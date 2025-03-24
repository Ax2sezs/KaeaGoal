import React, { useState,useEffect } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function Admin_User_Reward() {
  const { user } = useAuth();
  const { adminReward = [], error, isLoading, rewardStatus, fetchAdminRewards } = useFetchData(user?.token || '');
   useEffect(() => {
              if (user?.token) {
                  fetchAdminRewards()
              }
            }, [user?.token, fetchAdminRewards]);

  const [selectedReward, setSelectedReward] = useState(""); // State สำหรับเลือก Reward

  const handleStatusChange = async (userRewardId, newStatus) => {
    try {
      await rewardStatus(userRewardId, newStatus);
      fetchAdminRewards();
    } catch (error) {
      console.error("Error updating reward status:", error);
    }
  };

  // ดึง reward_Name ที่ไม่ซ้ำกันเพื่อใส่ในตัวเลือกของ Select
  const uniqueRewards = [...new Set(adminReward.map(reward => reward.reward_Name))];

  // กรองข้อมูลตาม Reward ที่เลือก
  const filteredRewards = selectedReward
    ? adminReward.filter(reward => reward.reward_Name === selectedReward)
    : adminReward;

  // ฟังก์ชันสำหรับการเลือกสีพื้นหลังตาม status
  const getSelectBackgroundColor = (status) => {
    switch (status) {
      case 'Approve':
        return 'bg-white';
      case 'OnDelivery':
        return 'bg-white';
      case 'Delivered':
        return 'bg-white';
      default:
        return 'bg-white'; // Default color if no valid status
    }
  };

  return (
    <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
      <h2 className="text-2xl font-bold mb-6 text-button-text">Admin User Rewards</h2>

      {/* Dropdown Filter */}
      <div className="mb-4">
        <label className="text-button-text font-medium mr-2">Filter by Reward:</label>
        <select
          className="select select-sm bg-bg border-button-text text-button-text"
          value={selectedReward}
          onChange={(e) => setSelectedReward(e.target.value)}
        >
          <option value="">All Rewards</option>
          {uniqueRewards.map((rewardName) => (
            <option key={rewardName} value={rewardName}>
              {rewardName}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error.message || 'An error occurred'}</p>
      ) : filteredRewards.length === 0 ? (
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
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRewards.map((reward) => (
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
                    className={`border border-gray-300 p-1 rounded ${getSelectBackgroundColor(reward.reward_Status)}`}
                    value={reward.reward_Status}
                    onChange={(e) => handleStatusChange(reward.user_reward_Id, e.target.value)}
                  >
                    <option value="Approve" className="text-black">Approve</option>
                    <option value="OnDelivery" className=" text-black">On Delivery</option>
                    <option value="Delivered" className=" text-black">Delivered</option>
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
