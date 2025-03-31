import React, { useState, useEffect } from "react";
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function GiveCoin() {
  const [coinValue, setCoinValue] = useState(" ");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [branchCodeFilter, setBranchCodeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const { user } = useAuth();
  const { coinDetails, error, isLoading, department, filterByDept,
    giveCoin, fetchCoinDetails, fetchFilterByDept, fetchDept,
    filteredUserDetail } = useFetchData(user?.token);
  useEffect(() => {
    if (user?.token) {
      fetchCoinDetails();
    }
  }, [user?.token, fetchCoinDetails]);

  useEffect(() => {
    if (branchCodeFilter && user?.token) {
      fetchDept(branchCodeFilter)
        .then((response) => {
          console.log("Full response:", response);  // ตรวจสอบ response ทั้งหมด
          if (response && response.data) {
            console.log("Fetched data:", response.data);  // ตรวจสอบข้อมูลที่ได้จาก API
            // ไม่ต้องใช้ setDepartmentList ถ้าไม่ใช้งานข้อมูลนี้ใน UI
          }
        })
        .catch((err) => {
          console.error("Failed to fetch departments:", err);
        });
    }
  }, [branchCodeFilter, user?.token]);

  // ✅ 1. เลือก Site -> ดึง Department
  useEffect(() => {
    if (branchFilter) {
      console.log('Fetching users with department:', branchFilter); // ตรวจสอบพารามิเตอร์ที่ส่ง
      fetchFilterByDept(branchCodeFilter,branchFilter, 1, 100); // Fetch filtered users based on selected department
      console.log("filterByDept:", filterByDept);

    }
  }, [branchFilter, fetchFilterByDept]);

  // เมื่อเลือก Site
  const handleBranchCodeChange = async (e) => {
    const selectedSite = e.target.value;
    setBranchCodeFilter(selectedSite);

    // รีเซ็ตค่า Department ทันทีเป็น "clearDept"
    setBranchFilter("clearDept");

    if (selectedSite !== "clearSite") {
      await fetchFilterByDept(); // โหลดข้อมูลใหม่ทันที
    }
  };

  // เมื่อเลือกแผนก
  const handleBranchChange = (e) => {
    const selectedDepartment = e.target.value;
    setBranchFilter(selectedDepartment);
  };

  // โหลดข้อมูลแผนกอัตโนมัติเมื่อเลือก Site ใหม่
  useEffect(() => {
    if (branchCodeFilter && branchCodeFilter !== "clearSite") {
      fetchFilterByDept();
    }
  }, [branchCodeFilter]); // ทำงานเมื่อ branchCodeFilter เปลี่ยน



  const handleCoinChange = (e) => {
    const value = e.target.value;
    // Ensure the value is a number between 1 and 50
    if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
      setCoinValue(value);
    }
  };

  const handleConfirmChange = (e) => setIsConfirmed(e.target.checked);

  const handleGiveCoin = async (idx) => {
    if (!coinValue || !recipientId) {
      setError("Please enter a valid amount and select a recipient.");
      return;
    }

    try {
      await giveCoin(recipientId, coinValue);
      setCoinValue('');
      setIsConfirmed(false);
      // เปิด Modal Success เมื่อให้เหรียญสำเร็จ
      const modal = document.getElementById(`modal-${idx}`);
      if (modal) {
        modal.close();
      }
      const successModal = document.getElementById("success_modal");
      if (successModal) {
        successModal.showModal();
        fetchCoinDetails()

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
            <p className="text-4xl text-layer-item font-bold">{coinDetails?.thankCoinBalance}</p>
            <img src="./3.png" className="w-10 h-10" />
          </div>
        </div>

        <div className="flex flex-col w-full justify-center">
          <div className="flex flex-row gap-3 mb-2">
            {/* Site Filter */}
            <div>
              <label className="block mb-2 font-bold text-sm">* Site</label>
              <select
                value={branchCodeFilter}
                onChange={handleBranchCodeChange}
                className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
              >
                <option value="clearSite">Select Site</option>
                {['AUOF', 'AUFC', 'AUBR'].map((branchCode, index) => (
                  <option key={index} value={branchCode}>{branchCode}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block mb-2 font-bold text-sm">* Department</label>
              <select
                value={branchFilter}
                onChange={handleBranchChange}
                className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
                disabled={!branchCodeFilter || branchCodeFilter === "clearSite"} // ปิดการใช้งานถ้า Site ยังไม่ถูกเลือก
              >
                <option value="clearDept">Select Department</option>
                {department && department.length > 0 ? (
                  // เรียงลำดับตามชื่อแผนก
                  department
                    .slice() // clone array เพื่อไม่ให้เปลี่ยนแปลง state เดิม
                    .sort((a, b) => a.departmentCode.localeCompare(b.departmentCode)) // เรียงตาม departmentName
                    .map((dept, index) => (
                      <option key={index} value={dept.departmentCode}>
                        {dept.departmentCode} - {dept.departmentName}
                      </option>
                    ))
                ) : (
                  <option disabled>No departments available</option>
                )}
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
        ) : filterByDept && filterByDept.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 justify-center">
              {filterByDept.map((item, idx) => {
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
                        src={item?.imageUrls || 'profile.png'}
                        className="w-full h-full rounded-full object-cover"
                        alt="User Profile"
                      />
                    </div>

                    {/* User Info */}
                    <div className="mt-3 text-center">
                      <p className="text-button-text font-semibold text-sm w-40 truncate">{item.user_Name || 'Unknown'}</p>
                      <p className="text-gray-600 text-sm ">{item.user_Position}</p>
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
      {
        filterByDept.map((item, idx) => (
          <dialog id={`modal-${idx}`} className="modal" key={`modal-${idx}`}>
            <div className="modal-box bg-bg">
              <div className="flex flex-col items-center"> {/* Center content horizontally */}
                <div className="relative w-40 h-40 flex justify-center items-center"> {/* Center image */}
                  <img
                    src={item?.imageUrls || 'profile.png'}
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
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                      e.preventDefault(); // ป้องกันการกดปุ่มที่ไม่ต้องการ
                    }
                  }}
                  inputMode="numeric" // แสดงคีย์บอร์ดตัวเลขบนมือถือ
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
                  // onClick={handleGiveCoin}
                  onClick={() => handleGiveCoin(idx)} // ส่ง idx เข้าไป
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


        ))
      }
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
    </div >
  );
}

export default GiveCoin;
