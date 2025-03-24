import React, { useState,useEffect } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";
import EditUserDetail from "./EditUserDetail"; // Import the modal component
import CreateUserForm from "./CreateUserForm";

function AdminAllUser() {
  const { user } = useAuth();
  const { userDetails,alluserDetail = [], error, isLoading, fetchUserDetails, fetchAllUserDetails } = useFetchData(user?.token);
  const isSuperAdmin = userDetails?.isAdmin===9

  const [expandedUser, setExpandedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false); // Control create user modal visibility
  const [searchQuery, setSearchQuery] = useState(""); // Search query for name search
  const [filterBranchCode, setFilterBranchCode] = useState(""); // Filter by branch code

   useEffect(() => {
        if (user?.token) {
          fetchUserDetails()
          fetchAllUserDetails()
        }
      }, [user?.token, fetchUserDetails,fetchAllUserDetails]);

  const toggleUserDetails = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  const openEditModal = (userData) => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true); // Open the create user modal
  };

  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false); // Close the create user modal
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
      <h2 className="text-xl font-bold mb-4 text-button-text">All Users</h2>

      {/* Filter and Search Section */}
      <div className="flex gap-4 mb-4">
        {/* Search Input */}
        <div className="flex flex-col">
          <label className="text-button-text">Search by Name</label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="input input-bordered border-black w-full bg-bg text-button-text"
            placeholder="Search by name"
          />
        </div>

        {/* Branch Code Filter */}
        <div className="flex flex-col">
          <label className="text-button-text">Filter by Branch Code</label>
          <select
            value={filterBranchCode}
            onChange={handleBranchFilterChange}
            className="select border-black select-bordered w-full bg-bg text-button-text"
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
          <table className="min-w-full border border-gray-300 shadow-lg text-button-text">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Logon Name</th>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Branch</th>
                <th className="border p-2">Position</th>
                <th className="border p-2">isMissioner</th>
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
                    <td className="border p-2">
                      {user.isAdmin === 9 ? "Super Admin" : user.isAdmin === 4 ? "Admin" : "User"}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => openEditModal(user)} // Open edit modal with selected user data
                        className="btn btn-success btn-sm text-bg"
                        disabled={!isSuperAdmin}
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

      {/* Create User Button */}
      <div className="fixed top-20 right-5">
        <button
          className="btn bg-layer-item text-bg border-hidden hover:bg-heavy-color"
          onClick={openCreateUserModal} // Open create user modal
        >
          + Create User
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditUserDetail
          userData={selectedUser} // Pass selected user data to EditUserDetail
          onClose={() => setIsModalOpen(false)} // Close modal on close
        />
      )}

      {/* Create User Modal */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="">
            <CreateUserForm
              onClose={closeCreateUserModal} // Close create user modal
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAllUser;
