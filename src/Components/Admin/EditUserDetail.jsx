import React, { useState } from "react";
import useFetchData from "../APIManage/useFetchData";
import { useAuth } from "../APIManage/AuthContext";

function EditUserDetail({ userData, onClose }) {
    const { user } = useAuth();
    const { userDetails, editUserDetail, resetPassword, addThankCoin, addKaeCoin,success, error, isLoading, refetch } = useFetchData(user?.token);

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
        isBkk: userData?.isBkk || 5,
        isshop: userData?.isshop || false,
        issup: userData?.issup || false,
        site: userData?.site || "", // This will be used for the select dropdown
    };

    const [formData, setFormData] = useState(initialState);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false); // State to track password reset success
    const [thanksCoinAmount, setThanksCoinAmount] = useState(0); // Amount ของ Coin ที่จะให้
    const [kaeCoinDescription, setKaeCoinDescription] = useState(""); // คำอธิบายของ Coin
    const [kaeCoinAmount, setKaeCoinAmount] = useState(0); // Amount ของ Coin ที่จะให้
    const [thanksCoinDescription, setThanksCoinDescription] = useState(""); // คำอธิบายของ Coin
    const [thanksCoinSuccess, setThanksCoinSuccess] = useState(false); // ใช้เก็บสถานะการให้ Coin สำเร็จ
    const [kaeCoinSuccess, setKaeCoinSuccess] = useState(false); // ใช้เก็บสถานะการให้ Coin สำเร็จ

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;

        if (name === "isMissioner") {
            setFormData((prev) => {
                const newIsAdmin = checked ? 4 : 5;
                const newIsBkk = checked ? prev.isBkk : 0; // ถ้า uncheck ให้ reset เป็น 0

                return {
                    ...prev,
                    isAdmin: newIsAdmin,
                    isBkk: newIsBkk,
                };
            });
        } else if (name === "superAdmin") {
            // handle แบบ custom สำหรับ superAdmin checkbox (ถ้ามี)
            setFormData((prev) => ({
                ...prev,
                isAdmin: checked ? 9 : 5,
                isBkk: checked ? 9 : 0,
            }));
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

    const handleGiveThanksCoin = async () => {
        try {
            const result = await addThankCoin(userData.a_USER_ID, thanksCoinAmount, thanksCoinDescription);
            if (result) {
                setThanksCoinSuccess(true);
                console.log("Thanks Coin Given Successfully:", result);
                alert("Thanks Coin Given Successfully!");
            }
        } catch (err) {
            console.error("Error giving thanks coin:", err);
            setThanksCoinSuccess(false);
        }
    };

    const handleGiveKaeCoin = async () => {
        try {
            const result = await addKaeCoin(userData.a_USER_ID, kaeCoinAmount, kaeCoinDescription);
            if (result) {
                setKaeCoinSuccess(true);
                console.log("Thanks Coin Given Successfully:", result);
                alert("Thanks Coin Given Successfully!");
            }
        } catch (err) {
            console.error("Error giving thanks coin:", err);
            setKaeCoinSuccess(false);
        }
    };


    return (
        <dialog open className="modal">
            <div className="modal-box w-1/2 max-w-2xl bg-bg text-button-text">
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
                                className="input input-bordered w-full bg-bg text-button-text"
                            />
                        </div>
                    ))}

                    {/* isAdmin and isMissioner Checkboxes (Hidden if userDetails.isAdmin === 4) */}
                    {userDetails?.isAdmin !== 4 && (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="superAdmin"
                                        checked={formData.isAdmin === 9 && formData.isBkk === 9}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setFormData((prev) => ({
                                                ...prev,
                                                isAdmin: checked ? 9 : 5, // หรือค่า default อื่นที่คุณใช้
                                                isBkk: checked ? 9 : 0,   // default isBkk ถ้าไม่ใช่ super admin
                                            }));
                                        }}
                                        className="checkbox"
                                    />
                                    <label className="text-red-500">* Is Super Admin</label>
                                </div>

                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex gap-3">
                                    <input
                                        type="checkbox"
                                        name="isMissioner"
                                        checked={formData.isAdmin === 4} // Check if isAdmin is 4
                                        onChange={handleChange}
                                        className="checkbox"
                                    />
                                    <select
                                        id="isBkk"
                                        name="isBkk"
                                        value={formData.isBkk}
                                        onChange={handleChange}
                                        className="select select-bordered select-sm bg-bg"
                                        disabled={formData.isAdmin !== 4} // ถ้า isAdmin ไม่เท่ากับ 4 ให้ disabled
                                    >
                                        <option value="">-- Select Site --</option>
                                        <option value="1">Admin AUOF</option>
                                        <option value="2">Admin AUBR</option>
                                        <option value="3">Admin AUFC</option>
                                    </select>
                                </div>

                            </div>

                        </>
                    )}


                    {/* Checkboxes for other options
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
                    ))} */}

                    {/* Select for Site */}
                    {/* <div className="flex flex-col">
                        <label className="font-medium">Site</label>
                        <select
                            name="site"
                            value={formData.branchCode}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-bg text-button-text"
                        >
                            <option value="">Select Site</option>
                            <option value="AUOF">AUOF - Office</option>
                            <option value="AUFC">AUFC - Factory</option>
                            <option value="AUBR">AUBR - Branch</option>
                        </select>
                    </div> */}
                    {/* New Fields for Thanks Coin */}
                    <div className="flex flex-col">
                        <label className="font-medium">Give Thanks Coin Amount</label>
                        <input
                            type="number"
                            name="thanksCoinAmount"
                            value={thanksCoinAmount}
                            onChange={(e) => setThanksCoinAmount(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Description for Thanks Coin</label>
                        <textarea
                            name="thanksCoinDescription"
                            value={thanksCoinDescription}
                            onChange={(e) => setThanksCoinDescription(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-medium">Give Gae Coin Amount</label>
                        <input
                            type="number"
                            name="kaeCoinAmount"
                            value={kaeCoinAmount}
                            onChange={(e) => setKaeCoinAmount(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Description for Gae Coin</label>
                        <textarea
                            name="kaeCoinDescription"
                            value={kaeCoinDescription}
                            onChange={(e) => setKaeCoinDescription(e.target.value)}
                            className="input input-bordered w-full bg-bg text-button-text"
                        />
                    </div>
                </form>

                <div className="modal-action justify-between">

                    <div className="flex gap-5 items-center">
                        {/* New Button to give Thanks Coin */}
                        <button onClick={handleGiveThanksCoin} className="btn btn-success btn-outline btn-sm">
                            Give Thanks Coin
                        </button>
                        <button onClick={handleGiveKaeCoin} className="btn btn-warning btn-outline btn-sm">
                            Give Kae Coin
                        </button>
                        <button onClick={handlePasswordReset} className="btn btn-error btn-outline btn-sm">
                            Reset Password
                        </button>
                    </div>


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
