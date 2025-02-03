import React, { useState, useEffect } from "react";
import { Button } from "@mui/material"; // MUI Button for approval/rejection
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"; // MUI Dialog for modal
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const PhotoMissionTable = ({ ApprovePhoto, approvePhoto, isLoading, error, refetch }) => {
    const [photoMissions, setPhotoMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [selectedMissionId, setSelectedMissionId] = useState(null); // To track the mission for navigation
    const [openModal, setOpenModal] = useState(false); // To manage modal open state
    const [selectedMissionName, setSelectedMissionName] = useState("all"); // For the mission name filter

    useEffect(() => {
        const mappedPhotoMissions = ApprovePhoto.map(mission => ({
            ...mission,
            userPhotoMissionId: mission.useR_PHOTO_MISSION_ID,
        }));

        mappedPhotoMissions.sort((a, b) => (a.approve === null ? -1 : 1) - (b.approve === null ? -1 : 1));
        setPhotoMissions(mappedPhotoMissions);
        setFilteredMissions(mappedPhotoMissions); // Initially no filter
    }, [ApprovePhoto]);

    // Handle filtering by mission name
    const handleMissionNameFilter = (e) => {
        const missionName = e.target.value;
        setSelectedMissionName(missionName);

        // Filter missions by selected mission name
        if (missionName === "all") {
            setFilteredMissions(photoMissions);
        } else {
            setFilteredMissions(photoMissions.filter(mission => mission.missioN_NAME === missionName));
        }
    };

    // Get unique mission names (remove duplicates)
    const uniqueMissionNames = Array.from(new Set(photoMissions.map(mission => mission.missioN_NAME)));

    const handleAction = async (missionId, isApproved) => {
        try {
            await approvePhoto(missionId, isApproved);
            // Update filteredMissions to reflect the approval/rejection status
            setFilteredMissions(filteredMissions.filter(m => m.userPhotoMissionId !== missionId));
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch()
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    // Function to handle image click to open the modal with full image
    const handleImageClick = (missionId, imgUrl, index) => {
        setSelectedMissionId(missionId);
        setSelectedImageIndex(index);
        setOpenModal(true);
    };

    // Function to navigate to the next image
    const handleNextImage = () => {
        const mission = filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId);
        if (mission && selectedImageIndex < mission.photo.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    // Function to navigate to the previous image
    const handlePreviousImage = () => {
        if (selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setOpenModal(false);
        setSelectedImageIndex(null);
        setSelectedMissionId(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Approve Photo Missions</h2>

            {/* Mission Name Filter Dropdown */}
            <div className="p-3">
                <select
                    className="w-full p-2 border rounded-md"
                    value={selectedMissionName}
                    onChange={handleMissionNameFilter}
                >
                    <option value="all">All Missions</option>
                    {uniqueMissionNames.map((missionName, index) => (
                        <option key={index} value={missionName}>{missionName}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center text-gray-500">
                        <span className="loading loading-dots loading-lg"></span>
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : filteredMissions.length === 0 ? (
                    <p>No photo missions available</p>
                ) : (
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Mission Name</th>
                                <th className="border p-2">Username</th>
                                <th className="border p-2">Submission Date</th>
                                <th className="border p-2">Photos</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMissions.map(mission => (
                                <tr key={mission.userPhotoMissionId} className="hover:bg-gray-50">
                                    <td className="border p-2">{mission.missioN_NAME}</td>
                                    <td className="border p-2">{mission.logoN_NAME}</td>
                                    <td className="border p-2">{new Date(mission.uploadeD_AT).toLocaleString()}</td>
                                    <td className="border p-2 flex gap-2">
                                        <div className="grid grid-cols-4 gap-2">
                                            {mission.photo?.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`Mission Submission ${index + 1}`}
                                                    className="h-16 w-auto rounded-lg shadow-md cursor-pointer"
                                                    onClick={() => handleImageClick(mission.userPhotoMissionId, imgUrl, index)} // Track index
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="border p-2">
                                        <button className="btn btn-success btn-sm w-full mb-5 text-bg"
                                        onClick={() => handleAction(mission.userPhotoMissionId, true)}
                                        disabled={mission.approve !== null}>
                                            Approve
                                        </button>
                                        
                                        <button className="btn btn-error btn-sm w-full"
                                         onClick={() => handleAction(mission.userPhotoMissionId, false)}
                                         disabled={mission.approve !== null}>
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal for Image Viewing */}
            <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth>
                <DialogTitle className="text-center"></DialogTitle>
                <DialogContent className="relative flex justify-center items-center">
                    {/* Left Arrow Button */}
                    <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black text-3xl"
                        onClick={handlePreviousImage}
                        disabled={selectedImageIndex <= 0} // Disable if it's the first image
                    >
                        <ArrowBackIcon/>
                    </button>

                    {/* Image */}
                    {filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo?.[selectedImageIndex] && (
                        <img
                            src={filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId).photo[selectedImageIndex]}
                            alt="Full Size"
                            className="max-w-full max-h-screen object-contain"
                        />
                    )}

                    {/* Right Arrow Button */}
                    <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-3xl"
                        onClick={handleNextImage}
                        disabled={selectedImageIndex >= filteredMissions.find(m => m.userPhotoMissionId === selectedMissionId)?.photo.length - 1} // Disable if it's the last image
                    >
                        <ArrowForwardIcon/>
                    </button>
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={closeModal} color="secondary">
                        Close
                    </Button> */}
                    <button className="btn btn-error rounded-badge" onClick={closeModal}>
                        Close
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PhotoMissionTable;
