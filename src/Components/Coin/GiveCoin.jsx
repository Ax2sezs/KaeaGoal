// import React, { useState, useEffect } from "react";
// import useFetchData from '../APIManage/useFetchData';
// import { useAuth } from '../APIManage/AuthContext';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import PersonSearchIcon from '@mui/icons-material/PersonSearch';

// function GiveCoin() {
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(12);
//   const [totalPage, setTotalPage] = useState(1);
//   const [coinValue, setCoinValue] = useState(" ");
//   const [desText, setDesText] = useState("")
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [recipientId, setRecipientId] = useState(null);
//   const [branchCodeFilter, setBranchCodeFilter] = useState("");
//   const [branchFilter, setBranchFilter] = useState("");
//   const [userNameFilter, setUserNameFilter] = useState('');
//   const [filterData, setFilterData] = useState({
//     logoN_NAME: '',
//     useR_NAME: '',
//     useR_POSITION: '',
//     branchCode: '',
//     displayName: '',
//     department: '',
//     branch: '',
//     position: '',
//     pageNumber: 1,
//     pageSize: 50,
//   });


//   const { user } = useAuth();
//   const { coinDetails, userDetails, error, isLoading, department, filterByDept,
//     giveCoin, fetchCoinDetails, fetchFilterByDept, fetchDept, fetchUserDetails,
//     filteredUserDetail, fetchFilteredUsers, clearFilteredUsers } = useFetchData(user?.token);
//   useEffect(() => {
//     if (user?.token) {
//       fetchCoinDetails();
//       fetchUserDetails()
//     }
//   }, [user?.token, fetchCoinDetails]);

//   const handleSearch = () => {
//     const cleanedName = userNameFilter.replace(/\s/g, '');

//     const filterPayload = {
//       logoN_NAME: '',
//       useR_NAME: cleanedName || '',
//       useR_POSITION: '',
//       branchCode: branchCodeFilter !== 'clearSite' ? branchCodeFilter : '',
//       branch: '',
//       displayName: '',
//       department: branchFilter !== 'clearDept' ? branchFilter : '',
//       position: '',
//       pageNumber: 1,
//       pageSize: 50,
//     };

//     setPage(1); // รีเซ็ตไปหน้าแรก
//     fetchFilteredUsers(filterPayload); // ส่งไปดึงข้อมูล
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilterData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchFilteredUsers(filterData);
//   };

//   useEffect(() => {
//     if (branchCodeFilter && user?.token) {
//       fetchDept(branchCodeFilter)
//         .then((response) => {
//           console.log("Full response:", response);  // ตรวจสอบ response ทั้งหมด
//           if (response && response.data) {
//             console.log("Fetched data:", response.data);  // ตรวจสอบข้อมูลที่ได้จาก API
//             // ไม่ต้องใช้ setDepartmentList ถ้าไม่ใช้งานข้อมูลนี้ใน UI
//           }
//         })
//         .catch((err) => {
//           console.error("Failed to fetch departments:", err);
//         });
//     }
//   }, [branchCodeFilter, user?.token]);

//   // ✅ 1. เลือก Site -> ดึง Department
//   useEffect(() => {
//     if (branchFilter) {
//       console.log('Fetching users with department:', branchFilter); // ตรวจสอบพารามิเตอร์ที่ส่ง
//       fetchFilterByDept(branchCodeFilter, branchFilter, 1, 50); // Fetch filtered users based on selected department
//       console.log("filterByDept:", filterByDept);

//     }
//   }, [branchFilter, fetchFilterByDept]);

//   // เมื่อเลือก Site
//   const handleBranchCodeChange = async (e) => {
//     const selectedSite = e.target.value;
//     setBranchCodeFilter(selectedSite);

//     // รีเซ็ตค่า Department ทันทีเป็น "clearDept"
//     setBranchFilter("clearDept");

//     if (selectedSite !== "clearSite") {
//       await fetchFilterByDept(); // โหลดข้อมูลใหม่ทันที
//     }
//   };

//   // เมื่อเลือกแผนก
//   const handleBranchChange = (e) => {
//     const selectedDepartment = e.target.value;
//     setBranchFilter(selectedDepartment);
//   };

//   // โหลดข้อมูลแผนกอัตโนมัติเมื่อเลือก Site ใหม่
//   useEffect(() => {
//     if (branchCodeFilter && branchCodeFilter !== "clearSite") {
//       fetchFilterByDept();
//     }
//   }, [branchCodeFilter]); // ทำงานเมื่อ branchCodeFilter เปลี่ยน



//   const handleCoinChange = (e) => {
//     const value = e.target.value;
//     // Ensure the value is a number between 1 and 50
//     if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
//       setCoinValue(value);
//     }
//   };

//   const handleTextChange = (e) => {
//     const value = e.target.value
//     setDesText(value);
//   }

//   const handleConfirmChange = (e) => setIsConfirmed(e.target.checked);

//   const handleGiveCoin = async (userId) => {
//     if (!coinValue || !recipientId) {
//       setError("Please enter a valid amount and select a recipient.");
//       return;
//     }

//     try {
//       await giveCoin(recipientId, coinValue, desText);
//       setCoinValue('');
//       setDesText('');
//       setIsConfirmed(false);
//       // เปิด Modal Success เมื่อให้เหรียญสำเร็จ
//       const modal = document.getElementById(`modal-${userId}`);
//       if (modal) {
//         modal.close();
//       }
//       const successModal = document.getElementById("success_modal");
//       if (successModal) {
//         successModal.showModal();
//         fetchCoinDetails()

//       }
//     } catch (err) {
//       // ตรวจสอบข้อผิดพลาดจาก API
//       if (err.status === 400) {
//         const errorModal = document.getElementById("error_modal");
//         if (errorModal) {
//           errorModal.showModal(); // เปิด Modal Error ถ้าเหรียญไม่พอ
//         }
//       } else {
//         setError("Failed to give coin. Please try again.");
//       }
//     }
//   };

//   const handleClearFilter = () => {
//     setBranchCodeFilter('');
//     setBranchFilter('');
//     setUserNameFilter('');
//     setFilterData({
//       logoN_NAME: '',
//       useR_NAME: '',
//       useR_POSITION: '',
//       branchCode: '',
//       displayName: '',
//       department: '',
//       branch: '',
//       position: '',
//       pageNumber: 1,
//       pageSize: 50,
//     });
//     clearFilteredUsers()
//     fetchUserDetails(); // โหลดข้อมูลใหม่ทั้งหมด
//   };


//   const openModal = (item, receiverId) => {
//     setRecipientId(receiverId);
//     document.getElementById(`modal-${item.a_USER_ID}`).showModal();
//   };

//   const closeModal = (userId) => {
//     setRecipientId(null);
//     setCoinValue("");
//     document.getElementById(`modal-${userId}`).close();
//   };

//   const filteredUsers = filteredUserDetail?.filter(user =>
//     branchCodeFilter !== "AUBR"
//       ? user.department !== userDetails?.department && user.a_USER_ID !== userDetails?.a_USER_ID
//       : true
//   );



//   return (
//     <div>
//       <div className="flex flex-col gap-5 justify-center items-center w-full text-button-text">
//         <div className="flex flex-col">
//           <div className="flex flex-row justify-center items-center gap-2">
//             <p className="text-4xl text-layer-item font-bold">{coinDetails?.thankCoinBalance}</p>
//             <img src="./3.png" className="w-10 h-10" />
//           </div>
//         </div>

//         <div className="flex flex-col w-full justify-center">
//           <div className="flex flex-col gap-3 mb-2 sm:flex-row">
//             {/* Site Filter */}
//             <div>
//               <label className="block mb-2 font-bold text-sm">* Site</label>
//               <select
//                 value={branchCodeFilter}
//                 onChange={handleBranchCodeChange}
//                 className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
//               >
//                 <option value="clearSite">Select Site</option>
//                 {['AUOF', 'AUFC', 'AUBR'].map((branchCode, index) => (
//                   <option key={index} value={branchCode}>{branchCode}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Department Filter */}
//             <div>
//               <label className="block mb-2 font-bold text-sm">* Department</label>
//               <select
//                 value={branchFilter}
//                 onChange={handleBranchChange}
//                 className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
//                 disabled={!branchCodeFilter || branchCodeFilter === "clearSite"}
//               >
//                 <option value="clearDept">Select Department</option>
//                 {department && department.length > 0 ? (
//                   department
//                     .slice()
//                     .sort((a, b) => a.departmentCode.localeCompare(b.departmentCode))
//                     .filter((dept) => {
//                       if (branchCodeFilter !== "AUBR") {
//                         return dept.departmentCode !== userDetails?.departmentCode;
//                       }
//                       return true;
//                     })
//                     .map((dept, index) => (
//                       <option key={index} value={dept.departmentCode}>
//                         {dept.departmentCode} - {dept.departmentName}
//                       </option>
//                     ))
//                 ) : (
//                   <option disabled>No departments available</option>
//                 )}
//               </select>
//             </div>

//             {/* User Name Filter */}
//             <div className="flex flex-row gap-2">
//               <div>
//                 <label className="block mb-2 font-bold text-sm">User Name</label>
//                 <input
//                   type="text"
//                   value={userNameFilter}
//                   onChange={(e) => setUserNameFilter(e.target.value)}
//                   placeholder="Enter name..."
//                   className="input input-bordered border-layer-item w-full max-w-xs bg-bg"
//                 />
//               </div>

//               <div className="flex items-end">
//                 <button
//                   onClick={handleSearch}
//                   className="btn btn-success rounded-badge text-bg"
//                 // disabled={!branchCodeFilter || branchCodeFilter === 'clearSite' || branchFilter === 'clearDept'}
//                 >
//                   <PersonSearchIcon />
//                 </button>
//               </div>
//               <div className="flex items-end">
//                 <button
//                   onClick={handleClearFilter}
//                   className="btn btn-error rounded-badge"
//                 // disabled={!branchCodeFilter || branchCodeFilter === 'clearSite' || branchFilter === 'clearDept'}
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* Display Filtered Users */}
//       <div>
//         <h4 className="text-sm font-bold text-button-text mb-4">Filtered Users</h4>
//         {filteredUsers?.length > 0 ? (
//           <div className="flex justify-center">
//             <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 justify-center">
//               {filteredUsers
//                 .map((item) => {
//                   console.log('item:', item); // ดูตรงนี้ว่ามี displayName มั้ย
//                   const isDisabled = coinDetails?.thankCoinBalance === 0;
//                   return (
//                     <div
//                       key={item.a_USER_ID}
//                       className={`p-2 border-2 border-layer-item bg-bg shadow-md rounded-xl flex flex-col items-center w-40 transition-transform duration-300 ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg"}`}
//                       onClick={() => {
//                         if (!isDisabled) {
//                           openModal(item, item.a_USER_ID);
//                         }
//                       }}

//                     >
//                       <div className="relative w-20 h-20">
//                         <img
//                           src={item?.imageUrls || 'profile.png'}
//                           className="w-full h-full rounded-full object-cover"
//                           alt="User Profile"
//                         />
//                       </div>

//                       <div className="mt-3 text-center">
//                         <p className="text-button-text font-semibold text-sm w-40 truncate p-2">{item.displayName || 'Unknown'}</p>
//                         <p className="text-gray-600 text-sm">{item.department}</p>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-600 mt-4">No matching users found.</p>
//         )}




//       </div>
//       {/* Modals */}
//       {
//         filteredUserDetail?.map((item) => (
//           <dialog id={`modal-${item.a_USER_ID}`} className="modal" key={`modal-${item.a_USER_ID}`}>
//             <div className="modal-box bg-bg">
//               <div className="flex flex-col items-center"> {/* Center content horizontally */}
//                 <div className="relative w-40 h-40 flex justify-center items-center"> {/* Center image */}
//                   <img
//                     src={item?.imageUrls || 'profile.png'}
//                     className="w-full h-full rounded-full object-cover"
//                   />
//                 </div>
//                 <h3 className="font-bold text-lg text-center mt-5 text-button-text">To {item.displayName}</h3> {/* Center text */}
//               </div>
//               <div className="py-4">
//                 <label className="block mb-2 font-medium text-center text-button-text">Enter Coin Amount (1-10)</label> {/* Center text */}
//                 <input
//                   type="number"
//                   className="input input-bordered w-full bg-bg border-heavy-color"
//                   value={coinValue}
//                   onChange={handleCoinChange}
//                   onKeyDown={(e) => {
//                     if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
//                       e.preventDefault(); // ป้องกันการกดปุ่มที่ไม่ต้องการ
//                     }
//                   }}
//                   inputMode="numeric" // แสดงคีย์บอร์ดตัวเลขบนมือถือ
//                 />
//                 <label className="block my-2 font-medium text-center text-button-text">Message</label>
//                 <input type="text" className="input input-bordered w-full bg-bg text-button-text"
//                   value={desText}
//                   maxLength={200}
//                   placeholder="Tell Something"
//                   onChange={handleTextChange}
//                 />

//                 {/* แสดงข้อความถ้าเหรียญไม่พอ
//               {coinDetails?.thankCoinConvert < coinValue && (
//                 <p className="text-red-500 text-center mt-4">{error}</p>
//               )} */}

//                 {/* ซ่อน checkbox ถ้าเหรียญไม่พอ */}
//                 {coinDetails?.thankCoinBalance >= coinValue && (
//                   <div className="mt-4 flex items-center justify-center"> {/* Center checkbox and label */}
//                     <input
//                       type="checkbox"
//                       id={`confirm-${item.a_USER_ID}`}
//                       className="checkbox mr-2 border-button-text"
//                       checked={isConfirmed}
//                       onChange={handleConfirmChange}
//                     />
//                     <label htmlFor={`confirm-${item.a_USER_ID}`} className="font-medium text-button-text">
//                       Coin given to {item.user_Name}: {coinValue} coins!
//                     </label>
//                   </div>
//                 )}
//               </div>
//               <div className="modal-action">
//                 <button
//                   className="btn bg-[#54d376] border-none w-24 rounded-badge text-white hover:bg-[#43af60]"
//                   disabled={!isConfirmed || !coinValue || coinDetails?.thankCoinBalance < coinValue}
//                   // onClick={handleGiveCoin}
//                   onClick={() => handleGiveCoin(item.a_USER_ID)} // ส่ง idx เข้าไป
//                 >
//                   Confirm
//                 </button>
//                 <button
//                   className="btn bg-[#ff6060] border-none w-24 rounded-badge text-white hover:bg-[#d44141]"
//                   onClick={() => closeModal(item.a_USER_ID)}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </dialog>


//         ))
//       }
//       {/* Error Modal */}
//       <dialog id="error_modal" className="modal">
//         <div className="modal-box bg-red-500 text-white text-center">
//           <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
//           <h3 className="text-xl font-bold">{error}</h3>
//           <button
//             className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
//             onClick={() => document.getElementById("error_modal").close()}
//           >
//             Close
//           </button>
//         </div>
//       </dialog>

//       {/* Success Modal */}
//       <dialog id="success_modal" className="modal">
//         <div className="modal-box bg-green-500 text-white text-center">
//           <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
//           <h3 className="text-xl font-bold">Give coin Successfully!</h3>
//           <p>You have successfully give coin...</p>
//           <button
//             className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
//             onClick={() => document.getElementById("success_modal").close()}
//           >
//             Close
//           </button>
//         </div>
//       </dialog>
//     </div >
//   );
// }

// export default GiveCoin;


import React, { useState, useEffect } from "react";
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';
import { UserFilters } from './UserFilters';
import { UserCard } from './UserCard';
import { UserCoinModal, ErrorModal, SuccessModal } from './UserModal';

function GiveCoin() {
  // State management
  const [coinValue, setCoinValue] = useState(" ");
  const [desText, setDesText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const [branchCodeFilter, setBranchCodeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [userNameFilter, setUserNameFilter] = useState('');
  const [errors, setErrors] = useState(null);
  
  const { user } = useAuth();
  const { 
    coinDetails, 
    userDetails, 
    department, 
    error,
    filteredUserDetail,
    giveCoin, 
    fetchCoinDetails, 
    fetchFilterByDept, 
    fetchDept, 
    fetchUserDetails,
    fetchFilteredUsers, 
    clearFilteredUsers 
  } = useFetchData(user?.token);

  useEffect(() => {
    if (user?.token) {
      fetchCoinDetails();
      fetchUserDetails();
    }
  }, [user?.token, fetchCoinDetails, fetchUserDetails]);

  // Filter functions
  const handleSearch = () => {
    const cleanedName = userNameFilter.replace(/\s/g, '');
    const filterPayload = {
      logoN_NAME: '',
      useR_NAME: cleanedName || '',
      useR_POSITION: '',
      branchCode: branchCodeFilter !== 'clearSite' ? branchCodeFilter : '',
      branch: '',
      displayName: '',
      department: branchFilter !== 'clearDept' ? branchFilter : '',
      position: '',
      pageNumber: 1,
      pageSize: 50,
    };
    fetchFilteredUsers(filterPayload);
  };

  const handleClearFilter = () => {
    setBranchCodeFilter('');
    setBranchFilter('');
    setUserNameFilter('');
    clearFilteredUsers();
    fetchUserDetails();
  };

  // Department filtering effects
  useEffect(() => {
    if (branchCodeFilter && user?.token) {
      fetchDept(branchCodeFilter)
        .catch(err => console.error("Failed to fetch departments:", err));
    }
  }, [branchCodeFilter, user?.token]);

  useEffect(() => {
    if (branchFilter) {
      fetchFilterByDept(branchCodeFilter, branchFilter, 1, 50);
    }
  }, [branchFilter, fetchFilterByDept]);

  const handleBranchCodeChange = async (e) => {
    const selectedSite = e.target.value;
    setBranchCodeFilter(selectedSite);
    setBranchFilter("clearDept");
    if (selectedSite !== "clearSite") {
      await fetchFilterByDept();
    }
  };

  // Coin handling
  const handleCoinChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
      setCoinValue(value);
    }
  };

  const handleGiveCoin = async (userId) => {
    if (!coinValue || !recipientId) {
      setErrors("Please enter a valid amount and select a recipient.");
      return;
    }

    try {
      await giveCoin(recipientId, coinValue, desText);
      setCoinValue('');
      setDesText('');
      setIsConfirmed(false);
      document.getElementById(`modal-${userId}`)?.close();
      document.getElementById("success_modal")?.showModal();
      fetchCoinDetails();
    } catch (err) {
      if (err.status === 400) {
        document.getElementById("error_modal")?.showModal();
      } else {
        setErrors("Failed to give coin. Please try again.");
      }
    }
  };

  // Modal handlers
  const openModal = (item, receiverId) => {
    setRecipientId(receiverId);
    document.getElementById(`modal-${item.a_USER_ID}`)?.showModal();
  };

  const closeModal = (userId) => {
    setRecipientId(null);
    setCoinValue("");
    document.getElementById(`modal-${userId}`)?.close();
  };

  const closeErrorModal = () => document.getElementById("error_modal")?.close();
  const closeSuccessModal = () => document.getElementById("success_modal")?.close();

  const filteredUsers = filteredUserDetail?.filter(user =>
    branchCodeFilter !== "AUBR"
      ? user.department !== userDetails?.department && user.a_USER_ID !== userDetails?.a_USER_ID
      : true
  );

  return (
    <div className="flex flex-col gap-5 justify-center items-center w-full text-button-text">
      {/* Coin Balance Display */}
      <div className="flex flex-col">
        <div className="flex flex-row justify-center items-center gap-2">
          <p className="text-4xl text-layer-item font-bold">{coinDetails?.thankCoinBalance.toLocaleString()}</p>
          <img src="./3.png" className="w-10 h-10" alt="Coin" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col w-full justify-center">
        <UserFilters
          branchCodeFilter={branchCodeFilter}
          branchFilter={branchFilter}
          userNameFilter={userNameFilter}
          department={department}
          userDetails={userDetails}
          onBranchCodeChange={handleBranchCodeChange}
          onBranchChange={(e) => setBranchFilter(e.target.value)}
          onUserNameChange={(e) => setUserNameFilter(e.target.value)}
          onSearch={handleSearch}
          onClearFilter={handleClearFilter}
        />
      </div>

      {/* User List */}
      <div className="w-full">
        <h4 className="text-sm font-bold text-button-text mb-4">Filtered Users</h4>
        {filteredUsers?.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 justify-center">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.a_USER_ID}
                  user={user}
                  coinBalance={coinDetails?.thankCoinBalance}
                  onClick={() => openModal(user, user.a_USER_ID)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No matching users found.</p>
        )}
      </div>

      {/* Modals */}
      {filteredUserDetail?.map((user) => (
        <UserCoinModal
          key={`modal-${user.a_USER_ID}`}
          user={user}
          coinValue={coinValue}
          desText={desText}
          isConfirmed={isConfirmed}
          coinBalance={coinDetails?.thankCoinBalance}
          onCoinChange={handleCoinChange}
          onTextChange={(e) => setDesText(e.target.value)}
          onConfirmChange={(e) => setIsConfirmed(e.target.checked)}
          onGiveCoin={() => handleGiveCoin(user.a_USER_ID)}
          onClose={() => closeModal(user.a_USER_ID)}
        />
      ))}

      <ErrorModal error={error} onClose={closeErrorModal} />
      <SuccessModal onClose={closeSuccessModal} />
    </div>
  );
}

export default GiveCoin;