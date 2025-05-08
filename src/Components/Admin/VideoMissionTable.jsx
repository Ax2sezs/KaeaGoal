import React, { useEffect, useState } from 'react';

const VideoMissionTable = ({ alluserDetail, allMission, ApproveVideo, approveVideo, isLoading, error, refetch }) => {
    const [videoMissions, setVideoMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [selectedMissions, setSelectedMissions] = useState([]);
    const [selectedMissionName, setSelectedMissionName] = useState("all");
    const [coinAmount, setCoinAmount] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const video = ["./0401(7).mp4","0513.mp4","0811(2).mp4","2113110387.mp4"]

    useEffect(() => {
        const mappedVideoMissions = ApproveVideo.map(m => ({
            ...m,
            userVideoMissionId: m.useR_VIDEO_MISSION_ID,
        }));

        mappedVideoMissions.sort((a, b) => (a.approve === null ? -1 : 1) - (b.approve === null ? -1 : 1));
        setVideoMissions(mappedVideoMissions);

        if (selectedMissionName === "all") {
            setFilteredMissions(mappedVideoMissions);
        } else {
            setFilteredMissions(mappedVideoMissions.filter(m => m.missioN_ID === selectedMissionName));
        }
    }, [ApproveVideo, selectedMissionName]);

    useEffect(() => {
        if (selectedMissionName !== "all" && Array.isArray(allMission)) {
            const missionData = allMission.find(ms => ms.missioN_ID === selectedMissionName);
            setCoinAmount(missionData?.coin_Reward || 0);
        } else {
            setCoinAmount(0);
        }
    }, [selectedMissionName, allMission]);

    const handleMissionFilter = (e) => {
        const missionId = e.target.value;
        setSelectedMissionName(missionId);
        if (missionId === "all") {
            setFilteredMissions(videoMissions);
        } else {
            setFilteredMissions(videoMissions.filter(m => m.missioN_ID === missionId));
        }
    };

    const handleAction = async (missionId, isApproved) => {
        try {
            let accepted_Desc = 'Completed';
            if (!isApproved) {
                accepted_Desc = prompt("Please enter the reason for rejection.");
                if (!accepted_Desc || accepted_Desc.trim() === "") {
                    alert("Rejection Reason is required");
                    return;
                }
            }
            await approveVideo(missionId, isApproved, accepted_Desc);
            setFilteredMissions(filteredMissions.filter(m => m.userVideoMissionId !== missionId));
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch();
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    const handleCheckboxChange = (missionId) => {
        setSelectedMissions(prev =>
            prev.includes(missionId)
                ? prev.filter(id => id !== missionId)
                : [...prev, missionId]
        );
    };

    const handleSelectAll = () => {
        const selectableMissions = filteredMissions.filter(m => m.approve === null || m.approve === true);
        if (selectedMissions.length === selectableMissions.length) {
            setSelectedMissions([]);
        } else {
            setSelectedMissions(selectableMissions.map(m => m.userVideoMissionId));
        }
    };

    const handleVideoClick = (videoUrl) => {
        setSelectedVideo(videoUrl);
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
        setSelectedVideo(null);
    };

    const uniqueMissions = Array.from(new Map(videoMissions.map(m => [m.missioN_ID, m.missioN_NAME])).entries());

    return (
        <div>
            <div className="mb-4">
                <select className="select select-bordered" value={selectedMissionName} onChange={handleMissionFilter}>
                    <option value="all">All Missions</option>
                    {uniqueMissions.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm text-button-text">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2"><input type="checkbox" onChange={handleSelectAll} checked={selectedMissions.length === filteredMissions.filter(m => m.approve === null || m.approve === true).length} /></th>
                            <th className="border p-2">EmployeeID</th>
                            <th className="border p-2">EmployeeName</th>
                            <th className="border p-2">Department</th>
                            <th className="border p-2">Submission Date</th>
                            <th className="border p-2">Videos</th>
                            <th className="border p-2">Action</th>
                            <th className="border p-2">Approver</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMissions.map(m => (
                            <tr key={m.userVideoMissionId} className="hover:bg-gray-50">
                                <td className="border p-2">
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedMissions.includes(m.userVideoMissionId)}
                                        onChange={() => handleCheckboxChange(m.userVideoMissionId)}
                                        disabled={m.approve === false}
                                    />
                                </td>
                                <td className="border p-2">{m.logoN_NAME}</td>
                                <td className="border p-2">{m.useR_NAME}</td>
                                <td className="border p-2">{m.branchCode}-{m.department}</td>
                                <td className="border p-2">{new Date(m.uploadeD_AT).toLocaleString()}</td>
                                <td className="border p-2">
                                    {/* <video src=
                  {m.video}/> */}
                                    <video controls width="400">
                                        <source src={m.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                </td>
                                <td className="border p-2">
                                    <div className="flex gap-2">
                                        {m.approve === null ? (
                                            <>
                                                <button className="btn btn-success btn-xs" onClick={() => handleAction(m.userVideoMissionId, true)}>Approve</button>
                                                <button className="btn btn-error btn-xs" onClick={() => handleAction(m.userVideoMissionId, false)}>Reject</button>
                                            </>
                                        ) : m.approve === true ? (
                                            <span className="text-green-600">Approved</span>
                                        ) : (
                                            <span className="text-red-600">Rejected</span>
                                        )}
                                    </div>
                                </td>
                                <td className="border p-2">
                                    {alluserDetail.find(user => user.a_USER_ID === m.approve_By)?.user_Name || "-"}
                                    <br />
                                    <span className="text-xs text-gray-500">{m.approve_DATE ? new Date(m.approve_DATE).toLocaleString() : '-'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {openModal && selectedVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <video src={selectedVideo} controls autoPlay className="max-h-[70vh] max-w-[90vw]" />
                        <div className="text-center mt-2">
                            <button className="btn btn-sm btn-error" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoMissionTable;
