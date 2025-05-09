import React, { useState, useEffect } from 'react';
import CreateMissionForm from './CreateMissionForm';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';  // Assuming this is your custom hook/context
import ModalPreview from './ModalPreview'; // Import the new ModalPreview component
import EditMission from './EditMission';

const Admin_UpdateMission = () => {
  const { user } = useAuth();
  const { allMission = [], error, isLoading, fetchAllMissions } = useFetchData(user?.token);
  const sortedMissions = [...allMission].sort((a, b) => new Date(b.start_Date) - new Date(a.start_Date));

  // State to handle modal visibility and selected mission details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);

  // State to handle QR code full-size modal visibility
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [editMissionData, setEditMissionData] = useState(null);

  const handleEditMission = (mission) => {
    setEditMissionData(mission);
    document.getElementById('edit_mission_modal').showModal();
  };


  const filteredMissions = sortedMissions.filter((mission) =>
    mission.missioN_NAME.toLowerCase().includes(searchName.toLowerCase()) &&
    mission.missioN_TYPE.toLowerCase().includes(searchType.toLowerCase()) &&
    (!searchDate || new Date(mission.start_Date).toISOString().split('T')[0] === searchDate)
  );
  useEffect(() => {
    if (user?.token) {
      fetchAllMissions()
    }
  }, [user?.token, fetchAllMissions]);

  const openModal = (mission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMission(null);
  };

  const openQRCodeModal = (qrCodeUrl) => {
    setSelectedQRCode(qrCodeUrl);
    setIsQRCodeModalOpen(true);
  };

  const closeQRCodeModal = () => {
    setIsQRCodeModalOpen(false);
    setSelectedQRCode(null);
  };

  return (
    <div className="bg-bg w-full rounded-2xl min-h-screen p-3">

      <div className="admin-mission-container">
        <h2 className="text-2xl font-bold mb-6 text-button-text">Admin Missions</h2>
        <div className='text-button-text flex gap-5 text-lg'>
          <h2>ALL MISSION : {allMission.length}</h2>
          <h2>Code : {allMission.filter(m => m.missioN_TYPE === "Code").length}</h2>
          <h2>Photo : {allMission.filter(m => m.missioN_TYPE === "Photo").length}</h2>
          <h2>Text : {allMission.filter(m => m.missioN_TYPE === "Text").length}</h2>
          {/* <h2>QR : {allMission.filter(m => m.missioN_TYPE === "QR").length}</h2> */}
        </div>
        {/* Filter Section */}
        <div className="mb-4 flex flex-wrap gap-4 text-button-text">
          <input
            type="text"
            placeholder="Search Mission Name"
            className="input input-bordered w-full max-w-xs border-button-text bg-bg"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className="select select-bordered bg-bg border-button-text w-full max-w-xs"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Code">Code</option>
            <option value="Photo">Photo</option>
            <option value="Text">Text</option>
            {/* <option value="QR">QR</option> */}
          </select>

          <input
            type="date"
            className="input input-bordered w-full max-w-xs bg-button-text text-bg border-button-text"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>

        {/* Missions Table */}
        <div className="mission-list overflow-x-auto">
          {isLoading ? (
            <div className="text-center text-gray-500">
              <span className="loading loading-dots loading-lg bg-bg"></span>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : allMission.length === 0 ? (
            <p>No missions available</p>
          ) : (
            <table className="min-w-full table-fixed border-collapse border border-gray-300 text-button-text">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 w-32">Mission Name</th>
                  {/* <th className="border border-gray-300 p-2 w-16">Type</th> */}
                  <th className="border border-gray-300 p-2 w-16">Site</th>
                  <th className="border border-gray-300 p-2 w-32">Coin Reward</th>
                  {/* <th className="border border-gray-300 p-2 w-32">Mission Points</th> */}
                  <th className="border border-gray-300 p-2 w-32">Start Date</th>
                  <th className="border border-gray-300 p-2 w-32">Expire Date</th>
                  {/* <th className="border border-gray-300 p-2 w-32">Description</th> */}
                  {/* <th className="border border-gray-300 p-2 w-32">Current</th>
                  <th className="border border-gray-300 p-2 w-32">Limit</th> */}
                  <th className="border border-gray-300 p-2 w-32">Participants</th>
                  <th className="border border-gray-300 p-2 w-32">is Public</th>
                  {/* <th className="border border-gray-300 p-2 w-32">Code Mission</th> */}
                  <th className="border border-gray-300 p-2 w-32"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMissions.map((mission) => (
                  <tr key={mission.missioN_ID} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 w-32">{mission.missioN_NAME}</td>
                    {/* <td className="border border-gray-300 p-2 w-16">{mission.missioN_TYPE}</td> */}
                    <td className="border border-gray-300 p-2 w-16">{mission.participate_Type}</td>
                    <td className="border border-gray-300 p-2 w-32">{mission.coin_Reward}</td>
                    {/* <td className="border border-gray-300 p-2 w-32">{mission.mission_Point}</td> */}
                    {/* <td className="border border-gray-300 p-2 w-32">{new Date(mission.start_Date).toLocaleString('TH-th')}</td>
                    <td className="border border-gray-300 p-2 w-32">{new Date(mission.expire_Date).toLocaleString('TH-th')}</td> */}

                    <td className="border border-gray-300 p-2 w-32">{new Date(mission.start_Date).toLocaleDateString('th-TH', { day: 'numeric', month: 'numeric', year: 'numeric' })
                  }</td>
                    <td className="border border-gray-300 p-2 w-32">{new Date(mission.expire_Date).toLocaleDateString('th-TH', { day: 'numeric', month: 'numeric', year: 'numeric' })
                  }</td>

                    {/* Description Column with Truncation */}
                    {/* <td className="border border-gray-300 p-2 w-32">
                      <div className="truncate max-w-60">
                        {mission.description}
                      </div>
                    </td> */}

                    {/* <td className="border border-gray-300 p-2 w-32">{mission.current_Accept.toLocaleString()}</td> */}
                    <td className="border border-gray-300 p-2 w-32 text-center">{mission.current_Accept.toLocaleString()} / {mission.accept_limit.toLocaleString()}</td>
                    <td className="border border-gray-300 p-2 w-32">
                      {mission.is_Public ? 'Public' : '-'}
                    </td>

                    {/* Combined QR and Code Mission Column */}
                    {/* <td className="border border-gray-300 p-2 w-32">
                      <div>
                        {mission.codeMission && (
                          <p><strong>Code:</strong> {mission.codeMission}</p>
                        )}
                        {mission.qrMission && mission.qrMission !== '' && (
                          <img
                            src={mission.qrMission}
                            alt="QR Code"
                            className="w-16 h-16 object-cover rounded-lg mt-2 cursor-pointer"
                            onClick={() => openQRCodeModal(mission.qrMission)} // Open QR code in full size
                          />
                        )}
                      </div>
                    </td> */}

                    {/* Preview Column with only the Preview Button */}
                    <td className="border border-gray-300 p-2 w-32">
                      {/* <button
                        className="btn btn-info btn-outline rounded-badge w-full text-button-text"
                        onClick={() => openModal(mission)} // Open modal on button click
                      >
                        Preview
                      </button> */}
                      <div className='flex w-full justify-center'>
                      <button
                        className="btn btn-success btn-sm text-bg w-1/2"
                        onClick={() => handleEditMission(mission)}
                      >
                        Edit
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Fixed button to open create mission modal */}
        <div className="fixed top-20 right-5">
          <button
            className="btn bg-layer-item text-bg border-hidden hover:bg-heavy-color"
            onClick={() => document.getElementById('create_mission_modal').showModal()}
          >
            + Create Mission
          </button>
        </div>

        {/* Modal for full-size mission preview */}
        <ModalPreview
          isOpen={isModalOpen}
          onClose={closeModal}
          mission={selectedMission}
        />

        {/* Modal for QR code full-size */}
        {isQRCodeModalOpen && (
          <dialog className="modal modal-open bg-bg">
            <div className="modal-box w-full p-6 space-y-6 bg-bg">
              <h3 className="text-2xl font-bold mb-4">QR Code Preview</h3>
              <div className="relative w-auto h-auto flex justify-center items-center bg-bg rounded-xl shadow-lg">
                <img
                  src={selectedQRCode}
                  alt="Full-size QR Code"
                  className="w-60 h-60 object-contain rounded-xl"
                />
              </div>
              <div className="modal-action">
                <button className="btn btn-error" onClick={closeQRCodeModal}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Modal for creating a mission */}
        <dialog id="create_mission_modal" className="modal">
          <div className="modal-box bg-white text-gray-800 rounded-xl shadow-xl p-6 max-w-2xl">
            <h3 className="font-bold text-lg">Create Mission</h3>
            <CreateMissionForm onClose={() => document.getElementById('create_mission_modal').close()}
              onSuccess={fetchAllMissions} // Pass the success callback
            />
            <div className="modal-action"></div>
          </div>
        </dialog>
        <dialog id="edit_mission_modal" className="modal">
          <div className="modal-box bg-white text-gray-800 rounded-xl shadow-xl p-6 max-w-2xl">
            <EditMission
              initialData={editMissionData}
              onClose={() => document.getElementById('edit_mission_modal').close()}
              onSuccess={fetchAllMissions}
            />
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Admin_UpdateMission;
