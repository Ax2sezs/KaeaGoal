import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

const Admin_List = () => {
    const { user } = useAuth();
    const { adminUserMissions = [], error, isLoading } = useFetchData(user?.token);

    const [typeFilter, setTypeFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [missionName, setMissionName] = useState('');
    const [username, setUsername] = useState('');
    const [acceptedStartDate, setAcceptedStartDate] = useState('');
    const [acceptedEndDate, setAcceptedEndDate] = useState('');
    const [completedStartDate, setCompletedStartDate] = useState('');
    const [completedEndDate, setCompletedEndDate] = useState('');

    if (isLoading) {
        return <div className="text-center text-gray-500">    
        <span className="loading loading-dots loading-lg"></span>
        </div>
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Helper functions to format date and time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString();
    };

    // Filter and search logic
    const filteredMissions = [...adminUserMissions]
        .filter((mission) => {
            if (typeFilter && mission.mission_Type !== typeFilter) return false;
            if (statusFilter && mission.verification_Status !== statusFilter) return false;
            if (missionName && !mission.mission_Name.toLowerCase().includes(missionName.toLowerCase())) return false;
            if (username && !mission.logoN_NAME.toLowerCase().includes(username.toLowerCase())) return false;

            if (
                acceptedStartDate &&
                new Date(mission.accepted_Date) < new Date(acceptedStartDate)
            )
                return false;
            if (
                acceptedEndDate &&
                new Date(mission.accepted_Date) > new Date(acceptedEndDate)
            )
                return false;
            if (
                completedStartDate &&
                mission.completed_Date &&
                new Date(mission.completed_Date) < new Date(completedStartDate)
            )
                return false;
            if (
                completedEndDate &&
                mission.completed_Date &&
                new Date(mission.completed_Date) > new Date(completedEndDate)
            )
                return false;

            return true;
        })
        .sort((a, b) => new Date(b.accepted_Date) - new Date(a.accepted_Date)); // Sort by date (descending)

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
            <h1 className="text-2xl font-bold mb-4 text-button-text">Admin User Missions</h1>
            {/* Filters */}
            <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1">Filter by Type</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="select select-bordered w-full bg-bg text-button-text border-button-text"
                        >
                            <option value="">All</option>
                            <option value="QR">QR</option>
                            <option value="Code">Code</option>
                            <option value="Photo">Photo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Filter by Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered w-full bg-bg text-button-text border-button-text"
                        >
                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Waiting for Confirmation">Waiting for Confirmation</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Search by Mission Name</label>
                        <input
                            type="text"
                            value={missionName}
                            onChange={(e) => setMissionName(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text border-button-text"
                            placeholder="Enter mission name"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Search by Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text border-button-text"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Accepted Start Date</label>
                        <input
                            type="date"
                            value={acceptedStartDate}
                            onChange={(e) => setAcceptedStartDate(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text border-button-text"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Accepted End Date</label>
                        <input
                            type="date"
                            value={acceptedEndDate}
                            onChange={(e) => setAcceptedEndDate(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text border-button-text"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Completed Start Date</label>
                        <input
                            type="date"
                            value={completedStartDate}
                            onChange={(e) => setCompletedStartDate(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text border-button-text"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Completed End Date</label>
                        <input
                            type="date"
                            value={completedEndDate}
                            onChange={(e) => setCompletedEndDate(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text border-button-text"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            {filteredMissions.length > 0 ? (
                <div>
                    <h2 className="text-lg mb-4">SUM: {filteredMissions.length}</h2>
                    <table className="min-w-full border-collapse border border-gray-400 text-button-text">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 p-2">#</th>
                                <th className="border border-gray-400 p-2">Mission Name</th>
                                <th className="border border-gray-400 p-2">Username</th>
                                <th className="border border-gray-400 p-2">Type</th>
                                <th className="border border-gray-400 p-2">Status</th>
                                <th className="border border-gray-400 p-2">Accepted Date</th>
                                <th className="border border-gray-400 p-2">Accepted Time</th>
                                <th className="border border-gray-400 p-2">Completed Date</th>
                                <th className="border border-gray-400 p-2">Completed Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMissions.map((mission, index) => (
                                <tr key={mission.useR_MISSION_ID}>
                                    <td className="border border-gray-400 p-2">{index + 1}</td>
                                    <td className="border border-gray-400 p-2">{mission.mission_Name}</td>
                                    <td className="border border-gray-400 p-2">{mission.logoN_NAME}</td>
                                    <td className="border border-gray-400 p-2">{mission.mission_Type}</td>
                                    <td className="border border-gray-400 p-2">{mission.verification_Status}</td>
                                    <td className="border border-gray-400 p-2">{formatDate(mission.accepted_Date)}</td>
                                    <td className="border border-gray-400 p-2">{formatTime(mission.accepted_Date)}</td>
                                    <td className="border border-gray-400 p-2">
                                        {mission.completed_Date ? formatDate(mission.completed_Date) : 'Not completed'}
                                    </td>
                                    <td className="border border-gray-400 p-2">
                                        {mission.completed_Date ? formatTime(mission.completed_Date) : 'Not completed'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No missions match the selected filters or search criteria.</p>
            )}
        </div>
    );
};

export default Admin_List;
