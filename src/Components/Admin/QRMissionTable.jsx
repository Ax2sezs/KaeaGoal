import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const QRMissionTable = ({ alluserDetail, allMission, ApproveQR, approveMission, addAllCoinQR, isLoading, error, refetch }) => {
    const [qrMissions, setQrMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [selectedMissions, setSelectedMissions] = useState([]);
    const [coinAmount, setCoinAmount] = useState(0);
    const [selectedMissionName, setSelectedMissionName] = useState("all");

    useEffect(() => {
        const mappedQrMissions = ApproveQR.map(mission => ({
            ...mission,
            userQRCodeMissionId: mission.useR_QR_CODE_MISSION_ID,
        }));

        mappedQrMissions.sort((a, b) => (a.approve === null ? -1 : 1) - (b.approve === null ? -1 : 1));
        setQrMissions(mappedQrMissions);
        setFilteredMissions(mappedQrMissions);
    }, [ApproveQR]);

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
            setFilteredMissions(qrMissions);
        } else {
            setFilteredMissions(qrMissions.filter(mission => mission.missioN_ID === missionId));
        }
    };

    const uniqueMissions = Array.from(
        new Map(qrMissions.map(mission => [mission.missioN_ID, mission.missioN_NAME])).entries()
    );

    const handleAction = async (missionId, isApproved) => {
        try {
            await approveMission(missionId, isApproved);
            setFilteredMissions(filteredMissions.filter(m => m.userQRCodeMissionId !== missionId));
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch();
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
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
            setSelectedMissions(selectableMissions.map(m => m.userQRCodeMissionId));
        }
    };

    const handleApproveAll = async () => {
        try {
            const unapprovedMissions = filteredMissions.filter(m => selectedMissions.includes(m.userQRCodeMissionId) && m.approve === null);
            if (unapprovedMissions.length === 0) {
                alert("Please select at least one unapproved mission.");
                return;
            }

            await Promise.all(unapprovedMissions.map(mission => approveMission(mission.userQRCodeMissionId, true)));
            alert("All selected missions approved successfully!");
            refetch();
            setSelectedMissions([]);
        } catch (err) {
            console.error("Error approving all selected missions:", err);
            alert("An error occurred while approving all missions.");
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
            // Replace this with your logic to add coins to the selected missions
            await addAllCoinQR(selectedMissionName, coinAmount);
            alert(`Successfully added ${coinAmount} coins to mission ID: ${selectedMissionName}!`);

            setSelectedMissions([]); // Reset selected missions after adding coins
            refetch(); // Optionally call refetch to get the updated data
        } catch (err) {
            console.error("Error adding coins:", err);
            alert("An error occurred while adding coins.");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">QR Missions</h2>

            {/* 🔹 Mission Name Filter */}
            <div className="p-3">
                <select onChange={handleMissionFilter} value={selectedMissionName}>
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
                <label>Select All</label>

                <input
                    type="number"
                    className="border p-1 w-20"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    placeholder="Amount"
                    readOnly
                />
                <button className="btn btn-primary btn-sm" onClick={handleAddAllCoin}>
                    Add Coin
                </button>
                <button className="btn btn-success btn-sm" onClick={handleApproveAll} disabled={selectedMissions.length === 0}>
                    Approve All
                </button>
            </div>

            {/* 🔹 QR Mission Table */}
            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="text-center text-gray-500">
                        <span className="loading loading-dots loading-lg"></span>
                    </div>
                ) : selectedMissionName === "all" ? (
                    <p className="text-gray-500 text-center">Please select a mission to display the table.</p>
                ) : filteredMissions.length === 0 ? (
                    <p>No QR missions available</p>
                ) : (
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Select</th>
                                <th className="border p-2">Mission Name</th>
                                <th className="border p-2">Username</th>
                                <th className="border p-2">Scan Date</th>
                                <th className="border p-2">Approver</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMissions.map(mission => (
                                <tr key={mission.userQRCodeMissionId} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={selectedMissions.includes(mission.userQRCodeMissionId)}
                                            onChange={() => handleCheckboxChange(mission.userQRCodeMissionId)}
                                            disabled={mission.approve === false}
                                        />
                                    </td>
                                    <td className="border p-2">{mission.missioN_NAME}</td>
                                    <td className="border p-2">{mission.logoN_NAME}</td>
                                    <td className="border p-2">{new Date(mission.scanned_At).toLocaleString()}</td>
                                    <td className="border p-2">
                                        {
                                            alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"
                                        }
                                    </td>
                                    <td className="border p-2">
                                        <div>
                                            {mission.approve === null ? (
                                                // If approve is null, show the buttons
                                                <>
                                                    <button
                                                        className="btn btn-success btn-xs"
                                                        onClick={() => handleAction(mission.userQRCodeMissionId, true)}
                                                        disabled={mission.approve !== null}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-error btn-xs"
                                                        onClick={() => handleAction(mission.userQRCodeMissionId, false)}
                                                        disabled={mission.approve !== null}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : mission.approve === true ? (
                                                // If approve is true, show "Approved"
                                                <span className="text-green-500">Approved</span>
                                            ) : (
                                                // If approve is false, show "Rejected"
                                                <span className="text-red-500">Rejected</span>
                                            )}
                                        </div>
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
