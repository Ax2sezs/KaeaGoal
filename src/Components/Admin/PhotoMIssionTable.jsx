import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PhotoMissionTable = ({ alluserDetail, allMission, ApprovePhoto, approvePhoto, addAllCoinPhoto, isLoading, error, refetch }) => {
    const [photoMissions, setPhotoMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [selectedMissions, setSelectedMissions] = useState([]);
    const [coinAmount, setCoinAmount] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedMissionId, setSelectedMissionId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedMissionName, setSelectedMissionName] = useState("all");

    useEffect(() => {
        const mappedPhotoMissions = ApprovePhoto.map(mission => ({
            ...mission,
            userPhotoMissionId: mission.useR_PHOTO_MISSION_ID,
        }));
    
        mappedPhotoMissions.sort((a, b) => (a.approve === null ? -1 : 1) - (b.approve === null ? -1 : 1));
        setPhotoMissions(mappedPhotoMissions);
    
        // ใช้ filter จากค่า selectedMissionName ที่เลือกไว้
        if (selectedMissionName === "all") {
            setFilteredMissions(mappedPhotoMissions);
        } else {
            setFilteredMissions(mappedPhotoMissions.filter(m => m.missioN_ID === selectedMissionName));
        }
    }, [ApprovePhoto, selectedMissionName]); // ✅ เพิ่ม selectedMissionName เป็น dependency
    

    useEffect(() => {
        if (selectedMissionName !== "all" && Array.isArray(allMission)) {
            const missionData = allMission.find(ms => ms.missioN_ID === selectedMissionName);
            setCoinAmount(missionData?.coin_Reward || 0);
        } else {
            setCoinAmount(0);
        }
    }, [selectedMissionName, allMission]);

    useEffect(() => {
        const storedMissionId = localStorage.getItem("selectedMissionId");
        if (storedMissionId) {
            setSelectedMissionName(storedMissionId);
        }
    }, []);

    const handleMissionFilter = (e) => {
        const missionId = e.target.value;
        setSelectedMissionName(missionId);
        localStorage.setItem("selectedMissionId", missionId);

        if (missionId === "all") {
            setFilteredMissions(photoMissions);
        } else {
            setFilteredMissions(photoMissions.filter(mission => mission.missioN_ID === missionId));
        }
    };

    const uniqueMissions = Array.from(
        new Map(photoMissions.map(mission => [mission.missioN_ID, mission.missioN_NAME])).entries()
    );

    const handleAction = async (missionId, isApproved) => {
        try {
            await approvePhoto(missionId, isApproved);
            setFilteredMissions(filteredMissions.filter(m => m.userPhotoMissionId !== missionId));
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch();
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    const handleImageClick = (missionId, imgUrl, index) => {
        setSelectedMissionId(missionId);
        setSelectedImageIndex(index);
        setOpenModal(true);
    };

    const handleNextImage = () => {
        const mission = filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId);
        if (mission && selectedImageIndex < mission.photo.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handlePreviousImage = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedImageIndex(null);
        setSelectedMissionId(null);
    };

    const handleCheckboxChange = (missionId) => {
        setSelectedMissions(prevSelected =>
            prevSelected.includes(missionId)
                ? prevSelected.filter(id => id !== missionId)
                : [...prevSelected, missionId]
        );
    };

    const handleSelectAll = () => {
        const selectableMissions = filteredMissions.filter(m => m.approve === null || m.approve === true);

        if (selectedMissions.length === selectableMissions.length) {
            setSelectedMissions([]);
        } else {
            setSelectedMissions(selectableMissions.map(m => m.userPhotoMissionId)); // ✅ เลือกเฉพาะ approve === null หรือ true
        }
    };

    const handleAddAllCoin = async () => {
        if (selectedMissions.length === 0) {
            alert("Please select at least one mission.");
            return;
        }

        if (coinAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (selectedMissionName === "all") {
            alert("Please select a specific mission before adding coins.");
            return;
        }

        try {
            await addAllCoinPhoto(selectedMissionName, coinAmount);
            alert(`Successfully added ${coinAmount} coins to mission ID: ${selectedMissionName}!`);

            setSelectedMissions([]);

            if (Array.isArray(allMission)) {
                const missionData = allMission.find(ms => ms.missioN_ID === selectedMissionName);
                setCoinAmount(missionData?.coin_Reward || 0);
            } else {
                setCoinAmount(0);
            }

            refetch();
        } catch (err) {
            console.error("Error adding coins:", err);
            alert("An error occurred while adding coins.");
        }
    };

    const handleApproveAll = async () => {
        try {
            const unapprovedMissions = filteredMissions.filter(m => selectedMissions.includes(m.userPhotoMissionId) && m.approve === null);
            if (unapprovedMissions.length === 0) {
                alert("Please select at least one unapproved mission.");
                return;
            }

            await Promise.all(unapprovedMissions.map(mission => approvePhoto(mission.userPhotoMissionId, true)));
            alert("All selected missions approved successfully!");
            refetch();
            setSelectedMissions([]);
        } catch (err) {
            console.error("Error approving all selected missions:", err);
            alert("An error occurred while approving all missions.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-button-text">Photo Missions</h2>

            {/* 🔹 Mission Name Filter */}
            <div className="p-3">
                <select onChange={handleMissionFilter} value={selectedMissionName} className="select select-sm select-error bg-bg text-button-text">
                    <option value="all">Select Mission</option>
                    {uniqueMissions.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
            </div>

            {/* 🔹 Select All + Amount + Add Coin */}
            <div className="p-3 flex gap-4 items-center">
                <input
                    type="checkbox"
                    className="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedMissions.length > 0 && selectedMissions.length === filteredMissions.filter(m => m.approve === null || m.approve === true).length}
                />
                <label className="text-button-text">Select All</label>

                <input
                    type="number"
                    className="input input-bordered input-sm bg-bg border-button-text p-1 w-14 text-button-text"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    placeholder="Amount"
                    readOnly
                />
                <button className="btn btn-primary btn-sm" onClick={handleAddAllCoin} disabled={selectedMissions.length === 0} >
                    Add Coin
                </button>
                <button className="btn btn-success btn-sm" onClick={handleApproveAll} disabled={selectedMissions.length === 0}>
                    Approve All
                </button>
            </div>

            {/* แสดง Table เฉพาะเมื่อเลือก Mission ที่เฉพาะเจาะจง */}
            {selectedMissionName !== "all" && filteredMissions.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-button-text">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Select</th>
                                <th className="border p-2">Mission Name</th>
                                <th className="border p-2">Username</th>
                                <th className="border p-2">Submission Date</th>
                                <th className="border p-2 w-72">Photos</th>
                                <th className="border p-2">Approve By</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMissions.map(mission => (
                                <tr key={mission.userPhotoMissionId} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={selectedMissions.includes(mission.userPhotoMissionId)}
                                            onChange={() => handleCheckboxChange(mission.userPhotoMissionId)}
                                            disabled={mission.approve === false} // ❌ ถ้า approve === false → ห้ามเลือก
                                        />
                                    </td>
                                    <td className="border p-2">{mission.missioN_NAME}</td>
                                    <td className="border p-2">
                                        {
                                            alluserDetail.find(user => user.a_USER_ID === mission.a_USER_ID)?.user_Name || "-"
                                        }
                                    </td>
                                    <td className="border p-2">{new Date(mission.uploadeD_AT).toLocaleString()}</td>
                                    <td className="border p-2 flex gap-2">
                                        <div className="grid grid-cols-4 gap-2">
                                            {mission.photo?.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`Mission Submission ${index + 1}`}
                                                    className="h-16 w-16 rounded-lg shadow-md object-cover cursor-pointer"
                                                    onClick={() => handleImageClick(mission.userPhotoMissionId, imgUrl, index)}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border p-2">
                                        {
                                            alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"
                                        }
                                    </td>
                                    <td className="border p-2">
                                        <div>
                                            {mission.approve === null ? (
                                                // หาก approve เป็น null ให้แสดงปุ่ม
                                                <>
                                                    <button
                                                        className="btn btn-success btn-xs"
                                                        onClick={() => handleAction(mission.userPhotoMissionId, true)}
                                                        disabled={mission.approve !== null}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleAction(mission.userPhotoMissionId, false)}
                                                        disabled={mission.approve !== null}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : mission.approve === true ? (
                                                // หาก approve เป็น true ให้แสดงข้อความ "Approved"
                                                <span className="text-green-500">Approved</span>
                                            ) : (
                                                // หาก approve เป็น false ให้แสดงข้อความ "Rejected"
                                                <span className="text-red-500">Rejected</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-10">Please select a mission to display the table.</p>
            )}


            {/* Modal for Image Viewing */}
            <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth>
                <DialogTitle className="text-center"></DialogTitle>
                <DialogContent className="relative flex justify-center items-center">
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black text-3xl"
                        onClick={handlePreviousImage}
                        disabled={selectedImageIndex <= 0}
                    >
                        <ArrowBackIcon />
                    </button>

                    {filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo?.[selectedImageIndex] && (
                        <img
                            src={filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo[selectedImageIndex]}
                            alt={`Mission Image ${selectedImageIndex + 1}`}
                            className="max-h-[500px] max-w-full object-contain"
                        />
                    )}

                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-3xl"
                        onClick={handleNextImage}
                        disabled={selectedImageIndex >= filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo.length - 1}
                    >
                        <ArrowForwardIcon />
                    </button>
                </DialogContent>
                <DialogActions className="justify-center">
                    <button className="btn btn-error" onClick={closeModal}>Close</button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PhotoMissionTable;
