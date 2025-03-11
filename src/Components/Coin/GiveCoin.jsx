import React, { useState } from "react";
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function GiveCoin() {
  const [nameFilter, setNameFilter] = useState("");
  const [coinValue, setCoinValue] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [successMessage, setSuccess] = useState("");
  const [errorMessage, setError] = useState("");

  const { user } = useAuth();
  const { alluserDetail = [], coinDetails, error, isLoading, giveCoin, refetch } = useFetchData(user?.token);

  const handleNameChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleCoinChange = (e) => {
    const value = e.target.value;
    // Ensure the value is a number between 1 and 50
    if (value === "" || (Number(value) >= 1 && Number(value) <= 50)) {
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
      if (err.message === 'Insufficient ThankCoin balance .') {
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

  const filteredUsers = alluserDetail.filter(
    (item) =>
      item.logoN_NAME.toLowerCase().includes(nameFilter.toLowerCase()) ||
      item.branchCode.toLowerCase().includes(nameFilter.toLowerCase()) ||
      item.branch.toLowerCase().includes(nameFilter.toLowerCase())
  );

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
        <div className="mb-4">
          <label className="block mb-2 font-bold text-lg">Search</label>
          <input
            type="text"
            className="input input-bordered w-full rounded-badge max-w-xs bg-transparent border-heavy-color"
            placeholder="Enter name, branch code, or branch"
            value={nameFilter}
            onChange={handleNameChange}
          />
        </div>
      </div>

      {/* Display Filtered Users */}
      <div>
        <h4 className="text-lg font-bold text-button-text mb-4">Filtered Users</h4>

        {isLoading ? (
          <div className="text-center text-gray-500">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 justify-center">
              {filteredUsers.map((item, idx) => {
                const isDisabled = coinDetails?.thankCoinBalance === 0;

                return (
                  <div
                    key={idx}
                    className={`p-2 border-2 border-layer-item bg-bg shadow-md rounded-xl flex flex-col items-center w-40 transition-transform duration-300 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"
                      }`}
                    onClick={() => {
                      if (!isDisabled) {
                        openModal(idx, item.a_USER_ID);
                      }
                    }}
                  >
                    {/* Profile Image */}
                    <div className="relative w-20 h-20">
                      <img
                        src={item?.imageUrls || 'default-image.png'}
                        className="w-full h-full rounded-full object-cover"
                        alt="User Profile"
                      />
                    </div>

                    {/* User Info */}
                    <div className="mt-3 text-center">
                      <p className="text-button-text font-semibold text-lg truncate">{item.logoN_NAME || 'Unknown'}</p>
                      <p className="text-gray-600 text-sm">{item.branchCode ? `${item.branchCode} - ${item.branch}` : 'No branch info'}</p>
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
                  src={item?.imageUrls}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="font-bold text-lg text-center mt-5 text-button-text">To {item.logoN_NAME}</h3> {/* Center text */}
            </div>
            <div className="py-4">
              <label className="block mb-2 font-medium text-center text-btn">Enter Coin Amount (1-50)</label> {/* Center text */}
              <input
                type="number"
                className="input input-bordered w-full bg-bg border-heavy-color"
                value={coinValue}
                onChange={handleCoinChange}
              />

              {/* แสดงข้อความถ้าเหรียญไม่พอ */}
              {coinDetails?.thankCoinConvert < coinValue && (
                <p className="text-red-500 text-center mt-4">Not Enough Coin</p>
              )}

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
                    Coin given to {item.logoN_NAME}: {coinValue} coins!
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
