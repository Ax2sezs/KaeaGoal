import React, { useState, useEffect } from 'react';

function TextMissionTable({ alluserDetail, allMission, ApproveText, approveText, addAllCoinText, isLoading, error, refetch }) {
    const [selectedMissionName, setSelectedMissionName] = useState('all');
    const [selectedMissions, setSelectedMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [coinAmount, setCoinAmount] = useState(10);

    useEffect(() => {
        if (selectedMissionName === "all") {
            setFilteredMissions(ApproveText);
        } else {
            setFilteredMissions(ApproveText.filter(mission => mission.missioN_ID === selectedMissionName));
        }
    }, [selectedMissionName, ApproveText]); // ✅ ให้ filteredMissions อัปเดตทุกครั้งที่ selectedMissionName เปลี่ยน



    useEffect(() => {
        if (selectedMissionName !== "all" && Array.isArray(allMission)) {
            const missionData = allMission.find(ms => ms.missioN_ID === selectedMissionName);
            setCoinAmount(missionData?.coin_Reward || 0);
        } else {
            setCoinAmount(0);
        }
    }, [selectedMissionName, allMission]);  // ✅ ทำงานเมื่อเลือก Mission ใหม่

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
            setFilteredMissions(ApproveText);
        } else {
            setFilteredMissions(ApproveText.filter(mission => mission.missioN_ID === missionId));
        }
    };

    const uniqueMissions = Array.from(
        new Map(ApproveText.map(mission => [mission.missioN_ID, mission.missioN_NAME])).entries()
    );

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
            setSelectedMissions([]); // Uncheck all
        } else {
            setSelectedMissions(selectableMissions.map(m => m.useR_MISSION_ID)); // Select all that match criteria
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
            await addAllCoinText(selectedMissionName, coinAmount);
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
            const unapprovedMissions = filteredMissions.filter(m =>
                selectedMissions.includes(m.useR_MISSION_ID) && m.approve === null
            );

            if (unapprovedMissions.length === 0) {
                alert("Please select at least one unapproved mission.");
                return;
            }

            await Promise.all(unapprovedMissions.map(mission => approveText(mission.useR_MISSION_ID, true)));
            alert("All selected missions approved successfully!");
            refetch();
            setSelectedMissions([]);
        } catch (err) {
            console.error("Error approving all selected missions:", err);
            alert("An error occurred while approving all missions.");
        }
    };

    const handleAction = async (missionId, isApproved) => {
        try {
            await approveText(missionId, isApproved);
            alert(isApproved ? "Mission approved successfully!" : "Mission rejected successfully!");
            refetch();
        } catch (err) {
            console.error("Error handling mission action:", err);
            alert("An error occurred while processing the mission.");
        }
    };

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-6 text-button-text">Text Missions</h2>

            {/* Mission Filter Dropdown */}
            <div className="p-3">
                <select onChange={handleMissionFilter} value={selectedMissionName} className="select select-sm select-error bg-bg text-button-text">
                    <option value="all">Select Mission</option>
                    {uniqueMissions.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Select All + Amount + Add Coin */}
            <div className="p-3 flex gap-4 items-center">
                <input
                    type="checkbox"
                    className="checkbox"
                    onChange={handleSelectAll}
                    checked={
                        selectedMissions.length > 0 &&
                        selectedMissions.length === filteredMissions.filter(m => m.approve === null || m.approve === true).length
                    }
                />


                <label className='text-button-text'>Select All</label>

                <input
                    type="number"
                    className="input input-bordered input-sm bg-bg border-button-text p-1 w-14 text-button-text"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    placeholder="Amount"
                />
                <button className="btn btn-primary btn-sm" onClick={handleAddAllCoin} disabled={selectedMissions.length === 0}>
                    Add Coin
                </button>
                <button className="btn btn-success btn-sm" onClick={handleApproveAll} disabled={selectedMissions.length === 0}>
                    Approve All
                </button>
            </div>

            {/* Table */}
            {isLoading ? (
                <p>Loading...</p>
            ) : (selectedMissionName !== "all" && filteredMissions.length > 0) ? ( // Check if mission is selected and has filtered data
                <table className="table-auto w-full border-collapse border border-gray-300 text-button-text">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">
                                Select
                            </th>
                            <th className="border p-2">User</th>
                            <th className="border p-2">Mission</th>
                            <th className="border p-2">Submit Date</th>
                            <th className="border p-2">Text</th>
                            <th className="border p-2">Approver</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMissions.map((mission) => (
                            <tr key={mission.missionId} className="border">
                                <td className="border p-2">
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedMissions.includes(mission.useR_MISSION_ID)}
                                        onChange={() => handleCheckboxChange(mission.useR_MISSION_ID)}
                                        disabled={mission.approve === false} // ❌ ถ้า approve === false → ห้ามเลือก
                                    />
                                </td>

                                <td className="border p-2">{mission.logoN_NAME}</td>
                                <td className="border p-2">{mission.missioN_NAME}</td>
                                <td className="border p-2">{new Date(mission.submiT_DATE).toLocaleString()}</td>
                                <td className="border p-2 text-sm">{mission.text.join(", ")}</td>
                                <td className="border p-2">
                                    {
                                        alluserDetail.find(user => user.a_USER_ID === mission.approve_By)?.user_Name || "-"
                                    }
                                </td>
                                <td className="border p-2">
                                    <div className="flex">
                                        {mission.approve === null ? (
                                            // หาก approve เป็น null ให้แสดงปุ่ม
                                            <>
                                                <button
                                                    className="btn btn-success btn-xs mb-5 text-bg"
                                                    onClick={() => handleAction(mission.useR_MISSION_ID, true)}
                                                    disabled={mission.approve !== null}
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="btn btn-error btn-xs w-20"
                                                    onClick={() => handleAction(mission.useR_MISSION_ID, false)}
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
            ) : (
                <p className='text-gray-500 text-center mt-10'>Please select a mission to display the table.</p>
            )}
        </div>
    );
}

export default TextMissionTable;
