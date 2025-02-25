import React, { useState } from "react";
import { useAuth } from "../APIManage/AuthContext";
import useFetchData from "../APIManage/useFetchData";
import ModalMission from "./Modal/ModalMyMission";
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const MissionCard = ({ mission, onClick }) => {
  const isWaiting = mission.verification_Status === "Waiting for Confirmation.";

  return (
    <div
      className={`relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg ${isWaiting ? "" : "hover:scale-105 transition-transform duration-300 ease-in-out"
        }`}
      onClick={() => !isWaiting && onClick(mission)}
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

      {/* Content */}
      <div className="p-3 w-full flex flex-row justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg text-gray-800 truncate">
            {mission.mission_Name}
          </h3>
          <p className="text-sm text-gray-600">
            <strong>Type: </strong> {mission.mission_Type}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-ls text-gray-600">
            <strong>Status: </strong>
          </p>
          <p className="">
            {mission.verification_Status}
          </p>
        </div>
      </div>

      {/* Overlay for "Waiting for confirmation" */}
      {isWaiting && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center rounded-xl">
          <span className="text-white font-bold text-xl">Waiting for Admin</span>
        </div>
      )}
    </div>
  );
};

function Mission_MyMission({ isTableLayout }) {
  const { user } = useAuth();
  const { userMission = [], error, isLoading, executeCodeMission, executeQRMission, executePhotoMission, refetch } = useFetchData(user?.token);
  const [selectedMission, setSelectedMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const handleModalOpen = (mission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedMission(null);
    setIsModalOpen(false);
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

      refetch()
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

      refetch()
    } catch (err) {
      console.error("Failed to execute QR code mission", err);
      setModalError(document.getElementById('error_modal').showModal())
    }
  };

  const handleSubmitPhoto = async (imageFiles) => {
    if (!selectedMission || imageFiles.length === 0) {
      setModalError("Invalid mission or no files selected. Please try again.");
      return;
    }

    try {
      const { missioN_ID, useR_MISSION_ID } = selectedMission;
      await executePhotoMission(missioN_ID, useR_MISSION_ID, imageFiles); // Pass array
      console.log("Photo mission executed successfully!");
      setModalError("");
      setTimeout(() => handleModalClose());
      setModalSuccess(document.getElementById('success_modal').showModal())
      refetch()
    } catch (err) {
      console.error("Failed to execute Photo mission", err);
      setModalError("Failed to execute Photo mission. Please try again.");
    }
  };

  const sortedMissions = userMission
    .slice()
    .sort((a, b) => (a.verification_Status === "Waiting for Confirmation." ? 1 : -1));

  return (
    <div>
      {isLoading &&
        <div className="text-center text-gray-500">
          <span className="loading loading-dots loading-lg"></span>
        </div>}

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
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center truncate" style={{ width: "8rem" }}>
                    {item.verification_Status !== "Waiting for Confirmation." ? (
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
                          Awaiting Confirmation
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

          <h3 className="text-xl font-bold">Incorrect Code</h3>
          <button
            className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 hover:bg-bg"
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
          <h3 className="text-xl font-bold"> Redeemed Successfully!</h3>
          <p>You have successfully redeemed. . . </p>
          <button
            className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 hover:bg-bg"
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
          onClose={handleModalClose}
          modalError={modalError}
          modalSuccess={modalSuccess}
        />
      )}
    </div>
  );
}

export default Mission_MyMission;
