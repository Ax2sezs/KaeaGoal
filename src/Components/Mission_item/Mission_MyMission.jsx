import React, { useState, useEffect } from "react";
import { useAuth } from "../APIManage/AuthContext";
import useFetchData from "../APIManage/useFetchData";
import ModalMission from "./Modal/ModalMyMission";
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GroupIcon from '@mui/icons-material/Group';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import ModalDetail from "./Modal/ModalDetail";
import CountdownTimer from "./CountdownTimer";

const MissionCard = ({ mission, onClick }) => {
  const isWaiting = mission.verification_Status.toLowerCase() === "waiting for confirmation.";
  const isReject = mission.verification_Status === "Rejected";
  const currentDate = new Date();
  const isExpired = mission.expire_Date && new Date(mission.expire_Date) < currentDate;

  return (
    <div
      className={`relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg ${isWaiting || isExpired || isReject ? "" : "hover:scale-105 transition-transform duration-300 ease-in-out"}`}
      // onClick={() => !(isWaiting || isExpired || isReject) && onClick(mission)}
      onClick={() => {
        if (isWaiting || isReject || isExpired) {
          // เปิด ModalDetail สำหรับกรณี Waiting หรือ Reject
          onClick({ ...mission, showDetail: true });
        } else {
          // เปิด Modal ปกติสำหรับกรณีอื่นๆ ที่ไม่ใช่ Expired
          onClick(mission);
        }
      }}
      style={{ position: "relative" }}
    >
      {/* Image */}
      <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
        <img
          src={mission.mission_Image[0] || "fallback-image.jpg"}
          alt={mission.mission_Name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className='absolute top-2 right-2 flex items-center'>
        <span className={`flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 font-bold text-green-500`}>
          <img src="./1.png" alt="Coin Icon" className="w-6 h-6" />
          {mission.coin_Reward.toLocaleString() || 0} Pts
        </span>
      </div >
      <div className='absolute bottom-20 right-2 flex items-center'>
        <span className={"flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 text-green-500"}>
          <GroupIcon /> {mission?.current_Accept.toLocaleString()}/{mission?.accept_limit.toLocaleString()}
        </span>
      </div>
      {mission?.is_Public && (
        <div className='absolute top-2 left-2 flex items-center'>
          <span className="flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 text-red-500 font-bold">
            <WorkspacePremiumIcon />
            Public to Community
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-3 w-full flex flex-col justify-between">
        <div className="flex flex-row justify-between">
          <h3 className="font-bold text-lg text-gray-800 truncate w-48 lg:w-52">
            {mission.mission_Name}
          </h3>
          <p className="text-lg text-gray-600 justify-end flex">
            {mission.verification_Status.toLowerCase() === "waiting for confirmation." ? "Waiting" : mission.verification_Status}
          </p>

        </div>
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">
            {mission.mission_Type}
          </p>
          <p className="text-sm text-gray-600">
            {/* <strong>Exp:</strong> {mission.expire_Date ? new Date(mission.expire_Date).toLocaleDateString('th-TH') : 'No Date'} */}
            <CountdownTimer expireDate={mission.expire_Date} />
          </p>
        </div>
      </div>

      {/* Overlay for "Waiting for confirmation" */}
      {isWaiting && !isExpired && !isReject && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center rounded-xl">
          <div className="flex flex-col text-center">
            <span className="text-white font-bold text-xl">Waiting for Admin</span>
            <span className="text-white text-xl">
              Send Date: {mission.submitted_At ? new Date(mission.submitted_At).toLocaleDateString('th-TH') : 'No Date'}
            </span>
          </div>
        </div>
      )}

      {/* Overlay for "Expired" */}
      {isExpired && !isReject && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center rounded-xl">
          <span className="text-white font-bold text-xl">EXPIRED</span>
        </div>
      )}

      {/* Overlay for "Rejected" */}
      {isReject && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center rounded-xl">
          <div className="flex flex-col">
            <span className="text-bg font-bold text-xl text-center">Rejected <CloseOutlinedIcon fontSize='large' className='text-red-500' /></span>
            <span className="text-bg text-center p-2">
              Reason: {mission.accepted_Desc}<br></br><br></br>
              ไม่เป็นไรนะ 😊
              เรายังมีภารกิจสนุกๆ รออยู่อีกเยอะเลย มาร่วมสนุกกันใหม่
            </span>
          </div>
        </div>
      )}

    </div>
  );
};


function Mission_MyMission({ isTableLayout }) {
  const { user } = useAuth();
  const { userMission = [], error, isLoading, executeVideoMission, executeCodeMission, executeQRMission, executePhotoMission, executeTextMission, fetchUserMissions } = useFetchData(user?.token);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  useEffect(() => {
    if (user?.token) {
      fetchUserMissions();
    }
  }, [user?.token, fetchUserMissions]);

  // const handleModalOpen = (mission) => {
  //   setSelectedMission(mission);
  //   setIsModalOpen(true);
  // };
  const handleModalOpen = (mission) => {
    if (mission.showDetail) {
      // แสดง ModalDetail สำหรับกรณี Waiting หรือ Reject
      setSelectedMission(mission);
      setIsDetailModalOpen(true);
    } else {
      // แสดง Modal ปกติ
      setSelectedMission(mission);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setSelectedMission(null);
    setIsModalOpen(false);
    setModalError("");
    setModalSuccess("");
  };

  const handleDetailModalClose = () => {
    setSelectedMission(null);
    setIsDetailModalOpen(false);
    setModalError("");
    setModalSuccess("");
  };

  const handleSubmitCode = async (missionCode) => {
    if (!selectedMission) return;

    try {
      const { missioN_ID } = selectedMission;
      await executeCodeMission(missioN_ID, missionCode);
      console.log("Mission code executed successfully!");
      setTimeout(() => handleModalClose(), 100);

      setModalError("");
      setModalSuccess(document.getElementById('success_modal').showModal()
      );

      fetchUserMissions()
    } catch (err) {
      console.error("Failed to execute mission code", err);
      setModalError(document.getElementById('error_modal').showModal())
    }
  };

  const handleSubmitQRCode = async (qrCode) => {
    if (!selectedMission) return;

    try {
      const { missioN_ID, useR_MISSION_ID } = selectedMission;
      await executeQRMission(missioN_ID, useR_MISSION_ID, qrCode);
      console.log("QR Code mission executed successfully!");
      setTimeout(() => handleModalClose(), 100);
      setModalError("");
      setModalSuccess(document.getElementById('success_modal').showModal())

      fetchUserMissions()
    } catch (err) {
      console.error("Failed to execute QR code mission", err);
      setModalError(document.getElementById('error_modal').showModal())
    }
  };

  const handleSubmitPhoto = async (imageFiles) => {
    if (!selectedMission || imageFiles.length === 0) {
      setModalError("No files selected. Please try again.");
      return;
    }

    try {
      const { missioN_ID, useR_MISSION_ID } = selectedMission;
      await executePhotoMission(missioN_ID, useR_MISSION_ID, imageFiles); // Pass array
      console.log("Photo mission executed successfully!");
      setModalError("");
      setTimeout(() => handleModalClose());
      setModalSuccess(document.getElementById('success_modal').showModal())
      fetchUserMissions()
    } catch (err) {
      console.error("Failed to execute Photo mission", err);
      setModalError("Failed to execute Photo mission. Please try again.");
    }
  };

  const handleSubmitVideo = async (videoFile) => {
    // ตรวจสอบว่า videoFile ถูกตั้งค่าหรือไม่
    console.log("Video File:", videoFile);
    if (videoFile.length === 0) {
      setModalError("No video selected. Please try again.");
      return;
    }

    try {
      // ใช้ชื่อที่ตรงกับ selectedMission
      const { missioN_ID, useR_MISSION_ID } = selectedMission;
      console.log("Mission ID:", missioN_ID);
      console.log("User Mission ID:", useR_MISSION_ID);

      // ตรวจสอบว่าทั้ง missioN_ID, useR_MISSION_ID, videoFile มีค่าถูกต้องหรือไม่
      if (!missioN_ID || !useR_MISSION_ID || videoFile.length === 0) {
        throw new Error("Required data is missing!");
      }

      // เรียกใช้งาน executeVideoMission
      await executeVideoMission(missioN_ID, useR_MISSION_ID, videoFile);
      setModalError("");
      setTimeout(() => handleModalClose());
      setModalSuccess(document.getElementById('success_modal').showModal());
      fetchUserMissions();
    } catch (err) {
      console.error("Failed to execute Video mission", err);
      setModalError("Failed to execute video mission. Please try again.");
    }
  };

  const handleSubmitText = async (inputText) => {
    if (!selectedMission || !inputText.trim()) {
      setModalError("Invalid mission or empty text. Please try again.");
      return;
    }

    try {
      const { missioN_ID, useR_MISSION_ID } = selectedMission;

      // Log ข้อมูลที่ถูกส่งไป
      console.log("Sending the following data to API:");
      console.log({
        missioN_ID,
        useR_MISSION_ID,
        inputText
      });

      await executeTextMission(missioN_ID, useR_MISSION_ID, inputText);
      console.log("Text mission executed successfully!");

      setModalError("");
      setTimeout(() => handleModalClose(), 100);
      setModalSuccess(document.getElementById('success_modal').showModal());

      fetchUserMissions();
    } catch (err) {
      console.error("Failed to execute text mission", err);
      setModalError(document.getElementById('error_modal').showModal());
    }
  };



  const sortedMissions = userMission
    .slice()
    .sort((a, b) => {
      const aIsWaiting = a.verification_Status.toLowerCase() === "waiting for confirmation.";
      const bIsWaiting = b.verification_Status.toLowerCase() === "waiting for confirmation.";

      const aIsRejected = a.verification_Status === "Rejected";
      const bIsRejected = b.verification_Status === "Rejected";

      const aIsExpired = a.expire_Date && new Date(a.expire_Date) < new Date();
      const bIsExpired = b.expire_Date && new Date(b.expire_Date) < new Date();

      // ✅ Normal comes first (ไม่ใช่ Waiting, Rejected, Expired)
      if (!aIsWaiting && !aIsRejected && !aIsExpired && (bIsWaiting || bIsRejected || bIsExpired)) return -1;
      if (!bIsWaiting && !bIsRejected && !bIsExpired && (aIsWaiting || aIsRejected || aIsExpired)) return 1;

      // ✅ Waiting for Confirmation comes second
      if (aIsWaiting && !bIsWaiting) return -1;
      if (bIsWaiting && !aIsWaiting) return 1;

      // ✅ Rejected comes third
      if (aIsRejected && !bIsRejected) return -1;
      if (bIsRejected && !aIsRejected) return 1;

      // ✅ Expired comes last
      if (aIsExpired && !bIsExpired) return 1;
      if (bIsExpired && !aIsExpired) return -1;

      // ✅ ถ้า status เดียวกัน → เรียงตาม accepted_Date ใหม่สุดขึ้นก่อน
      const dateA = new Date(a.accepted_Date || 0);
      const dateB = new Date(b.accepted_Date || 0);
      return dateB - dateA;
    });

  return (
    <div>
      {isLoading ? (
        <div className="text-center text-gray-500">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : sortedMissions.length <= 0 ? (
        <div className="text-center text-gray-500 mt-5 flex justify-center items-center gap-3">
          <img src="coming.gif" className="w-16 h-16" />
          <p className=''>No Available Missions</p>
        </div>
      ) : null}


      {/* Display missions in grid layout */}
      {!isTableLayout ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-5 items-center p-3 mb-16 h-auto bg-bg rounded-xl">
          {sortedMissions.map((mission) => (
            <MissionCard key={mission.missioN_ID} mission={mission} onClick={handleModalOpen} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border-hidden bg-bg rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="w-24"></th>
                <th className="w-32"></th>
                <th className="w-28"></th>
              </tr>
            </thead>
            <tbody>
              {sortedMissions.map((item, index) => (
                <tr
                  key={index}
                  className={`text-gray-600 border-b border-gray-300 ${item.verification_Status === "Waiting for Confirmation"
                    ? "opacity-50"
                    : ""
                    }`}
                >
                  <td className="p-4 rounded-2xl">
                    <img
                      src={item.mission_Image[0] || "fallback-image.jpg"}
                      alt={item.mission_Name}
                      className="w-full h-16 object-cover rounded-2xl md:h-32"
                    />
                  </td>
                  <td className="px-3 py-2 text-left truncate">
                    <div className="flex flex-col w-full overflow-hidden">
                      <span className="font-bold text-xs text-button-text truncate w-full whitespace-nowrap md:text-lg">
                        Mission: {item.mission_Name}
                      </span>
                      <span className="flex items-center text-button-text text-xs font-semibold mt-1 md:text-sm">
                        Mission Type: {item.mission_Type}
                      </span>
                      <span className="text-xs text-button-text mt-1 font-bold md:text-sm">
                        Status: {item.verification_Status}
                      </span>
                      <span className="text-xs text-button-text mt-1 font-bold md:text-sm">
                        Exp: {item.expire_Date ? new Date(item.expire_Date).toLocaleDateString('th-TH') : 'No Date'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center truncate" style={{ width: "8rem" }}>
                    {item.verification_Status !== "Waiting for Confirmation." && item.verification_Status !== "Rejected" ? (
                      <div className="flex flex-col items-center">
                        <button
                          className="btn btn-md w-20 bg-layer-item text-white px-4 py-2 rounded-badge border-hidden hover:bg-heavy-color mb-2"
                          onClick={() => handleModalOpen(item)}
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center">
                        <span className="text-lg text-gray-500">
                          {item.verification_Status !== "In progress" ? "Waiting" : "Rejected"}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog id="error_modal" className="modal">
        <div className="modal-box bg-red-500 text-white text-center">
          <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>

          <h3 className="text-xl font-bold">Incorrect</h3>
          <button
            className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
            onClick={() => document.getElementById("error_modal").close()}  // ปิด modal
          >
            Close
          </button>
        </div>
      </dialog>
      {/* Success Modal - เมื่อแลกของรางวัลสำเร็จ */}
      <dialog id="success_modal" className="modal">
        <div className="modal-box bg-green-500 text-white text-center">
          <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">Successfully !</h3>
          <p>You have successfully mission. . . </p>
          <button
            className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
            onClick={() => document.getElementById("success_modal").close()} // ปิด modal
          >
            Close
          </button>
        </div>
      </dialog>

      {isModalOpen && (
        <ModalMission
          mission={selectedMission}
          missionType={selectedMission?.mission_Type}
          onSubmitCode={handleSubmitCode}
          onSubmitQRCode={handleSubmitQRCode}
          onSubmitPhoto={handleSubmitPhoto}
          onSubmitVideo={handleSubmitVideo}
          onSubmitText={handleSubmitText}
          executeTextMission={handleSubmitText}  // ส่งผ่าน executeTextMission
          onClose={handleModalClose}
          modalError={modalError}
          modalSuccess={modalSuccess}
        />

      )}
      {isDetailModalOpen && (
        <ModalDetail
          mission={selectedMission}
          onClose={handleDetailModalClose}
        />
      )}


    </div>
  );
}

export default Mission_MyMission;
