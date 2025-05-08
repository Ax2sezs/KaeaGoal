import React, { useState, useEffect } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

function Admin_User_Reward() {
  const { user } = useAuth();
  const { adminReward = [], error, isLoading, rewardStatus, fetchAdminRewards, fetchExportExcel, } = useFetchData(user?.token || "");

  useEffect(() => {
    if (user?.token) {
      fetchAdminRewards();
    }
  }, [user?.token, fetchAdminRewards]);

  const [selectedReward, setSelectedReward] = useState(""); // Filter by Reward Name
  const [selectedStatus, setSelectedStatus] = useState(""); // Filter by Status
  const [searchQuery, setSearchQuery] = useState(""); // Search by User Name
  const [currentPage, setCurrentPage] = useState(1); // Current Page
  const [itemsPerPage] = useState(30); // Items per page
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const statusOrder = ["Waiting", "Prepared", "OnDelivery", "Delivered"];

  // ป้องกันการย้อนสถานะ
  const handleStatusChange = async (userRewardId, currentStatus, newStatus) => {
    const statusOrder = ["Approve", "OnDelivery", "Delivered"];
    if (statusOrder.indexOf(newStatus) < statusOrder.indexOf(currentStatus)) return;

    try {
      await rewardStatus(userRewardId, newStatus);
      fetchAdminRewards(); // อัปเดตข้อมูล
    } catch (error) {
      console.error("Error updating reward status:", error);
    }
  };

  // ดึงค่า Reward ที่ไม่ซ้ำกัน
  const uniqueRewards = [...new Set(adminReward.map((reward) => reward.reward_Name))];

  // ดึงค่า Status ที่ไม่ซ้ำกัน
  const uniqueStatuses = ["Redeemed", "OnDelivery", "Delivered"];

  // เรียงลำดับล่าสุดก่อน (จาก redeem_Date)
  const sortedRewards = [...adminReward].sort((a, b) =>
    new Date(b.redeem_Date) - new Date(a.redeem_Date)
  );

  // กรองข้อมูลตาม Reward Name, Status และ Search Query
  const filteredRewards = sortedRewards.filter((reward) =>
    (selectedReward ? reward.reward_Name === selectedReward : true) &&
    (selectedStatus ? reward.reward_Status === selectedStatus : true) &&
    (reward.user_Firstname.includes(searchQuery.toLowerCase()))
  );

  // ฟังก์ชันจัดการการเปลี่ยนหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRewards.slice(indexOfFirstItem, indexOfLastItem);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredRewards.length / itemsPerPage);

  return (
    <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
      <h2 className="text-2xl font-bold mb-6 text-button-text">Admin User Rewards</h2>

      {/* Summary */}
      <div className="mb-4 flex gap-4 text-button-text">
        <span>✅ Waiting: {filteredRewards.filter(r => r.reward_Status === "Redeemed").length}</span>
        <span>🚚 On Delivery: {filteredRewards.filter(r => r.reward_Status === "OnDelivery").length}</span>
        <span>📦 Delivered: {filteredRewards.filter(r => r.reward_Status === "Delivered").length}</span>
      </div>

      {/* Filters */}
      <div className="flex justify-between">
        <div className="mb-4 flex gap-4">
          <div>
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

          <div>
            <label className="text-button-text font-medium mr-2">Filter by Status:</label>
            <select
              className="select select-sm bg-bg border-button-text text-button-text"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "Redeemed" ? "Waiting" : status}
                </option>
              ))}
            </select>

          </div>
          <div>
            <label className="text-button-text font-medium mr-2">Search by User Name:</label>
            <input
              type="text"
              className="input input-sm bg-bg border-button-text text-button-text"
              placeholder="Search by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center">
          <button className="btn btn-success btn-sm text-bg" onClick={() => document.getElementById('export_modal').showModal()}>Export To Excel</button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center text-gray-500">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error.message || "An error occurred"}</p>
      ) : currentItems.length === 0 ? (
        <p>No rewards found</p>
      ) : (
        <table className="min-w-full table-fixed border-collapse border border-gray-300 text-button-text">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Reward Name</th>
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Dept</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Redeem Date</th>
              <th className="border border-gray-300 p-2">Collect Date</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((reward) => (
              <tr key={reward.user_reward_Id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{reward.reward_Name}</td>
                <td className="border border-gray-300 p-2">{reward.user_Firstname} {reward.user_SurName}</td>
                <td className="border border-gray-300 p-2">{reward.department}</td>
                <td className="border border-gray-300 p-2">{reward.reward_Price}</td>
                <td className="border border-gray-300 p-2">
                  {reward.redeem_Date ? new Date(reward.redeem_Date).toLocaleDateString('th-TH') : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                  {reward.collect_Date ? new Date(reward.collect_Date).toLocaleDateString('th-TH') : "Not Collected"}
                </td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={
                      reward.reward_Status === "Redeemed" || reward.reward_Status === "Waiting"
                        ? "text-gray-400"
                        : reward.reward_Status === "Prepared"
                          ? "text-blue-500"
                          : reward.reward_Status === "OnDelivery"
                            ? "text-yellow-500"
                            : reward.reward_Status === "Delivered"
                              ? "text-green-500"
                              : ""
                    }
                  >
                    {reward.reward_Status === "Redeemed" || reward.reward_Status === "Waiting"
                      ? "Waiting"
                      : reward.reward_Status === "Prepared"
                        ? "Prepared"
                        : reward.reward_Status === "OnDelivery"
                          ? "On Delivery"
                          : reward.reward_Status}
                  </span>
                </td>

                <td className="border border-gray-300 p-2">
                  <select
                    className={`border border-gray-300 p-1 rounded bg-bg font-semibold ${reward.reward_Status === "Waiting" || reward.reward_Status === "Redeemed"
                        ? "text-gray-400"
                        : reward.reward_Status === "Prepared"
                          ? "text-blue-500"
                          : reward.reward_Status === "OnDelivery"
                            ? "text-yellow-500"
                            : reward.reward_Status === "Delivered"
                              ? "text-green-500"
                              : "text-black"
                      }`}
                    value={reward.reward_Status}
                    disabled={reward.reward_Status === "Delivered"}
                    onChange={(e) =>
                      handleStatusChange(reward.user_reward_Id, reward.reward_Status, e.target.value)
                    }
                  >
                    {statusOrder.map((status) => {
                      const displayStatus =
                        status === "Waiting" ? "Waiting"
                          : status === "Prepared" ? "Prepared"
                            : status === "OnDelivery" ? "On Delivery"
                              : "Delivered";

                      const colorClass =
                        status === "Waiting"
                          ? "text-gray-400"
                          : status === "Prepared"
                            ? "text-blue-500"
                            : status === "OnDelivery"
                              ? "text-yellow-500"
                              : status === "Delivered"
                                ? "text-green-500"
                                : "text-black";

                      return (
                        <option
                          key={status}
                          value={status}
                          className={`${colorClass} font-semibold`}
                          disabled={statusOrder.indexOf(status) < statusOrder.indexOf(reward.reward_Status)}
                        >
                          {displayStatus}
                        </option>
                      );
                    })}
                  </select>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="text-button-text">Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
      <dialog id="export_modal" className="modal">
        <div className="modal-box bg-bg">
          <h1 className="text-xl text-button-text font-bold">Export to Excel</h1>
          <div className="flex justify-between mb-4 text-button-text mt-5">
            <div>
              <label className="block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-bordered input bg-heavy-color text-bg"
              />
            </div>
            <div>
              <label className="block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                min={startDate || ''} // ห้ามเลือกก่อน startDate
                onChange={(e) => setEndDate(e.target.value)}
                className="input-bordered input bg-heavy-color text-bg"
              />
            </div>

          </div>
          <div className="flex justify-end gap-5 mt-10">
            <button
              className="btn btn-success btn-sm text-bg"
              disabled={!startDate || !endDate}
              onClick={() => {
                const start = `${startDate}T00:00:00`;
                const end = `${endDate}T00:00:00`;
                fetchExportExcel(start, end);
              }}
            >
              Export Excel
            </button>

            <button
              className="btn btn-error btn-outline btn-sm"
              onClick={() => {
                const modal = document.getElementById('export_modal');
                if (modal) modal.close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Admin_User_Reward;
