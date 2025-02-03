import React, { useState, useEffect } from "react";

const QRMissionTable = ({ ApproveQR, approveMission, isLoading, error, refetch }) => {
    const [qrMissions, setQrMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]); // State for filtered missions
    const [selectedMissionName, setSelectedMissionName] = useState("all"); // For mission name filter

    useEffect(() => {
        const mappedQrMissions = ApproveQR.map(mission => ({
            ...mission,
            userQRCodeMissionId: mission.useR_QR_CODE_MISSION_ID,
        }));

        mappedQrMissions.sort((a, b) => (a.approve === null ? -1 : 1) - (b.approve === null ? -1 : 1));
        setQrMissions(mappedQrMissions);
        setFilteredMissions(mappedQrMissions); // Initially no filter
    }, [ApproveQR]);

    // Handle filtering by mission name
    const handleMissionNameFilter = (e) => {
        const missionName = e.target.value;
        setSelectedMissionName(missionName);

        // Filter missions by selected mission name
        if (missionName === "all") {
            setFilteredMissions(qrMissions);
        } else {
            setFilteredMissions(qrMissions.filter(mission => mission.missioN_NAME === missionName));
        }
    };

    // Get unique mission names (remove duplicates)
    const uniqueMissionNames = Array.from(new Set(qrMissions.map(mission => mission.missioN_NAME)));

    const handleAction = async (missionId, isApproved) => {
        try {
            await approveMission(missionId, isApproved);
            setQrMissions(qrMissions.filter(m => m.userQRCodeMissionId !== missionId));
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch()
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Approve QR Missions</h2>

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
                    <p>No QR missions available</p>
                ) : (
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Mission Name</th>
                                <th className="border p-2">Username</th>
                                <th className="border p-2">Scan Date</th>
                                <th className="border p-2">QR Code</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMissions.map(mission => (
                                <tr key={mission.userQRCodeMissionId} className="hover:bg-gray-50">
                                    <td className="border p-2">{mission.missioN_NAME}</td>
                                    <td className="border p-2">{mission.logoN_NAME}</td>
                                    <td className="border p-2">{new Date(mission.scanned_At).toLocaleString()}</td>
                                    <td className="border p-2">{mission.qrCode}</td>
                                    <td className="border p-2">
                                        <button className="btn btn-success btn-sm mr-5 text-bg" onClick={() => handleAction(mission.userQRCodeMissionId, true)} disabled={mission.approve !== null}>
                                            Approve
                                        </button>
                                        <button className="btn btn-error btn-sm" onClick={() => handleAction(mission.userQRCodeMissionId, false)} disabled={mission.approve !== null}>
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default QRMissionTable;
