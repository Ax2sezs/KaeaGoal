import React, { useState } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

function AdminAllUser() {
    const { user } = useAuth();
    const { alluserDetail = [], error, isLoading } = useFetchData(user?.token);
    const [expandedUser, setExpandedUser] = useState(null);

    const toggleUserDetails = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users.</p>;

    return (
        <div className="bg-bg w-full rounded-2xl min-h-screen p-3">
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            {alluserDetail.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 shadow-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Logon Name</th>
                                <th className="border p-2">First Name</th>
                                <th className="border p-2">Last Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Position</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alluserDetail.map((user) => (
                                <React.Fragment key={user.a_USER_ID}>
                                    <tr 
                                        className="cursor-pointer hover:bg-gray-100" 
                                        onClick={() => toggleUserDetails(user.a_USER_ID)}
                                    >
                                        <td className="border p-2">{user.logoN_NAME}</td>
                                        <td className="border p-2">{user.firstName}</td>
                                        <td className="border p-2">{user.lastName}</td>
                                        <td className="border p-2">{user.useR_EMAIL}</td>
                                        <td className="border p-2">{user.user_Position}</td>
                                        <td className="border p-2 text-center">
                                            {expandedUser === user.a_USER_ID ? "▲" : "▼"}
                                        </td>
                                    </tr>
                                    {expandedUser === user.a_USER_ID && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="6" className="border p-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <p><strong>Display Name:</strong> {user.displayName}</p>
                                                    <p><strong>Branch:</strong> {user.branch} ({user.branchCode})</p>
                                                    <p><strong>Created On:</strong> {new Date(user.createdOn).toLocaleString()}</p>
                                                    <p><strong>Updated On:</strong> {new Date(user.updatedOn).toLocaleString()}</p>
                                                    <p><strong>State Code:</strong> {user.stateCode}</p>
                                                    <p><strong>Deletion State:</strong> {user.deletionStateCode}</p>
                                                    <p><strong>Is Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
                                                    <p><strong>Is Shop:</strong> {user.isshop ? "Yes" : "No"}</p>
                                                    <p><strong>Is Support:</strong> {user.issup ? "Yes" : "No"}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminAllUser;
