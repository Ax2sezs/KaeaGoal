import React, { useState, useEffect } from "react";
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function GiveCoin() {
  const [nameFilter, setNameFilter] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [branchCodeFilter, setBranchCodeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const { user } = useAuth();
  const { userDetails, alluserDetail = [], coinDetails, error, isLoading,
    giveCoin, fetchUserDetails, fetchAllUserDetails, fetchCoinDetails, fetchFilteredUsers,
    filteredUserDetail } = useFetchData(user?.token);
  useEffect(() => {
    if (user?.token) {
      fetchCoinDetails()
    }
  }, [user?.token, fetchCoinDetails]);


  // ใช้ useEffect เพื่อเรียก fetchFilteredUsers เมื่อเลือก branchCodeFilter
  useEffect(() => {
    if (user?.token && branchCodeFilter) {
      const filterData = {
        logoN_NAME: nameFilter,
        useR_NAME: nameFilter,
        useR_POSITION: positionFilter,
        branchCode: branchCodeFilter,
        branch: branchFilter,
        pageNumber: 1,  // ตั้งค่าเริ่มต้นเป็น 1
        pageSize: 10    // ตั้งค่าเริ่มต้นเป็น 10
      };
  
      fetchFilteredUsers(filterData); // เรียกใช้ API เพื่อกรองผู้ใช้
    }
  }, [branchCodeFilter, nameFilter, branchFilter, positionFilter, user?.token, fetchFilteredUsers]);
  

  // กรองข้อมูลที่ได้จาก filteredUserDetail
  const filteredUsers = filteredUserDetail ? filteredUserDetail.filter(
    (user) =>
      user.a_USER_ID !== userDetails?.a_USER_ID &&
      (!branchCodeFilter || user.branchCode === branchCodeFilter) &&
      (!branchFilter || user.branch === branchFilter) &&
      (!positionFilter || user.user_Position === positionFilter) &&
      (nameFilter === "" || user.user_Name.toLowerCase().includes(nameFilter.toLowerCase()))
  ) : [];

  console.log("Filtered Users: ", filteredUsers);

  // กำหนด availableBranches หลังจากเลือก branchCode
  const availableBranches = branchCodeFilter
    ? [...new Set(filteredUserDetail.filter(user => user.branchCode === branchCodeFilter).map(user => user.branch))]
    : [];

  // กำหนด availablePositions หลังจากเลือก branchFilter
  const availablePositions = branchFilter
    ? [...new Set(filteredUserDetail.filter(user => user.branch === branchFilter).map(user => user.user_Position))]
    : [];

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
  };
  const handleSearchClick = () => {
    fetchFilteredUsers({
      name: nameFilter,
      branchCode: branchCodeFilter,
      branch: branchFilter,
      position: positionFilter,
    });
  };

  const handleBranchCodeChange = (e) => {
    setBranchCodeFilter(e.target.value);
    setBranchFilter("");  // รีเซ็ต branchFilter เมื่อเปลี่ยน branchCode
    setPositionFilter("");  // รีเซ็ต positionFilter เมื่อเปลี่ยน branchCode
  };

  const handleCoinChange = (e) => {
    const value = e.target.value;
    // Ensure the value is a number between 1 and 50
    if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
      setCoinValue(value);
    }
  };

  const handleConfirmChange = (e) => setIsConfirmed(e.target.checked);

  const handleGiveCoin = async () => {
    if (!coinValue || !recipientId) {
      setError("Please enter a valid amount and select a recipient.");
      return;
    }

    try {
      await giveCoin(recipientId, coinValue);
      setCoinValue(0);
      setIsConfirmed(false);

      // เปิด Modal Success เมื่อให้เหรียญสำเร็จ
      const successModal = document.getElementById("success_modal");
      if (successModal) {
        successModal.showModal();
        refetch()
      }
    } catch (err) {
      // ตรวจสอบข้อผิดพลาดจาก API
      if (err.status === 400) {
        const errorModal = document.getElementById("error_modal");
        if (errorModal) {
          errorModal.showModal(); // เปิด Modal Error ถ้าเหรียญไม่พอ
        }
      } else {
        setError("Failed to give coin. Please try again.");
      }
    }
  };

  const openModal = (idx, receiverId) => {
    setRecipientId(receiverId);
    document.getElementById(`modal-${idx}`).showModal();
  };

  const closeModal = (idx) => {
    setRecipientId(null);
    setCoinValue("");
    document.getElementById(`modal-${idx}`).close();
  };


  return (
    <div>
      <div className="flex flex-col gap-5 justify-center items-center w-full text-button-text">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center items-center gap-2">
            <p className="text-4xl text-green-500 font-bold">{coinDetails?.thankCoinBalance}</p>
            <img src="./2.png" className="w-10 h-10" />
          </div>
        </div>

        {/* Name Filter Input */}
        {/* <div className="mb-4">
          <label className="block mb-2 font-bold text-lg">Search</label>
          <input
            type="text"
            className="input input-bordered w-full rounded-badge max-w-xs bg-transparent border-heavy-color"
            placeholder="Enter name"
            value={nameFilter}
            onChange={handleNameChange}  // เรียกใช้ handleNameChange เมื่อมีการเปลี่ยนค่า
          />
        </div> */}
        <div className="flex flex-col w-full justify-center">
          <div className="flex flex-row gap-3 mb-2">
            {/* Branch Code Filter */}
            <div className="">
              <label className="block mb-2 font-bold text-sm">* Site</label>
              <select
                value={branchCodeFilter}
                onChange={handleBranchCodeChange}
                className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
              >
                <option value="">Select Site</option>
                {['AUOF', 'AUFC', 'AUBR'].map((branchCode, index) => (
                  <option key={index} value={branchCode}>{branchCode}</option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div className="">
              <label className="block mb-2 font-bold text-sm">* Branch</label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="input input-bordered w-40 max-w-xs bg-bg disabled:bg-bg disabled:border-layer-background"
                disabled={!branchCodeFilter}  // ต้องเลือก Branch Code ก่อน
              >
                <option value="">Select</option>
                {availableBranches.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setBranchCodeFilter("");  // รีเซ็ตค่า branchCodeFilter
                  setPositionFilter("");    // รีเซ็ตค่า positionFilter
                }}
                className="btn bg-layer-item rounded-badge w-10 h-10 hover:bg-heavy-color text-bg border-hidden"
              >
                <DeleteForeverIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-row w-40 mb-2">
            <div className="w-full">
              <label className="block mb-2 font-bold text-sm">Position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="input input-bordered w-full bg-bg disabled:bg-bg disabled:border-layer-background"
                disabled={!branchFilter}  // ต้องเลือก Branch ก่อน
              >
                <option value="">Select Position</option>
                {availablePositions.map((position, index) => (
                  <option key={index} value={position}>{position}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Display Filtered Users */}
      <div>
        <h4 className="text-sm font-bold text-button-text mb-4">Filtered Users</h4>

        {isLoading ? (
          <div className="text-center text-gray-500">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : (!branchCodeFilter || !branchFilter || !positionFilter) ? (
          <p className="text-red-500 text-center mt-4">
            "Please fill in all required information before displaying the list."
          </p>

        ) : filteredUsers && filteredUsers.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 justify-center">
              {filteredUsers.map((item, idx) => {
                const isDisabled = coinDetails?.thankCoinBalance === 0;

                return (
                  <div
                    key={idx}
                    className={`p-2 border-2 border-layer-item bg-bg shadow-md rounded-xl flex flex-col items-center w-40 transition-transform duration-300 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"}`}
                    onClick={() => {
                      if (!isDisabled) {
                        openModal(idx, item.a_USER_ID);
                      }
                    }}
                  >
                    {/* Profile Image */}
                    <div className="relative w-20 h-20">
                      <img
                        src={item?.imageUrls || 'au-logo.png'}
                        className="w-full h-full rounded-full object-cover"
                        alt="User Profile"
                      />
                    </div>

                    {/* User Info */}
                    <div className="mt-3 text-center">
                      <p className="text-button-text font-semibold text-lg truncate">{item.user_Name || 'Unknown'}</p>
                      <p className="text-gray-600 text-sm">{item.branchCode ? `${item.branchCode} - ${item.branch}` : 'No branch info'}</p>
                      <p>{item.user_Position}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No matching users found.</p>
        )}

      </div>


      {/* Modals */}
      {filteredUsers.map((item, idx) => (
        <dialog id={`modal-${idx}`} className="modal" key={`modal-${idx}`}>
          <div className="modal-box bg-bg">
            <div className="flex flex-col items-center"> {/* Center content horizontally */}
              <div className="relative w-40 h-40 flex justify-center items-center"> {/* Center image */}
                <img
                  src={item?.imageUrls || 'au-logo.png'}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-center mt-5 text-button-text">To {item.user_Name}</h3> {/* Center text */}
            </div>
            <div className="py-4">
              <label className="block mb-2 font-medium text-center text-btn">Enter Coin Amount (1-10)</label> {/* Center text */}
              <input
                type="number"
                className="input input-bordered w-full bg-bg border-heavy-color"
                value={coinValue}
                onChange={handleCoinChange}
              />

              {/* แสดงข้อความถ้าเหรียญไม่พอ
              {coinDetails?.thankCoinConvert < coinValue && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )} */}

              {/* ซ่อน checkbox ถ้าเหรียญไม่พอ */}
              {coinDetails?.thankCoinBalance >= coinValue && (
                <div className="mt-4 flex items-center justify-center"> {/* Center checkbox and label */}
                  <input
                    type="checkbox"
                    id={`confirm-${idx}`}
                    className="checkbox mr-2 border-button-text"
                    checked={isConfirmed}
                    onChange={handleConfirmChange}
                  />
                  <label htmlFor={`confirm-${idx}`} className="font-medium text-button-text">
                    Coin given to {item.user_Name}: {coinValue} coins!
                  </label>
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                className="btn bg-[#54d376] border-none w-24 rounded-badge text-white hover:bg-[#43af60]"
                disabled={!isConfirmed || !coinValue || coinDetails?.thankCoinBalance < coinValue}
                onClick={handleGiveCoin}
              >
                Confirm
              </button>
              <button
                className="btn bg-[#ff6060] border-none w-24 rounded-badge text-white hover:bg-[#d44141]"
                onClick={() => closeModal(idx)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>


      ))}
      {/* Error Modal */}
      <dialog id="error_modal" className="modal">
        <div className="modal-box bg-red-500 text-white text-center">
          <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">{error}</h3>
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
          <h3 className="text-xl font-bold">Give coin Successfully!</h3>
          <p>You have successfully give coin...</p>
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

export default GiveCoin;
