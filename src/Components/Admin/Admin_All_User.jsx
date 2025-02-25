import React, { useState } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";
import EditUserDetail from "./EditUserDetail"; // Import the modal component

function AdminAllUser() {
    const { user } = useAuth();
    const { alluserDetail = [], error, isLoading ,refetch} = useFetchData(user?.token);
    
    const [expandedUser, setExpandedUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // Store selected user for modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
    const [searchQuery, setSearchQuery] = useState(""); // Search query for name search
    const [filterBranchCode, setFilterBranchCode] = useState(""); // Filter by branch code

    const toggleUserDetails = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    const openEditModal = (userData) => {
        setSelectedUser(userData);
        setIsModalOpen(true);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleBranchFilterChange = (e) => {
        setFilterBranchCode(e.target.value);
    };

    const filteredData = () => {
        return alluserDetail.filter((user) => {
            // Filter by name (first name, last name, or logon name)
            const matchesSearchQuery = 
                user.logoN_NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter by branch code if selected
            const matchesBranchCode = 
                !filterBranchCode || user.branchCode === filterBranchCode;

            return matchesSearchQuery && matchesBranchCode;
        });
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users.</p>;

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
            <h2 className="text-xl font-bold mb-4">All Users</h2>

            {/* Filter and Search Section */}
            <div className="flex gap-4 mb-4">
                {/* Search Input */}
                <div className="flex flex-col">
                    <label>Search by Name</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="input input-bordered w-full"
                        placeholder="Search by name"
                    />
                </div>

                {/* Branch Code Filter */}
                <div className="flex flex-col">
                    <label>Filter by Branch Code</label>
                    <select
                        value={filterBranchCode}
                        onChange={handleBranchFilterChange}
                        className="select select-bordered w-full"
                    >
                        <option value="">All Branches</option>
                        {/* Replace with actual branch codes */}
                        {[...new Set(alluserDetail.map((user) => user.branchCode))].map((branchCode) => (
                            <option key={branchCode} value={branchCode}>
                                {branchCode}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            {filteredData().length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 shadow-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Logon Name</th>
                                <th className="border p-2">First Name</th>
                                <th className="border p-2">Last Name</th>
                                <th className="border p-2">Branch</th>
                                <th className="border p-2">Position</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData().map((user) => (
                                <React.Fragment key={user.a_USER_ID}>
                                    <tr className="cursor-pointer hover:bg-gray-100">
                                        <td className="border p-2">{user.logoN_NAME}</td>
                                        <td className="border p-2">{user.firstName}</td>
                                        <td className="border p-2">{user.lastName}</td>
                                        <td className="border p-2">{user.branchCode}</td>
                                        <td className="border p-2">{user.user_Position}</td>
                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {isModalOpen && (
                <EditUserDetail userData={selectedUser} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}

export default AdminAllUser;
