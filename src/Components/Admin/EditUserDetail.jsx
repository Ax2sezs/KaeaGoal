import React, { useState } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

function EditUserDetail({ userData, onClose }) {
    const { user } = useAuth();
    const { userDetails, editUserDetail, resetPassword, success, error, isLoading, refetch } = useFetchData(user?.token);

    const initialState = {
        a_USER_ID: userData?.a_USER_ID || "",
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        branchCode: userData?.branchCode || "",
        branch: userData?.branch || "",
        stateCode: userData?.stateCode || 0,
        user_Name: userData?.user_Name || "",
        useR_EMAIL: userData?.useR_EMAIL || "",
        user_Position: userData?.user_Position || "",
        isAdmin: userData?.isAdmin || 5, // Default value 5
        isshop: userData?.isshop || false,
        issup: userData?.issup || false,
        site: userData?.site || "", // This will be used for the select dropdown
    };

    const [formData, setFormData] = useState(initialState);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false); // State to track password reset success

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;

        if (name === "isAdmin" || name === "isMissioner") {
            setFormData((prev) => {
                let newIsAdmin = prev.isAdmin;

                if (name === "isAdmin") {
                    newIsAdmin = checked ? 9 : prev.isMissioner ? 4 : 5;
                } else if (name === "isMissioner") {
                    newIsAdmin = checked ? 4 : prev.isAdmin === 9 ? 9 : 5;
                }

                return { ...prev, [name]: checked, isAdmin: newIsAdmin };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form Data Before Submit:", formData);  // Log form data before sending

        try {
            const result = await editUserDetail(formData);
            if (result) {
                console.log("Edit result:", result);
                alert("Update User Detail Successful.");
                refetch()
            }
        } catch (err) {
            console.error("Error during form submission:", err);
        }
    };


    const handlePasswordReset = async () => {
        if (!userData?.a_USER_ID) {
            setPasswordResetSuccess(false);
            setError("User ID is missing.");
            return;
        }

        try {
            console.log("Initiating password reset for user with ID:", userData.a_USER_ID);  // Log user ID
            const result = await resetPassword(userData.a_USER_ID);
            if (result) {
                setPasswordResetSuccess(true);
                console.log("Password reset successful for user:", userData.a_USER_ID);
                alert("Password reset successful");
            }
        } catch (err) {
            console.error("Error resetting password for user:", userData.a_USER_ID, err);
            setPasswordResetSuccess(false);
        }
    };

    return (
        <dialog open className="modal">
            <div className="modal-box w-1/2 max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Edit {userData.logoN_NAME} Detail.</h2>

                {passwordResetSuccess && (
                    <p className="text-green-600">Password reset successfully!</p>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {[
                        { name: "firstName", type: "text", label: "First Name" },
                        { name: "lastName", type: "text", label: "Last Name" },
                        { name: "branchCode", type: "text", label: "Branch Code" },
                        { name: "branch", type: "text", label: "Branch" },
                        { name: "stateCode", type: "number", label: "State Code" },
                        { name: "user_Name", type: "text", label: "Username" },
                        { name: "useR_EMAIL", type: "email", label: "Email" },
                        { name: "user_Position", type: "text", label: "User Position" },
                    ].map(({ name, type, label }) => (
                        <div key={name} className="flex flex-col">
                            <label className="font-medium">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    ))}

                    {/* isAdmin and isMissioner Checkboxes (Hidden if userDetails.isAdmin === 4) */}
                    {userDetails?.isAdmin !== 4 && (
                        <>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isAdmin"
                                    checked={formData.isAdmin === 9} // Check if isAdmin is 9
                                    onChange={handleChange}
                                    className="checkbox"
                                />
                                <label>Is Admin</label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isMissioner"
                                    checked={formData.isAdmin === 4} // Check if isAdmin is 4
                                    onChange={handleChange}
                                    className="checkbox"
                                />
                                <label>Is Missioner</label>
                            </div>
                        </>
                    )}


                    {/* Checkboxes for other options */}
                    {[
                        { name: "isshop", label: "Is Shop" },
                        { name: "issup", label: "Is Supplier" },
                    ].map(({ name, label }) => (
                        <div key={name} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name={name}
                                checked={formData[name]}
                                onChange={handleChange}
                                className="checkbox"
                            />
                            <label>{label}</label>
                        </div>
                    ))}

                    {/* Select for Site */}
                    <div className="flex flex-col">
                        <label className="font-medium">Site</label>
                        <select
                            name="site"
                            value={formData.site}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                        >
                            <option value="">Select Site</option>
                            <option value="Office">Office</option>
                            <option value="Factory">Factory</option>
                            <option value="Branch">Branch</option>
                        </select>
                    </div>
                </form>

                <div className="modal-action justify-between">
                    <button onClick={handlePasswordReset} className="btn btn-secondary">
                        Reset Password
                    </button>
                    <div className="flex gap-5">
                        <button onClick={handleSubmit} className="btn btn-primary">
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                        <button onClick={onClose} className="btn btn-error">Close</button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

export default EditUserDetail;
