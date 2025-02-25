import React, { useState } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

function EditUserDetail({ userData, onClose }) {
    const { user } = useAuth();
    const { editUserDetail, resetPassword, success, error, isLoading, refetch } = useFetchData(user?.token);

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
    };

    const [formData, setFormData] = useState(initialState);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false); // State to track password reset success

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "isAdmin") {
            setFormData({
                ...formData,
                [name]: checked ? 9 : 5,
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);

        const result = await editUserDetail(formData);
        console.log("Edit result:", result);

        if (success) {
            console.log("Update successful, calling refetch...");
            alert("Update User Detail Successful.")
            refetch();
            onClose();
        } else if (error) {
            console.error("Error during submission:", error);
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

                    {/* isAdmin Checkbox */}
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
                </form>

                <div className="modal-action justify-between">
                <button
                        onClick={handlePasswordReset}
                        className="btn btn-secondary"
                    >
                        Reset Password
                    </button>
                    <div className="flex gap-5">
                    <button
                        onClick={handleSubmit} // Trigger handleSubmit manually
                        className="btn btn-primary"
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </button>

                    <button onClick={onClose} className="btn btn-error">Close</button>
                    </div>
                    
                    {/* Add Reset Password button */}
                    
                </div>
            </div>
        </dialog>
    );
}

export default EditUserDetail;
